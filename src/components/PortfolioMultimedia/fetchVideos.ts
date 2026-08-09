import { CATEGORY_JSON_PATHS, type CategoryId } from './categories';
import type { Video } from './VideoCard';

const CACHE_TTL = 5 * 60 * 1000;

const videoCache: Record<string, { data: Video[]; timestamp: number }> = {};

/**
 * Descarga el listado de una categoría, quita duplicados por `videoId` y lo
 * cachea en memoria 5 minutos (evita repetir la petición al cambiar de pestaña).
 */
export async function fetchVideos(category: CategoryId): Promise<Video[]> {
    const cached = videoCache[category];
    if (cached && cached.data.length > 0 && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    const response = await fetch(CATEGORY_JSON_PATHS[category]);
    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
    }

    const data: Video[] = await response.json();

    const uniqueVideos: Video[] = [];
    const videoIds = new Set<string>();

    for (const video of data) {
        if (video.videoId && !videoIds.has(video.videoId)) {
            videoIds.add(video.videoId);
            uniqueVideos.push(video);
        }
    }

    videoCache[category] = { data: uniqueVideos, timestamp: Date.now() };

    return uniqueVideos;
}
