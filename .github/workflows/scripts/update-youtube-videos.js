import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Para usar __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_IDS = {
  'telenit': 'PLuilqK3VguH9b5kXPCexKZxuI-6G_GNbm',
  'entrevistas': 'PLuilqK3VguH_dpaQNhXj6OJVE_LBFlltD',
  'eventos': 'PLXAAoPfip6Oc6qOZYHiPsnyfrnRnCc7I6'
};

const BASE_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'assets', 'data');

// Configuración de rate limiting
const RATE_LIMIT_DELAY = 100; // ms entre requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Función para delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Parón de verano: del 1 de agosto al 15 de septiembre no hay emisión, así que lo que
 * aparezca con esas fechas no es un informativo de la temporada.
 *
 * Sin fecha en el título no se excluye, igual que en el corte por congelación.
 */
function isDateInExcludedRange(title) {
  const titleDate = parseTitleDate(title);
  if (titleDate === null) {
    return false;
  }

  const date = new Date(titleDate);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const isAugust = month === 8;
  const isSeptember = month === 9 && day <= 15;

  return isAugust || isSeptember;
}

/**
 * Congelación de catálogo.
 *
 * 'telenit' y 'entrevistas' dejan de crecer: no se añade ningún vídeo posterior al
 * 02/02/2026 (esa fecha sí entra). 'eventos' se sigue actualizando con normalidad.
 *
 * El script reconstruye los JSON desde cero en cada ejecución, así que este filtro no
 * solo frena las altas nuevas: también saca los vídeos posteriores que ya estuvieran en
 * el fichero.
 */
const FROZEN_CATEGORIES = new Set(['telenit', 'entrevistas']);
const FREEZE_DATE = Date.UTC(2026, 1, 2); // 2026-02-02, inclusive

/** Fecha del título (DD/MM/YY o DD/MM/YYYY al final) en ms UTC, o null si no la lleva. */
function parseTitleDate(title) {
  const match = title.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  let yearNum = parseInt(year, 10);

  if (yearNum < 100) {
    yearNum = yearNum < 50 ? 2000 + yearNum : 1900 + yearNum;
  }

  if (monthNum < 1 || monthNum > 12 || dayNum < 1) {
    return null;
  }

  // Ida y vuelta en vez de comprobar `dayNum <= 31`: `Date.UTC(2025, 10, 31)` no falla,
  // desborda en silencio al 1 de diciembre, así que un título acabado en `31/11/25`
  // se evaluaba contra una fecha que no era la suya en los filtros de exclusión y de
  // congelación. El mismo criterio que `parseTitleDate` en src/lib/videos.ts.
  const timestamp = Date.UTC(yearNum, monthNum - 1, dayNum);
  const date = new Date(timestamp);

  if (date.getUTCMonth() !== monthNum - 1 || date.getUTCDate() !== dayNum) {
    return null;
  }

  return timestamp;
}

/**
 * El corte usa la fecha del título, que es la de emisión: es en la que está pensado.
 * Sin fecha en el título (~10% de telenit) no se excluye, que es el lado seguro: es
 * preferible mantener un vídeo de más que perder uno por un título con formato raro.
 */
function isAfterFreezeDate(title) {
  const titleDate = parseTitleDate(title);
  return titleDate !== null && titleDate > FREEZE_DATE;
}

// Función para inicializar el directorio
async function initializeOutputDir() {
  try {
    await fs.access(OUTPUT_DIR);
  } catch {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
}

async function fetchVideosFromPlaylist(playlistId, category, retryCount = 0) {
  let videos = [];
  let nextPageToken = null;
  let excludedCount = 0;
  let frozenCount = 0;
  
  do {
    const params = {
      // `contentDetails` trae `videoPublishedAt`, que es cuando se publicó el vídeo.
      // El `publishedAt` de `snippet` NO sirve: en un `playlistItem` es la fecha en la
      // que el vídeo se añadió a la lista, así que en una playlist rellenada de golpe
      // todos los vídeos comparten fecha.
      part: 'snippet,status,contentDetails',
      maxResults: 50,
      playlistId: playlistId,
      key: API_KEY,
    };
    
    if (nextPageToken) {
      params.pageToken = nextPageToken;
    }
    
    try {
      // Rate limiting
      await delay(RATE_LIMIT_DELAY);
      
      const response = await axios.get(BASE_URL, { 
        params,
        timeout: 10000 // 10 segundo timeout
      });
      
      const items = response.data.items || [];
      
      // Extraer title, videoId y publishedAt, excluyendo videos privados y fechas excluidas
      const parsedVideos = items
        .filter(item => {
          // Filtrar videos privados de forma más robusta
          const title = item.snippet.title?.trim();
          const resourceId = item.snippet.resourceId?.videoId;
          
          if (!title || !resourceId) {
            return false;
          }
          
          // Filtrar videos privados/eliminados
          if (title === "Private video" || 
              title === "Deleted video" ||
              title.includes("[Private]") ||
              title.includes("[Deleted]")) {
            return false;
          }
          
          // Filtrar videos con fechas en el rango excluido (1 agosto - 15 septiembre)
          // Solo aplicar el filtro de fechas a la playlist 'telenit'
          if (category === 'telenit' && isDateInExcludedRange(title)) {
            excludedCount++;
            console.log(`🚫 Excluding video with date in restricted range: ${title}`);
            return false;
          }

          // Catálogo congelado: telenit y entrevistas no crecen más allá del 02/02/2026
          if (FROZEN_CATEGORIES.has(category) && isAfterFreezeDate(title)) {
            frozenCount++;
            console.log(`🧊 Excluding video after freeze date (${category}): ${title}`);
            return false;
          }

          return true;
        })
        // `publishedAt` alimenta el `uploadDate` del VideoObject del portfolio
        // (src/components/UI/SEO/VideoListSchema.tsx), que Google exige para dar por
        // válido el marcado.
        //
        // El fallback cuando falta es la fecha del título (src/lib/videos.ts), la misma
        // que usa `parseTitleDate` aquí arriba para decidir exclusiones.
        .map(item => ({
          title: item.snippet.title.trim(),
          videoId: item.snippet.resourceId.videoId,
          publishedAt: item.contentDetails?.videoPublishedAt
        }));
      
      videos.push(...parsedVideos);
      nextPageToken = response.data.nextPageToken;
      
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.warn(`Error fetching playlist ${playlistId}, retrying (${retryCount + 1}/${MAX_RETRIES}):`, error.message);
        await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
        return fetchVideosFromPlaylist(playlistId, category, retryCount + 1);
      } else {
        console.error(`Error fetching playlist ${playlistId} after ${MAX_RETRIES} retries:`, error.message);
        throw error;
      }
    }
  } while (nextPageToken);
  
  if (frozenCount > 0) {
    console.log(`🧊 Excluded ${frozenCount} videos after the freeze date (02/02/2026) for ${category}`);
  }

  if (excludedCount > 0 && category === 'telenit') {
    console.log(`📊 Excluded ${excludedCount} videos from date range (Aug 1 - Sep 15) for ${category}`);
  }
  
  return videos;
}

async function hasFileChanged(filePath, newContent) {
  try {
    const existingContent = await fs.readFile(filePath, 'utf8');
    return existingContent !== newContent;
  } catch {
    return true; // Si el archivo no existe, consideramos que ha cambiado
  }
}

async function updateVideoListing() {
  if (!API_KEY) {
    throw new Error('YOUTUBE_API_KEY environment variable is required');
  }

  const results = await Promise.allSettled(
    Object.entries(PLAYLIST_IDS).map(async ([category, playlistId]) => {
      console.log(`Fetching videos for ${category}...`);
      
      try {
        const videos = await fetchVideosFromPlaylist(playlistId, category);
        console.log(`Found ${videos.length} videos for ${category}`);
        
        // Generar contenido JSON formateado
        const jsonContent = JSON.stringify(videos, null, 2);
        const outputPath = path.join(OUTPUT_DIR, `listado_${category}.json`);
        
        // Solo escribir si el contenido ha cambiado
        if (await hasFileChanged(outputPath, jsonContent)) {
          await fs.writeFile(outputPath, jsonContent);
          console.log(`✅ Updated ${outputPath}`);
          return { category, updated: true, count: videos.length };
        } else {
          console.log(`⏭️  No changes for ${category}`);
          return { category, updated: false, count: videos.length };
        }
      } catch (error) {
        console.error(`❌ Error updating ${category} listing:`, error.message);
        return { category, error: error.message };
      }
    })
  );

  // Resumen de resultados
  const successful = results.filter(result => result.status === 'fulfilled' && !result.value.error);
  const failed = results.filter(result => result.status === 'rejected' || result.value?.error);
  const updated = successful.filter(result => result.value.updated);

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`🔄 Updated: ${updated.length}`);
  console.log(`❌ Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log(`\n❌ Failed categories:`);
    failed.forEach(result => {
      const category = result.value?.category || 'unknown';
      const error = result.value?.error || result.reason?.message || 'Unknown error';
      console.log(`  - ${category}: ${error}`);
    });
  }

  // Si hay errores críticos, fallar el proceso
  if (successful.length === 0) {
    throw new Error('All playlist updates failed');
  }
}

// Ejecutar la actualización
(async () => {
  try {
    console.log('🚀 Starting YouTube video listings update...');
    await initializeOutputDir();
    await updateVideoListing();
    console.log('✅ All video listings updated successfully!');
  } catch (error) {
    console.error('❌ Error updating video listings:', error.message);
    process.exit(1);
  }
})();