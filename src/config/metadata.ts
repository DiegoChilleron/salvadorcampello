import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { OG_LOCALES, SITE_NAME, SITE_URL, TWITTER_HANDLE } from './site';
import { absoluteUrl, generateAlternates } from './canonicals';
import { routeLocales, type RouteKey } from './routes';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Bloque Open Graph completo.
 *
 * Se construye entero en cada nivel a propósito. Next **sustituye** `openGraph` cuando
 * una página lo declara, no lo fusiona con el del layout: al declarar aquí solo la
 * descripción, las páginas de portfolio y las legales se quedaban sin `og:url`,
 * `og:type`, `og:site_name` ni `og:locale`.
 *
 * `title` y `description` se dejan fuera cuando no se pasan: Next los resuelve desde el
 * `title` (con su plantilla ya aplicada) y el `description` del propio objeto Metadata.
 *
 * Sin `images` a propósito: las rellena el convenio de fichero `opengraph-image.tsx` de
 * cada ruta (ver src/lib/og.tsx). Declararlas aquí tendría prioridad sobre el convenio y
 * todas las páginas volverían a compartir imagen.
 */
function buildOpenGraph({
    locale,
    url,
    alternateLocales,
    description,
}: {
    locale: Locale;
    url: string;
    alternateLocales: readonly Locale[];
    description?: string;
}): Metadata['openGraph'] {
    return {
        type: 'website',
        siteName: SITE_NAME,
        url,
        locale: OG_LOCALES[locale],
        alternateLocale: alternateLocales.map((l) => OG_LOCALES[l]),
        ...(description ? { description } : {}),
    };
}

/** Bloque Twitter completo, por el mismo motivo de sustitución que `buildOpenGraph`. */
function buildTwitter(description?: string): Metadata['twitter'] {
    return {
        card: 'summary_large_image',
        site: TWITTER_HANDLE,
        creator: TWITTER_HANDLE,
        ...(description ? { description } : {}),
    };
}

/** Metadatos compartidos por los cuatro layouts de idioma. */
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
        // La home de este idioma, no `SITE_URL`: con la constante, /en/, /ca/ e /it/
        // declaraban la home española mientras su canonical apuntaba a la suya.
        openGraph: buildOpenGraph({
            locale,
            url: absoluteUrl('home', locale),
            alternateLocales: routing.locales.filter((l) => l !== locale),
        }),
        twitter: buildTwitter(),
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
        ...(description ? { description } : {}),
        ...(noindex ? { robots: { index: false, follow: true } } : {}),
        alternates: generateAlternates(key, locale),
        // `routeLocales` y no la lista entera de idiomas: las páginas legales solo
        // existen en castellano, así que no tienen ningún `alternateLocale` que anunciar.
        openGraph: buildOpenGraph({
            locale,
            url: absoluteUrl(key, locale),
            alternateLocales: routeLocales(key).filter((l) => l !== locale),
            description,
        }),
        twitter: buildTwitter(description),
    };
}
