import type { AbstractIntlMessages } from 'next-intl';

/**
 * Namespaces que consumen componentes de cliente. El resto se resuelve en
 * servidor, así que no hace falta serializarlo dentro del HTML de cada página.
 *
 * - `Navbar`        → components/Navbar/Navbar.tsx
 * - `PortfolioPage` → los dos componentes de /portfolio/
 * - `VideoCard`     → components/PortfolioMultimedia/VideoCard.tsx
 * - `DialogYoutube` → components/PortfolioMultimedia/DialogYoutube.tsx
 *
 * `VideoCard` y `DialogYoutube` se montan desde la home y desde /portfolio/, y
 * en ambos casos sus padres ya son de cliente, así que no se les pueden pasar
 * los textos como props desde servidor (que es lo que hace el Footer con el
 * LanguageSelector). Por eso van aquí, con las claves justas.
 *
 * OJO: "use client" es transitivo para los imports. Un componente sin la
 * directiva pero importado desde uno que sí la tiene también es cliente y
 * necesita su namespace aquí. Si falta, next-intl **no lanza**: renderiza la
 * clave literal ("Hero.description.paragraph1"). Por eso `assertClientMessages`
 * hace ruido en desarrollo.
 */
export const CLIENT_NAMESPACES = [
    'Navbar',
    'PortfolioPage',
    'VideoCard',
    'DialogYoutube',
] as const;

export function pickMessages(
    messages: AbstractIntlMessages,
    namespaces: readonly string[],
): AbstractIntlMessages {
    return Object.fromEntries(
        namespaces.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
    );
}

/**
 * Handler de errores del provider: en desarrollo convierte un mensaje ausente
 * en excepción (para que salte al primer vistazo); en producción deja el
 * comportamiento por defecto, que degrada a mostrar la clave en vez de romper
 * la página.
 */
export function onClientMessageError(error: Error) {
    if (process.env.NODE_ENV === 'development') {
        throw error;
    }
    console.error(error);
}
