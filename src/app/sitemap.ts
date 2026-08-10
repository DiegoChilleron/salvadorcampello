import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/config/canonicals';
import { routeLocales, type RouteKey } from '@/config/routes';
import { SITE_LAST_MODIFIED } from '@/config/site';
import { routing } from '@/i18n/routing';

// Requerido por `output: 'export'` en las rutas de metadatos.
export const dynamic = 'force-static';

/**
 * Se genera desde el mapa de `routes.ts`, así que añadir una ruta allí la mete
 * automáticamente aquí en todos los idiomas en los que exista.
 */
// Las legales no están aquí: las tres declaran `noindex` en su `generateMetadata`, y un
// sitemap es la lista de lo que quieres que se indexe. Enviarlas pedía indexar justo lo
// que la página prohíbe indexar. Si dejan de ser `noindex`, vuelven.
const PAGES: { key: RouteKey; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] =
    [
        { key: 'home', priority: 1.0, changeFrequency: 'weekly' },
        { key: 'portfolio', priority: 0.8, changeFrequency: 'weekly' },
    ];

export default function sitemap(): MetadataRoute.Sitemap {
    return PAGES.flatMap(({ key, priority, changeFrequency }) => {
        const locales = routeLocales(key);

        return locales.map((locale) => ({
            url: absoluteUrl(key, locale),
            lastModified: SITE_LAST_MODIFIED,
            priority,
            changeFrequency,
            alternates: {
                languages: {
                    ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(key, l)])),
                    // Mismo `x-default` que el <head> (ver generateAlternates): sin él,
                    // el sitemap y la página declaraban conjuntos de hreflang distintos
                    // para la misma URL.
                    ...(locales.includes(routing.defaultLocale)
                        ? { 'x-default': absoluteUrl(key, routing.defaultLocale) }
                        : {}),
                },
            },
        }));
    });
}
