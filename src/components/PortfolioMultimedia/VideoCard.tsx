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
}

export type CardSize = 'big' | 'medium' | 'small';

interface VideoCardProps {
    video: Video;
    size?: CardSize;
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

export const VideoCard = memo(function VideoCard({ video, size = 'medium' }: VideoCardProps) {
    const t = useTranslations('VideoCard');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    const handleEnter = useCallback(() => setIsInView(true), []);
    const imgRef = useInViewOnce<HTMLImageElement>(handleEnter);

    const imageUrl = useMemo(() => {
        return isInView
            ? `https://i.ytimg.com/vi_webp/${video.videoId}/${THUMBNAIL_VARIANT[size]}.webp`
            : PLACEHOLDER;
    }, [isInView, video.videoId, size]);

    const handleClick = useCallback(() => {
        openDialog(video.videoId);
    }, [video.videoId]);

    /**
     * La tarjeta es un `<article role="button">` y no un `<button>` de verdad
     * porque su contenido (divs, un `<p>`) es contenido de flujo, que dentro de
     * `<button>` es HTML inválido. Con el rol hay que reponer a mano lo que el
     * elemento nativo daba gratis: el foco (`tabIndex`) y la activación por
     * Enter y Espacio. Sin esto el catálogo entero era inalcanzable sin ratón.
     */
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;

            // El Espacio desplaza la página si se deja pasar, y ambas teclas
            // llegarían al diálogo que se acaba de abrir.
            event.preventDefault();
            handleClick();
        },
        [handleClick],
    );

    const handleImageLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    if (!video?.videoId) return null;

    const { iconClasses, titleClasses, roundedClasses, roundedTopClasses } =
        SIZE_VARIANTS[size] || SIZE_VARIANTS.medium;

    return (
        <article
            className={`video-card group ${roundedClasses}`}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
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
                    loading="lazy"
                    onLoad={handleImageLoad}
                    onError={handleImageLoad}
                />
            </div>
            <p className={`videocard-text ${titleClasses}`}> {video.title} </p>
        </article>
    );
});
