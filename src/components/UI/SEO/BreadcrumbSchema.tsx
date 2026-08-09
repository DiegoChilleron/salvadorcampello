import { absoluteUrl } from '@/config/canonicals';
import type { RouteKey } from '@/config/routes';
import type { Locale } from '@/i18n/routing';

interface BreadcrumbSchemaProps {
    /** Migas en orden, de la raíz a la página actual. */
    items: { name: string; key: RouteKey }[];
    locale: Locale;
}

/**
 * BreadcrumbList de Schema.org. Las URLs salen de `absoluteUrl`, que ya resuelve el
 * prefijo de idioma y la barra final: componerlas a mano aquí las desincronizaría del
 * canonical y del sitemap.
 */
export function BreadcrumbSchema({ items, locale }: BreadcrumbSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.key, locale),
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
