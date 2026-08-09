export const SITE_URL = 'https://salvadorcampello.com';

export const SITE_NAME = 'Salvador Campello';

export const CONTACT_EMAIL = 'contacto@salvadorcampello.com';

/**
 * Zona horaria única para next-intl, en servidor y en cliente.
 *
 * Sin ella, `use-intl` avisa con `ENVIRONMENT_FALLBACK` en el primer render de
 * servidor porque el formateo de fechas caería en la zona del entorno, que no es
 * la misma en el build que en el navegador de quien visita. Como
 * `onClientMessageError` convierte el aviso en excepción durante el desarrollo,
 * ese primer render del Navbar fallaba y React se caía a cliente, con el error
 * engañoso de que faltaba el contexto de `NextIntlClientProvider`.
 */
export const SITE_TIME_ZONE = 'Europe/Madrid';

/**
 * Última modificación estructural del sitio. Alimenta el `<lastmod>` del sitemap y el
 * `dateModified` del JSON-LD.
 *
 * Se actualiza **a mano** al publicar un cambio de contenido o de estructura. No usar
 * `new Date()`: cambiaría la fecha en cada build y le pediría a los rastreadores que
 * volvieran a recorrer todo el sitio sin que nada hubiera cambiado.
 *
 * Tampoco se deriva de los listados de vídeo: el HTML no debe depender de los JSON que
 * la Action reescribe cada noche.
 */
export const SITE_LAST_MODIFIED = '2026-08-09';

export const SOCIAL_LINKS = {
    instagram: 'https://www.instagram.com/salvaelx/',
    facebook: 'https://www.facebook.com/campelloiborra',
    twitter: 'https://twitter.com/SalvaElx',
    linkedin: 'https://es.linkedin.com/in/salvadorcampelloiborra',
} as const;
