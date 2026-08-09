import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SITE_NAME, SITE_URL } from './site';
import { generateAlternates } from './canonicals';
import type { RouteKey } from './routes';
import type { Locale } from '@/i18n/routing';

/**
 * Metadatos compartidos por los cuatro layouts de idioma.
 *
 * Sin `openGraph.images` ni `twitter.images` a propósito: las rellena el convenio de
 * fichero `opengraph-image.tsx` de cada ruta (ver src/lib/og.tsx). Declararlas aquí
 * tendría prioridad sobre el convenio y todas las páginas volverían a compartir imagen.
 */
export async function buildLayoutMetadata(locale: Locale): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            // `default` es el title de la home, no el nombre del sitio a secas: con
            // `Salvador Campello` se desaprovechaban ~40 de los ~60 caracteres útiles
            // en SERP y no aparecía ninguno de los términos por los que se le busca.
            default: t('title'),
            template: `%s | ${SITE_NAME}`,
        },
        description: t('description'),
        authors: [{ name: SITE_NAME, url: SITE_URL }],
        manifest: '/site.webmanifest',
        icons: {
            icon: [
                { url: '/assets/icons/favicon.ico', sizes: '48x48' },
                { url: '/assets/icons/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
            ],
            apple: '/assets/icons/apple-touch-icon.png',
        },
        openGraph: {
            type: 'website',
            siteName: SITE_NAME,
            title: SITE_NAME,
            description: t('shortDescription'),
            url: SITE_URL,
            locale,
        },
        twitter: {
            card: 'summary_large_image',
            title: SITE_NAME,
            description: t('shortDescription'),
        },
    };
}

/** Metadatos de una página concreta: título, descripción, canonical y hreflang. */
export function buildPageMetadata({
    key,
    locale,
    title,
    description,
    noindex = false,
}: {
    key: RouteKey;
    locale: Locale;
    title?: string;
    description?: string;
    /** Fuera del índice pero siguiendo enlaces. Para páginas de relleno legal. */
    noindex?: boolean;
}): Metadata {
    return {
        ...(title ? { title } : {}),
        ...(description ? { description, openGraph: { description }, twitter: { description } } : {}),
        ...(noindex ? { robots: { index: false, follow: true } } : {}),
        alternates: generateAlternates(key, locale),
    };
}
