import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { SITE_URL } from './site';
import { localeHref, routeLocales, type RouteKey } from './routes';

/** URL absoluta de una ruta en un idioma. */
export function absoluteUrl(key: RouteKey, locale: Locale): string {
    return `${SITE_URL}${localeHref(key, locale)}`;
}

/**
 * Canonical + hreflang de una ruta. Solo declara los idiomas en los que la
 * ruta existe realmente (las páginas legales solo están en castellano).
 */
export function generateAlternates(key: RouteKey, locale: Locale): Metadata['alternates'] {
    const locales = routeLocales(key);

    const languages = Object.fromEntries(
        locales.map((l) => [l, absoluteUrl(key, l)]),
    ) as Record<string, string>;

    if (locales.includes(routing.defaultLocale)) {
        languages['x-default'] = absoluteUrl(key, routing.defaultLocale);
    }

    return {
        canonical: absoluteUrl(key, locale),
        languages,
    };
}
