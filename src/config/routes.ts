import { routing, type Locale } from '@/i18n/routing';

/**
 * Mapa único de rutas. Mantiene sincronizados canonical, hreflang, sitemap y
 * los enlaces internos. Cada idioma declara su propio segmento; si una ruta no
 * existe en un idioma, se sirve la versión española (ver `routePath`).
 *
 * Las rutas españolas deben coincidir exactamente con las ya indexadas.
 */
export const routes = {
    home: { es: '/', en: '/', ca: '/', it: '/' },
    portfolio: { es: '/portfolio', en: '/portfolio', ca: '/portfolio', it: '/portfolio' },
    // Páginas legales: solo existen en castellano.
    legalNotice: { es: '/aviso-legal' },
    privacyPolicy: { es: '/politica-de-privacidad' },
    cookiesPolicy: { es: '/politica-de-cookies' },
} as const satisfies Record<string, Partial<Record<Locale, string>>>;

export type RouteKey = keyof typeof routes;

/** Rutas traducidas a los cuatro idiomas (las que llevan hreflang y sitemap multiidioma). */
export const localizedRouteKeys = ['home', 'portfolio'] as const satisfies readonly RouteKey[];

/** Rutas que solo existen en castellano. */
export const spanishOnlyRouteKeys = [
    'legalNotice',
    'privacyPolicy',
    'cookiesPolicy',
] as const satisfies readonly RouteKey[];

/** Devuelve el segmento de una ruta en el idioma indicado, con fallback a español. */
export function routePath(key: RouteKey, locale: Locale): string {
    const paths = routes[key] as Partial<Record<Locale, string>>;
    return paths[locale] ?? routes[key].es;
}

/**
 * Href absoluto dentro del sitio, con prefijo de idioma cuando toca y barra
 * final (`trailingSlash: true`).
 *
 * Se usa en lugar de `<Link locale="…">` de next-intl: ese prop fuerza el
 * prefijo incluso para el idioma por defecto (`/es/aviso-legal/`), una URL que
 * el export estático no genera.
 */
export function localeHref(key: RouteKey, locale: Locale): string {
    const path = routePath(key, locale);
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    return `${prefix}${path === '/' ? '/' : `${path}/`}`;
}

/** Idiomas en los que existe la ruta. */
export function routeLocales(key: RouteKey): Locale[] {
    const paths = routes[key] as Partial<Record<Locale, string>>;
    return routing.locales.filter((locale) => paths[locale] !== undefined);
}

/**
 * Búsqueda inversa: dado un pathname sin prefijo de idioma (el que devuelve
 * `usePathname` de next-intl), devuelve la clave de ruta. Lo usa el selector de
 * idioma para saltar a la URL equivalente en vez de a la home.
 */
export function routeKeyFromPath(pathname: string, locale: Locale): RouteKey | null {
    const normalized = pathname !== '/' ? pathname.replace(/\/$/, '') : '/';

    for (const key of Object.keys(routes) as RouteKey[]) {
        if (routePath(key, locale) === normalized) return key;
    }

    return null;
}
