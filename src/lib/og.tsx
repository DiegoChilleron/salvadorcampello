import fs from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';

import { SITE_NAME } from '@/config/site';

/**
 * Plantilla compartida de las imágenes Open Graph. Punto único de diseño: la usan las
 * rutas mediante el convenio `opengraph-image.tsx`, que rellena `og:image` y
 * `twitter:image` por su cuenta.
 *
 * Funciona con `output: 'export'` porque el render ocurre en build (runtime Node), que
 * es lo que permite leer las fuentes con `fs`.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

// Paleta del sitio (src/app/globals.css) + el theme-color del manifest.
const DARK_PRIMARY = '#0E172C';
const DARK_SECONDARY = '#2F2F45';
const ACCENT_RED = '#CB333B';
const LIGHT_TERTIARY = '#ECE3D1';

type LoadedFont = { name: string; data: Buffer; weight: 400 | 700; style: 'normal' };

let fontCache: LoadedFont[] | null = null;

/**
 * Open Sans en .woff estático. satori NO lee woff2 (que es lo que usa la web vía
 * `next/font/local`), y Google Fonts ya solo publica Open Sans como fuente variable,
 * así que las instancias 400/700 se vendorizan aparte en src/assets/fonts/.
 */
function loadOgFonts(): LoadedFont[] {
    if (fontCache) return fontCache;

    const dir = path.join(process.cwd(), 'src/assets/fonts');
    const read = (file: string) => fs.readFileSync(path.join(dir, file));

    fontCache = [
        { name: 'Open Sans', data: read('OpenSans-Regular.woff'), weight: 400, style: 'normal' },
        { name: 'Open Sans', data: read('OpenSans-Bold.woff'), weight: 700, style: 'normal' },
    ];
    return fontCache;
}

/** Cuerpo del titular según su longitud, para que no se desborde el lienzo. */
function titleFontSize(title: string): number {
    if (title.length > 70) return 54;
    if (title.length > 55) return 62;
    if (title.length > 35) return 74;
    return 86;
}

interface RenderOgImageOptions {
    /** Etiqueta corta superior (sección). */
    eyebrow: string;
    /** Titular principal. */
    title: string;
}

export function renderOgImage({ eyebrow, title }: RenderOgImageOptions): ImageResponse {
    return new ImageResponse(
        (
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '76px 80px',
                    background: `linear-gradient(135deg, ${DARK_PRIMARY} 0%, ${DARK_SECONDARY} 100%)`,
                    color: '#ffffff',
                    fontFamily: 'Open Sans',
                    overflow: 'hidden',
                }}
            >
                {/* Halo decorativo en el rojo de marca */}
                <div
                    style={{
                        position: 'absolute',
                        top: -280,
                        right: -200,
                        width: 680,
                        height: 680,
                        borderRadius: 9999,
                        background:
                            'radial-gradient(circle, rgba(203,51,59,0.35) 0%, rgba(203,51,59,0) 70%)',
                    }}
                />

                <span
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: 6,
                        textTransform: 'uppercase',
                        color: LIGHT_TERTIARY,
                    }}
                >
                    {SITE_NAME}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    <span
                        style={{
                            alignSelf: 'flex-start',
                            fontSize: 24,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            color: '#ffffff',
                            background: ACCENT_RED,
                            padding: '8px 22px',
                            borderRadius: 9999,
                        }}
                    >
                        {eyebrow}
                    </span>
                    <span
                        style={{
                            fontSize: titleFontSize(title),
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: -2,
                            maxWidth: 1000,
                        }}
                    >
                        {title}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 9999, background: ACCENT_RED }} />
                    <span style={{ fontSize: 26, fontWeight: 400, color: LIGHT_TERTIARY }}>
                        salvadorcampello.com
                    </span>
                </div>
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: loadOgFonts(),
        },
    );
}
