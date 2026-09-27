# Web de Salvador Campello

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + next-intl, con exportación
estática (`output: 'export'`).

<https://salvadorcampello.com>

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # genera el sitio estático en out/
npm run lint
```

`npm run build` deja el sitio listo para subir en `out/`. No hay servidor: nada de
API routes, middleware ni imágenes optimizadas en tiempo de ejecución.

`npm run build` no es solo `next build`: antes regenera `public/llms.txt` (`prebuild`) y
después comprueba que no quedan claves de traducción sin resolver (`check-i18n`) y que cada
imagen Open Graph tiene su cabecera (`check-headers`). **Es el comando que tiene que usar
Cloudflare Pages** (ver [Cloudflare Pages](#cloudflare-pages)).

## Idiomas y rutas

Cuatro idiomas con URL propia. Como `output: 'export'` no permite middleware, cada
idioma es un árbol de carpetas real bajo `src/app/`:

| Idioma | Prefijo | Carpeta |
|---|---|---|
| Español (por defecto) | sin prefijo | `src/app/(es)/` |
| English | `/en` | `src/app/en/` |
| Valencià | `/ca` | `src/app/ca/` |
| Italiano | `/it` | `src/app/it/` |

No hay `src/app/layout.tsx`: el `layout.tsx` de cada idioma es su *root layout*
(renderiza `<html lang>`) y delega en `src/app/_components/BaseLayout.tsx`, que
concentra fuente, provider de next-intl, JSON-LD, navbar y footer.

**`src/config/routes.ts` es la fuente única de la verdad** de las rutas: de ahí salen
canonical, hreflang, sitemap y los enlaces internos. Para añadir una página:

1. Registrar la ruta en `src/config/routes.ts` con su segmento en cada idioma.
2. Crear la carpeta en cada árbol donde exista la página.
3. Llamar a `setRequestLocale(locale)` en la page (obligatorio con exportación estática).
4. Añadir `generateMetadata` con `buildPageMetadata({ key, locale, ... })`.
5. Añadir las traducciones en los cuatro `src/messages/*.json`.
6. Añadirla al array `PAGES` de `src/app/sitemap.ts`.

Las páginas legales (aviso legal, privacidad, cookies) solo existen en castellano.
Desde los otros idiomas se enlazan con `localeHref(key, 'es')`, que devuelve la URL
sin prefijo.

> Para enlaces internos usar el `Link` de `@/i18n/navigation` con `routePath(key, locale)`,
> nunca una ruta literal. Para cruzar de idioma, usar `localeHref(key, locale)` con un
> `<a>` normal: el prop `locale` de `<Link>` fuerza el prefijo también en español
> (`/es/…`), una URL que el export no genera.

`SITE_TIME_ZONE` (`src/config/site.ts`) se declara **en los dos lados**: en
`src/i18n/request.ts` para el servidor y en `IntlProvider` para el cliente. Sin ella
next-intl avisa con `ENVIRONMENT_FALLBACK` en el primer render de servidor, y como
`onClientMessageError` convierte los avisos en excepción durante el desarrollo, ese
render fallaba y React se caía a cliente con un error engañoso sobre el contexto de
`NextIntlClientProvider`.

## Datos de vídeo

Los listados de YouTube son JSON en `public/assets/data/`. Los reconstruye cada noche el
workflow `.github/workflows/update-videos.yml` (secreto `YOUTUBE_API_KEY`) y, si cambian, los
commitea en `main`, lo que dispara un despliegue de Cloudflare Pages.

- **Catálogo congelado**: `telenit` y `entrevistas` no admiten nada posterior al 02/02/2026
  (`FROZEN_CATEGORIES` en el script). `telenit` excluye además el parón de verano
  (1 de agosto a 15 de septiembre). `eventos` se actualiza con normalidad.
- **Fecha del título**: los dos filtros la leen del final del título con `parseTitleDate`, que
  acepta barra, espacio, punto o guion (`… - 02/02/26`, `TELENIT 14 08 26`, `… - 02/08 /2024`).
  Solo con barras, los títulos con espacios no tenían fecha y se colaban (así entró
  «TELENIT 14 08 26» en un catálogo congelado). `src/lib/videos.ts` tiene la misma función
  para el `uploadDate` del JSON-LD: **mantener las dos iguales**. Un título sin fecha
  reconocible no se excluye (se prefiere un vídeo de más a perder uno).
- **Uso en la web**: las páginas leen los JSON en build (`src/lib/videos.ts`). `/portfolio/`
  prerenderiza hasta 150 de telenit y todas las entrevistas y eventos; el resto llega por
  `fetchVideos` (cliente, caché de 5 minutos) al buscar o cargar más.

## SEO técnico

- **Imágenes Open Graph por página**: `src/lib/og.tsx` es el punto único de diseño y cada
  ruta la usa desde su `opengraph-image.tsx` (convenio de Next: rellena `og:image` y
  `twitter:image` solos). Se renderizan en build, que es lo que lo hace compatible con
  `output: 'export'`.
  - satori **no lee woff2**, así que la fuente de las OG son las estáticas
    `src/assets/fonts/OpenSans-{Regular,Bold}.woff`. La web sigue usando el woff2 variable
    vía `next/font/local`; son dos cosas independientes.
  - `src/config/metadata.ts` **no** declara `openGraph.images`: hacerlo tendría prioridad
    sobre el convenio de fichero y todas las páginas volverían a compartir imagen.
  - next/og escribe los ficheros **sin extensión**, así que `public/_headers` les fija
    `Content-Type: image/png`. Sin eso los scrapers de WhatsApp, X y LinkedIn los
    descartan y la tarjeta sale sin imagen. Va una regla exacta y otra `-*` por carpeta,
    porque Pages solo admite un comodín por regla: la antigua `/*opengraph-image*` no casaba
    con nada. **Al añadir una página con OG, añadir su par de reglas**; si falta,
    `scripts/check-headers.mjs` hace fallar el build.
- **`robots.ts`** declara explícitamente los crawlers de IA (GPTBot, PerplexityBot,
  ClaudeBot, CCBot, Applebot-Extended…) además de los buscadores tradicionales.
- **`llms.txt`** lo genera `scripts/generate-llms.mjs` en el `prebuild`, a partir de
  `src/messages/es.json` y de los listados de vídeo, para que no pueda divergir del
  contenido real. Solo ocurre si el build es `npm run build`.
- **Las páginas legales** son `noindex` y están fuera del sitemap: un sitemap es la lista
  de lo que quieres que se indexe.
- **JSON-LD**: `WebSite` + `Person` en todas las páginas y `BreadcrumbSchema` en portfolio
  y legales. `/portfolio/` añade un `ItemList` de `VideoObject` (`VideoListSchema`, hasta 50
  por categoría) con los vídeos prerenderizados.
- **Frescura**: `SITE_LAST_MODIFIED` en `src/config/site.ts` alimenta el `<lastmod>` del
  sitemap y el `dateModified` del JSON-LD. Se actualiza a mano al publicar un cambio
  estructural; con `new Date()` cambiaría en cada build y forzaría recrawleo innecesario.

## Los vídeos van en el HTML

`/portfolio/` prerenderiza las tarjetas y su JSON-LD en build a partir de los JSON. Es
seguro porque cada commit de la Action nocturna redespliega el sitio en Cloudflare Pages:
el HTML se regenera con los mismos datos y no se queda atrás.

Antes la regla era la contraria (ningún dato de vídeo en el HTML), y `/portfolio/` servía
~43 palabras indexables: el catálogo era invisible para buscadores y para los rastreadores
de IA que `robots.ts` invita, que no ejecutan JavaScript.

> Si algún día los JSON se actualizaran sin redesplegar (subiéndolos aparte), el HTML
> quedaría desincronizado: el prerender depende de que datos y despliegue vayan juntos.

## Estilos

Un único `src/app/globals.css` con `@import "tailwindcss"`, el `@theme` de la paleta
(`lightprimary`, `darkprimary`, …) y las clases del sitio. La fuente Open Sans se
carga con `next/font/local` desde `src/app/fonts.ts`.

La fuente es `src/fonts/OpenSans-Latin-Variable.woff2` (63 KB), un recorte del original
de Google (`src/fonts/source/`, 274 KB): solo latín (con Latin Extended-A, que trae la «ŀ»
del valenciano) y solo el eje de peso. Como se precarga en todas las páginas, el original
competía con las imágenes del hero en la carga inicial. Si se cambia la fuente de origen,
regenerarla con `scripts/subset-font.sh` (requiere fonttools).

## Server vs Client Components

Por defecto los componentes son Server Components. Solo llevan `"use client"` los
que necesitan estado o eventos: `CardCV`, `CopyBioButton`, `GalleryScrollButton`,
`Navbar`, `LanguageSelector`, `VideoCard`, `DialogYoutube`, los dos de `/portfolio/`,
`Page404`, y en `src/app/_components/` `IntlProvider`, `RevealOnScroll` y `ScrollToHash`.

Dos patrones que se repiten para no arrastrar contenido al bundle de cliente
(`"use client"` es **transitivo para los imports**):

- **Contenido como `children`**: `HorizontalGallery` (servidor) renderiza los 8
  `<GalleryItem>` y solo los botones de desplazamiento son cliente
  (`GalleryScrollButton`); la page pasa `<Description />` a `<Hero>`. Así las imágenes y
  las traducciones se resuelven en servidor.
- **Extraer solo lo interactivo**: `Curriculum` es Server Component y delega el
  estado en `CopyBioButton`.

Y dos reglas para que cada página cargue solo su JS:

- **Imports directos**: cada componente se importa desde su archivo
  (`@/components/Hero/Hero`); no hay barrel. Con `export *` en un `index.ts`, cualquier
  import arrastraba todos los componentes de cliente al JS de todas las páginas: las
  legales y la 404 cargaban el diálogo de YouTube y la carga de vídeos.
- **Sin `next/image`**: con el export estático no optimiza nada y añade su runtime. Las
  imágenes importadas van con `StaticImg` (`src/components/UI/StaticImg.tsx`), que
  conserva `width`/`height`, `loading="lazy"` y `decoding="async"`.

`src/i18n/clientMessages.ts` define `CLIENT_NAMESPACES`: los únicos namespaces
que se serializan dentro del HTML. Si un componente de cliente usa uno que no
está en la lista, next-intl **no lanza**, imprime la clave literal — por eso
`npm run build` ejecuta `scripts/check-i18n.mjs`, que falla si alguna página
exportada contiene claves sin resolver.

## Animaciones

Todo son **animaciones CSS de disparo único** salvo el hero.

`src/app/_components/RevealOnScroll.tsx` monta un único IntersectionObserver para
toda la página: cuando un `[data-reveal]` asoma, le añade `is-visible` y la
animación CSS se reproduce sola durante su duración, una sola vez (equivale al
`whileInView` + `viewport={{ once: true }}` que había con motion). Al ser un solo
observer global, los componentes animados **siguen siendo Server Components**.

Uso desde el JSX — el atributo elige los keyframes; no hay que tocar el observer:

```tsx
<div data-reveal="fade-up" />
<div data-reveal="fade-up" style={{ '--stagger': index } as React.CSSProperties} />
<div data-reveal="slide-left" style={{ '--reveal-duration': '2s' } as React.CSSProperties} />
```

Valores: `fade-in`, `fade-up`, `fade-left`, `fade-right`, `slide-left` (desplaza
300 px sin cambiar la opacidad) y `zoom-in`. `--reveal-duration` por defecto
`0.8s`; `--stagger` (entero) escalona 0,2 s por posición.

Tres cosas que el observer resuelve y conviene no romper:

- **MutationObserver**: las tarjetas de vídeo del home se insertan al terminar el
  `fetch`, después del barrido inicial.
- **Barrido en scroll**: un IntersectionObserver solo avisa al *cruzar* un umbral.
  Un elemento que pasa de estar por debajo del viewport a estar por encima sin
  llegar a intersecar (restaurar el scroll al recargar, un salto brusco) nunca lo
  cruza y se quedaría invisible para siempre.
- **`html.js-reveal`**: el estado inicial oculto solo se aplica bajo esa clase,
  que añade el propio observer. Sin JS no se oculta nada.

Con `prefers-reduced-motion: reduce` no se declara ningún estado inicial ni
animación: todo visible y quieto, incluido el parpadeo del televisor del 404.

### El hero

Su coreografía —doce animaciones sobre cinco capas a lo largo de 3.500 px de scroll—
vive entera en la sección `HERO` de `globals.css`, con `animation-timeline: scroll(root
block)` y `animation-range` en píxeles absolutos. Los rangos son los mismos que tenían
los `useTransform` de motion, que ya no se usa en el proyecto.

`Hero` es por tanto un **Server Component**. Al no haber JS, `calc(-100vw - 200px)`
sustituye al `-(windowWidth + 200)` que obligaba a un `useState` y un listener de resize.

**Fallback obligatorio**: las capas son `position: fixed` solo dentro del `@supports`.
Sin `animation-timeline` (Safari <26, Firefox <144) o con `prefers-reduced-motion:
reduce` pasan a `absolute`, así que se quedan dentro del hero y la descripción scrollea
limpia por debajo, en vez de quedar cinco imágenes pegadas al viewport tapando el texto
durante 3.500 px. La segunda cámara se oculta: solo tiene sentido como relevo animado de
la primera.

> El orden importa: el bloque de fallback va **antes** del `@supports`. Tienen la misma
> especificidad, así que si se invierte gana el fallback y el parallax deja de funcionar.

> La sección de la galería recorta con `overflow-x-clip`, no con
> `overflow-x-hidden`: `hidden` fuerza `overflow-y: auto` y convierte el elemento
> en scroll container, con efectos colaterales sobre lo que hay dentro.

## Cloudflare Pages

El sitio se despliega en Cloudflare Pages desde `main`: no hay workflow de despliegue en
el repo. Lo que afecta a la web está repartido entre `public/_headers` y la configuración
de Cloudflare:

- **Build**: comando `npm run build`, salida `out`. Con `next build` a secas no se
  regenera `llms.txt` ni corren las comprobaciones de i18n y cabeceras.
- **Cabeceras** (`public/_headers`): `Content-Type` de las imágenes OG, `immutable` para
  `/_next/static/*` y 1 h para los JSON de vídeo. El HTML lleva la cabecera por defecto de
  Pages (`max-age=0, must-revalidate`).
- **Zona**: *Browser Cache TTL* en **Respect Existing Headers**. Con un valor fijo (estaba en
  4 h) Cloudflare subía a ese mínimo el `max-age` de todo, HTML incluido: tras un
  despliegue, quien hubiera entrado en esas horas seguía con el HTML anterior, que apunta a
  chunks que Pages ya no sirve.
- **Sin inyecciones en el HTML**: ofuscación de emails, detecciones de bots por JavaScript y
  Web Analytics desactivados. Cada una añadía un script a todas las páginas, y los dos
  primeros aparecían en la ruta crítica de PageSpeed.
