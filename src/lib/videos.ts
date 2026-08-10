import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
    CATEGORY_IDS,
    CATEGORY_JSON_PATHS,
    type CategoryId,
} from '@/components/PortfolioMultimedia/categories';
import type { Video } from '@/components/PortfolioMultimedia/VideoCard';

/**
 * Lectura en build de los listados de vídeo, para que el portfolio llegue al HTML con
 * contenido en vez de con un contenedor vacío.
 *
 * Antes los 1.813 vídeos entraban solo por `fetchVideos` (fetch en cliente), así que
 * `/portfolio/` servía 352 caracteres de texto. Los rastreadores de IA que `robots.ts`
 * invita expresamente —GPTBot, PerplexityBot, ClaudeBot, OAI-SearchBot— no ejecutan
 * JavaScript y no veían absolutamente nada del catálogo.
 *
 * Funciona con `output: 'export'` porque el prerenderizado ocurre en build, con runtime
 * Node. La Action nocturna commitea los JSON a `main`, lo que dispara un despliegue: el
 * HTML se regenera con ellos y no se queda atrás.
 *
 * Este módulo es solo de servidor. No lleva `server-only` (no está en el árbol de
 * dependencias) pero `node:fs` cumple la misma función: Next se niega a meter un builtin
 * de Node en el bundle de cliente, así que importarlo desde un `'use client'` rompe el
 * build en vez de colar el fichero entero al navegador.
 */

/**
 * Cuántos vídeos de cada categoría se prerenderizan.
 *
 * Entrevistas (60) y eventos (41) caben enteras. Telenit son 1.712: meterlas todas
 * multiplicaría por siete el peso del HTML para indexar titulares de informativo casi
 * idénticos entre sí, así que se corta en los más recientes. El resto sigue llegando por
 * `fetchVideos` al hidratar, de modo que la búsqueda y el «cargar más» siguen viendo el
 * catálogo completo.
 */
const PRERENDER_LIMITS: Record<CategoryId, number> = {
    telenit: 150,
    entrevistas: Number.POSITIVE_INFINITY,
    eventos: Number.POSITIVE_INFINITY,
};

/** Cuántos `VideoObject` se emiten por categoría en el JSON-LD (ver VideoListSchema). */
export const SCHEMA_LIMIT_PER_CATEGORY = 50;

/** Los cuatro idiomas prerenderizan las mismas listas: se leen y parsean una sola vez. */
const cache = new Map<CategoryId, Video[]>();

/**
 * Deduplica por `videoId` con el mismo criterio que `fetchVideos`: las playlists de
 * YouTube repiten vídeos y una clave de React duplicada rompe el render.
 */
function readCategory(category: CategoryId): Video[] {
    const cached = cache.get(category);
    if (cached) return cached;

    const file = path.join(process.cwd(), 'public', CATEGORY_JSON_PATHS[category]);
    const data = JSON.parse(readFileSync(file, 'utf8')) as Video[];

    const seen = new Set<string>();
    const videos = data.filter((video) => {
        if (!video.videoId || seen.has(video.videoId)) return false;
        seen.add(video.videoId);
        return true;
    });

    cache.set(category, videos);
    return videos;
}

/** Listados recortados, con todos sus campos. Es lo que consume el schema. */
export function getInitialVideos(): Record<CategoryId, Video[]> {
    return Object.fromEntries(
        CATEGORY_IDS.map((category) => [
            category,
            readCategory(category).slice(0, PRERENDER_LIMITS[category]),
        ]),
    ) as Record<CategoryId, Video[]>;
}

/**
 * Los mismos listados, recortados a lo que la tarjeta pinta de verdad.
 *
 * Lo que se pasa a un componente de cliente viaja dos veces en el HTML: una en el DOM
 * ya renderizado y otra, en JSON, dentro del payload RSC que React necesita para
 * hidratar. `publishedAt` solo alimenta el `uploadDate` de `VideoListSchema`, que se
 * resuelve en el servidor, y `thumbnail` no lo lee nadie —`VideoCard` construye la URL
 * de la miniatura desde el `videoId`—, así que arrastrarlos hasta el navegador son
 * ~10 KB por página y por idioma que ningún rastreador ve y ningún usuario usa.
 */
export function toClientVideos(
    videos: Record<CategoryId, Video[]>,
): Record<CategoryId, Video[]> {
    return Object.fromEntries(
        CATEGORY_IDS.map((category) => [
            category,
            videos[category].map(({ videoId, title }) => ({ videoId, title })),
        ]),
    ) as Record<CategoryId, Video[]>;
}

/** Los primeros `count` de cada categoría. Lo usa la vista de la home. */
export function getPreviewVideos(count: number): Record<CategoryId, Video[]> {
    return Object.fromEntries(
        CATEGORY_IDS.map((category) => [category, readCategory(category).slice(0, count)]),
    ) as Record<CategoryId, Video[]>;
}

/**
 * Fecha del título (`… - 30/10/2025`), en ISO.
 *
 * Es la misma lógica que ya usa la Action para decidir qué vídeos excluye
 * (.github/workflows/scripts/update-youtube-videos.js). Se replica aquí porque ese script
 * no es importable desde la app, y porque hasta que la Action vuelva a correr los JSON no
 * traen `publishedAt`: sin este parser no habría `uploadDate` para casi ningún vídeo.
 */
export function parseTitleDate(title: string): string | null {
    const match = title.trim().match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (!match) return null;

    const [, day, month, year] = match;
    const dayNum = Number(day);
    const monthNum = Number(month);
    let yearNum = Number(year);

    if (yearNum < 100) yearNum = yearNum < 50 ? 2000 + yearNum : 1900 + yearNum;

    // Ida y vuelta por `Date.UTC` en vez de comprobar `dayNum <= 31`: con el tope fijo,
    // un `31/11/25` pasaba el filtro y se emitía como `2025-11-31`, un día que no existe
    // y que Google rechaza. `Date` no avisa, desborda en silencio al mes siguiente, así
    // que la única forma de detectarlo es comparar lo que sale con lo que entró.
    const date = new Date(Date.UTC(yearNum, monthNum - 1, dayNum));

    if (
        date.getUTCFullYear() !== yearNum ||
        date.getUTCMonth() !== monthNum - 1 ||
        date.getUTCDate() !== dayNum
    ) {
        return null;
    }

    return date.toISOString().slice(0, 10);
}

/**
 * `uploadDate` para el schema. `publishedAt` (lo que devuelve la API de YouTube) manda
 * sobre la fecha del título, que es la de emisión.
 *
 * Devuelve `null` cuando no hay ninguna de las dos: un `VideoObject` sin `uploadDate` es
 * inválido para Google, así que esos vídeos se quedan fuera del marcado en vez de llenar
 * Search Console de avisos.
 */
export function videoUploadDate(video: Video): string | null {
    return video.publishedAt ?? parseTitleDate(video.title);
}
