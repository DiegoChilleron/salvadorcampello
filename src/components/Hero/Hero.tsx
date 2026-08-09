import type { ReactNode } from 'react';

import background from '@/img/photos/hero/background.webp';
import backgroundMobile from '@/img/photos/hero/background_mobile.webp';
import person from '@/img/photos/hero/salvador_01.webp';
import personMobile from '@/img/photos/hero/salvador_01_mobile.webp';
import camera_01 from '@/img/photos/hero/camera_01.webp';
import camera_01Mobile from '@/img/photos/hero/camera_01_mobile.webp';
import camera_02 from '@/img/photos/hero/camera_02.webp';
import camera_02Mobile from '@/img/photos/hero/camera_02_mobile.webp';
import table from '@/img/photos/hero/table.webp';
import tableMobile from '@/img/photos/hero/table_mobile.webp';

const MOBILE_BREAKPOINT = '(max-width: 412px)';

/**
 * Server Component: la coreografía de las cinco capas vive entera en CSS, en la sección
 * «HERO» de `globals.css`. Antes eran doce `useTransform` de motion recalculándose en
 * cada frame en el hilo principal; ahora corren en el compositor y el home se ahorra
 * ~132 KB de JS. También desaparecen el `useState` de `windowWidth` y su listener de
 * resize: `calc(-100vw - 200px)` lo resuelve el navegador.
 *
 * `children` recibe <Description /> desde la page.
 */
export const Hero = ({ children }: { children: ReactNode }) => {
    return (
        <div className="bg-darkprimary">
            {/* Art direction: el navegador elige la variante antes de que corra el JS. */}
            <link rel="preload" as="image" href={personMobile.src} media={MOBILE_BREAKPOINT} />
            <link rel="preload" as="image" href={camera_01Mobile.src} media={MOBILE_BREAKPOINT} />
            <link rel="preload" as="image" href={tableMobile.src} media={MOBILE_BREAKPOINT} />
            <link rel="preload" as="image" href={backgroundMobile.src} media={MOBILE_BREAKPOINT} />
            <link rel="preload" as="image" href={person.src} media="(min-width: 413px)" />
            <link rel="preload" as="image" href={camera_01.src} media="(min-width: 413px)" />
            <link rel="preload" as="image" href={table.src} media="(min-width: 413px)" />
            <link rel="preload" as="image" href={background.src} media="(min-width: 413px)" />

            <div id="inicio" className="hero">
                <h1 className="hero__h1-title">SALVADOR CAMPELLO</h1>

                <picture>
                    <source
                        media={MOBILE_BREAKPOINT}
                        srcSet={personMobile.src}
                        width="360"
                        height="989"
                    />
                    <img
                        src={person.src}
                        fetchPriority="high"
                        className="hero__img_person"
                        alt="Salvador Campello"
                        draggable="false"
                        width="728"
                        height="2000"
                    />
                </picture>

                <picture>
                    <source
                        media={MOBILE_BREAKPOINT}
                        srcSet={camera_01Mobile.src}
                        width="480"
                        height="617"
                    />
                    <img
                        src={camera_01.src}
                        fetchPriority="high"
                        className="hero__img_camera"
                        alt="Cámara de vídeo 1"
                        draggable="false"
                        width="840"
                        height="1080"
                    />
                </picture>

                <picture>
                    <source
                        media={MOBILE_BREAKPOINT}
                        srcSet={camera_02Mobile.src}
                        width="480"
                        height="617"
                    />
                    <img
                        src={camera_02.src}
                        className="hero__img_camera hero__img_camera--second"
                        alt="Cámara de vídeo 2"
                        draggable="false"
                        width="840"
                        height="1080"
                    />
                </picture>

                <picture>
                    <source
                        media={MOBILE_BREAKPOINT}
                        srcSet={tableMobile.src}
                        width="618"
                        height="437"
                    />
                    <img
                        src={table.src}
                        fetchPriority="high"
                        className="hero__img_table"
                        alt="Mesa"
                        draggable="false"
                        width="1200"
                        height="848"
                    />
                </picture>

                <picture>
                    <source
                        media={MOBILE_BREAKPOINT}
                        srcSet={backgroundMobile.src}
                        width="800"
                        height="480"
                    />
                    <img
                        src={background.src}
                        fetchPriority="high"
                        className="hero__img_background"
                        alt="Fondo del plató"
                        draggable="false"
                        width="1800"
                        height="1080"
                    />
                </picture>
            </div>

            {children}
        </div>
    );
};
