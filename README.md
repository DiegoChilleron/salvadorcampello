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

Los listados de YouTube son JSON en `public/assets/data/` que se piden por `fetch`
desde el cliente (`src/components/PortfolioMultimedia/fetchVideos.ts`, con caché en
memoria de 5 minutos). Los regenera cada noche el workflow
`.github/workflows/update-videos.yml`, que necesita el secreto `YOUTUBE_API_KEY`.

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
    descartan y la tarjeta sale sin imagen.
- **`robots.ts`** declara explícitamente los crawlers de IA (GPTBot, PerplexityBot,
  ClaudeBot, CCBot, Applebot-Extended…) además de los buscadores tradicionales.
- **`llms.txt`** lo genera `scripts/generate-llms.mjs` en el `prebuild`, a partir de
  `src/messages/es.json` y de los listados de vídeo, para que no pueda divergir del
  contenido real.
- **Las páginas legales** son `noindex` y están fuera del sitemap: un sitemap es la lista
  de lo que quieres que se indexe.
- **JSON-LD**: `WebSite` + `Person` en todas las páginas y `BreadcrumbSchema` en portfolio
  y legales. **Ningún dato de vídeo**, ver abajo.
- **Frescura**: `SITE_LAST_MODIFIED` en `src/config/site.ts` alimenta el `<lastmod>` del
  sitemap y el `dateModified` del JSON-LD. Se actualiza a mano al publicar un cambio
  estructural; con `new Date()` cambiaría en cada build y forzaría recrawleo innecesario.

## El HTML no depende del JSON diario

**Regla del proyecto**: el HTML exportado no contiene datos de vídeo — ni markup ni
JSON-LD. El único fichero que cambia a diario es `public/assets/data/listado_*.json`, que
reescribe la GitHub Action nocturna.

Si el HTML horneara en build datos que la Action reescribe cada noche, habría que
redesplegar el sitio entero a diario o el HTML quedaría desincronizado con el JSON. Por
eso se descartó tanto prerenderizar las tarjetas como el `VideoListSchema` que llegó a
implementarse.

**Coste asumido y conocido**: `/portfolio/` tiene ~43 palabras indexables (el home, 452) y
el catálogo de ~1.800 vídeos es invisible para buscadores. Está aceptado a cambio de la
independencia del despliegue.

> Antes de prerenderizar, hornear o incrustar cualquier dato en build, comprobar si su
> fuente se actualiza sola. Si la respuesta es sí, no va en el HTML aunque mejore el SEO.

## Estilos

Un único `src/app/globals.css` con `@import "tailwindcss"`, el `@theme` de la paleta
(`lightprimary`, `darkprimary`, …) y las clases del sitio. La fuente Open Sans se
carga con `next/font/local` desde `src/app/fonts.ts`.

## Server vs Client Components

Por defecto los componentes son Server Components. Solo llevan `"use client"` los
que necesitan estado, eventos o `motion`: `Hero`, `GalleryCarousel`, `CardCV`,
`CopyBioButton`, `Navbar`, `LanguageSelector`, `VideoCard`, `DialogYoutube`,
`ListSection`, los dos de `/portfolio/`, `Page404` y `ScrollToHash`.

Dos patrones que se repiten para no arrastrar contenido al bundle de cliente
(`"use client"` es **transitivo para los imports**):

- **Contenido como `children`**: `HorizontalGallery` (servidor) pasa los 8
  `<GalleryItem>` a `GalleryCarousel` (cliente); la page pasa `<Description />`
  a `<Hero>`. Así los `<Image>` y las traducciones se resuelven en servidor.
- **Extraer solo lo interactivo**: `Curriculum` es Server Component y delega el
  estado en `CopyBioButton`.

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
