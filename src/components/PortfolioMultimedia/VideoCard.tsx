'use client';

import { memo, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { useInViewOnce } from '@/hooks/useInViewOnce';
import { openDialog } from './DialogYoutube';
import youtubeIcon from '@/img/icons/rrss/youtube-icon.svg';

export interface Video {
    videoId: string;
    title: string;
    thumbnail?: string;
    /**
     * Fecha de publicación en YouTube, en ISO. La escribe la Action nocturna. Opcional
     * porque los listados anteriores a ese cambio no la traen; para esos, `videoUploadDate`
     * (src/lib/videos.ts) cae a la fecha del título.
     */
    publishedAt?: string;
}

export type CardSize = 'big' | 'medium' | 'small';

interface VideoCardProps {
    video: Video;
    size?: CardSize;
    /**
     * Candidata a LCP: la miniatura se pinta ya en el HTML del servidor, sin diferirla
     * por IntersectionObserver, sin `loading="lazy"` y con `fetchpriority="high"`.
     *
     * PageSpeed lo marcaba en /portfolio/ («Los recursos de LCP no deben usar
     * loading=lazy», «Se debe aplicar fetchpriority=high»): la primera tarjeta es el
     * elemento LCP de la página y su `src` real no aparecía hasta después de hidratar,
     * así que el navegador no podía ni empezar a descargarla mientras parseaba el HTML.
     *
     * Solo para las tarjetas de la mitad superior. En el resto la carga diferida sigue
     * siendo lo correcto: son cientos.
     */
    priority?: boolean;
}

const PLACEHOLDER =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+';

/**
 * Variante de miniatura de YouTube por tamaño de tarjeta. Medido: hqdefault son
 * 480x360 y 12,4 KB; mqdefault, 320x180 y 7,5 KB.
 *
 * Las tarjetas «small» miden ~145 px, así que hqdefault descarga el triple de píxeles
 * de los que se ven. Además hqdefault es 4:3 y la tarjeta ~16:9 (`pb-[55%]`), de modo
 * que `object-cover` recorta arriba y abajo lo que se acaba de descargar; mqdefault ya
 * viene en 16:9.
 */
const THUMBNAIL_VARIANT: Record<CardSize, string> = {
    big: 'hqdefault',
    medium: 'hqdefault',
    small: 'mqdefault',
};

const SIZE_VARIANTS = {
    big: {
        iconClasses: 'w-12 h-12',
        titleClasses: 'text-sm md:text-xs xl:text-lg py-2',
        roundedClasses: 'rounded-xl',
        roundedTopClasses: 'rounded-t-xl',
    },
    medium: {
        iconClasses: 'w-8 h-8',
        titleClasses: 'text-xxs xl:text-sm py-1',
        roundedClasses: 'rounded-lg',
        roundedTopClasses: 'rounded-t-lg',
    },
    small: {
        iconClasses: 'w-6 h-6',
        titleClasses: 'text-xxxs xl:text-xs',
        roundedClasses: 'rounded-sm',
        roundedTopClasses: 'rounded-t-sm',
    },
};

export const VideoCard = memo(function VideoCard({
    video,
    size = 'medium',
    priority = false,
}: VideoCardProps) {
    const t = useTranslations('VideoCard');
    // Las prioritarias arrancan ya «cargadas» y «en vista»: el `src` real entra en el
    // HTML del servidor y la tarjeta se pinta opaca desde el principio. Con la
    // transición de opacidad, el LCP no se cuenta hasta que termina el fundido, que es
    // justo lo que se quiere evitar en la imagen que lo define.
    const [isLoaded, setIsLoaded] = useState(priority);
    const [isInView, setIsInView] = useState(priority);

    const handleEnter = useCallback(() => setIsInView(true), []);
    const imgRef = useInViewOnce<HTMLImageElement>(handleEnter);

    const imageUrl = useMemo(() => {
        return isInView
            ? `https://i.ytimg.com/vi_webp/${video.videoId}/${THUMBNAIL_VARIANT[size]}.webp`
            : PLACEHOLDER;
    }, [isInView, video.videoId, size]);

    /**
     * La tarjeta es un `<a>` al vídeo en YouTube, no un `<div role="button">`.
     *
     * El motivo es de indexación: con un div el rastreador leía el título pero no
     * encontraba ningún enlace, así que las ~250 tarjetas que ahora vienen en el HTML
     * eran texto suelto sin destino. Un ancla las convierte en enlaces salientes reales.
     *
     * De paso se cae todo el apaño de accesibilidad que exigía el div: `<a href>` ya es
     * focusable y se activa con Enter de forma nativa, y admite contenido de flujo (que
     * es lo que impedía usar un `<button>` de verdad). El clic normal lo intercepta el
     * diálogo; los clics con modificador se dejan pasar para que «abrir en pestaña
     * nueva» siga llevando a YouTube.
     */
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            event.preventDefault();
            openDialog(video.videoId);
        },
        [video.videoId],
    );

    const handleImageLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    if (!video?.videoId) return null;

    const { iconClasses, titleClasses, roundedClasses, roundedTopClasses } =
        SIZE_VARIANTS[size] || SIZE_VARIANTS.medium;

    return (
        <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            className={`video-card group ${roundedClasses}`}
            onClick={handleClick}
            aria-label={t('play', { title: video.title })}
        >
            <div className="relative pb-[55%]">
                <div className="youtube-icon">
                    <Image src={youtubeIcon} alt="YouTube" className={iconClasses} />
                </div>

                {/* Miniatura remota diferida por IntersectionObserver: se usa <img>
                    porque el src cambia de placeholder a URL de i.ytimg.com. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={imgRef}
                    src={imageUrl}
                    alt={video.title}
                    className={`videocard-image ${roundedTopClasses} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : undefined}
                    onLoad={handleImageLoad}
                    onError={handleImageLoad}
                />
            </div>
            <p className={`videocard-text ${titleClasses}`}> {video.title} </p>
        </a>
    );
});
