import { getTranslations } from 'next-intl/server';

import { absoluteUrl } from '@/config/canonicals';
import { JsonLdScript } from '@/lib/jsonLd';
import { SCHEMA_LIMIT_PER_CATEGORY, videoUploadDate } from '@/lib/videos';
import { CATEGORY_IDS, type CategoryId } from '@/components/PortfolioMultimedia/categories';
import type { Video } from '@/components/PortfolioMultimedia/VideoCard';
import type { Locale } from '@/i18n/routing';

/** Claves de `PortfolioMultimedia` con la descripción de cada categoría. */
const CATEGORY_DESCRIPTION_KEYS: Record<CategoryId, string> = {
    telenit: 'description1',
    entrevistas: 'description2',
    eventos: 'description3',
};

interface VideoListSchemaProps {
    videos: Record<CategoryId, Video[]>;
    locale: Locale;
}

/**
 * `ItemList` de `VideoObject` para el catálogo del portfolio.
 *
 * El vídeo es el activo principal del sitio y no tenía ningún marcado, así que Google no
 * podía enterarse de que estas páginas son un listado de vídeos. Los campos que la API de
 * YouTube no guarda en los JSON se derivan del `videoId`, que es estable.
 *
 * Se emiten como mucho `SCHEMA_LIMIT_PER_CATEGORY` por categoría: el JSON-LD viaja en el
 * HTML de las cuatro páginas de idioma, y marcar los 1.712 telenit multiplicaría el peso
 * para repetir titulares de informativo casi idénticos.
 */
export async function VideoListSchema({ videos, locale }: VideoListSchemaProps) {
    const t = await getTranslations({ locale, namespace: 'PortfolioMultimedia' });
    const page = await getTranslations({ locale, namespace: 'PortfolioPage' });

    const portfolioUrl = absoluteUrl('portfolio', locale);
    // Mismo nodo `Person` que el grafo de la home (_components/JsonLd.tsx), por
    // referencia: repetirlo aquí crearía una segunda entidad para la misma persona.
    const personId = `${absoluteUrl('home', locale)}#person`;

    const items = CATEGORY_IDS.flatMap((category) =>
        videos[category].slice(0, SCHEMA_LIMIT_PER_CATEGORY).map((video) => ({
            video,
            uploadDate: videoUploadDate(video),
            categoryDescription: t(CATEGORY_DESCRIPTION_KEYS[category]),
        })),
    )
        // Sin `uploadDate` el `VideoObject` es inválido para Google: mejor dejar fuera
        // ese vídeo que llenar Search Console de avisos.
        .filter((item) => item.uploadDate !== null);

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: page('title'),
        description: page('metaDescription'),
        url: portfolioUrl,
        numberOfItems: items.length,
        itemListElement: items.map(({ video, uploadDate, categoryDescription }, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'VideoObject',
                name: video.title,
                description: `${video.title}. ${categoryDescription}`,
                thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
                uploadDate,
                embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
                // La página del listado a secas, sin `#videoId`: las tarjetas no llevan
                // ese ancla, así que el fragmento prometía una posición que no existe y
                // los 114 nodos acababan apuntando al principio de la misma página. No
                // se puede añadir el `id` a la tarjeta porque hay 3 vídeos que están en
                // dos categorías, y las tres pestañas se renderizan a la vez: serían
                // `id` duplicados en el documento.
                url: portfolioUrl,
                // El idioma de la página no es el del vídeo: el catálogo está en
                // castellano se mire desde /en/, /ca/ o /it/.
                inLanguage: 'es',
                creator: { '@id': personId },
                publisher: { '@id': personId },
            },
        })),
    };

    return <JsonLdScript data={schema} />;
}
