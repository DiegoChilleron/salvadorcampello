'use client';

import { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { HiChevronDown } from 'react-icons/hi2';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { VideoCard, type Video, type CardSize } from '../VideoCard';
import { fetchVideos } from '../fetchVideos';
import { CATEGORY_BG_COLORS, type CategoryId } from '../categories';

interface ListSectionAllVideosProps {
    category: CategoryId;
    cardSize: CardSize;
    searchTerm: string;
}

const PAGINATION_CONFIG = {
    big: { itemsPerPage: 24, loadMoreIncrement: 12 },
    medium: { itemsPerPage: 40, loadMoreIncrement: 20 },
    small: { itemsPerPage: 80, loadMoreIncrement: 40 },
} as const;

const sizeStyles = {
    big: {
        columns:
            'grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8 xl:gap-12',
    },
    medium: {
        columns:
            'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 xl:gap-8',
    },
    small: {
        columns:
            'grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4 xl:gap-6',
    },
} as const;

export const ListSectionAllVideos = memo(function ListSectionAllVideos({
    category,
    cardSize,
    searchTerm,
}: ListSectionAllVideosProps) {
    const t = useTranslations('PortfolioPage');
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // Un booleano y no el texto ya traducido: así el efecto no depende de `t` y
    // el mensaje se resuelve en el render, con el idioma vigente.
    const [hasError, setHasError] = useState(false);
    const [displayCount, setDisplayCount] = useState<number>(
        () => PAGINATION_CONFIG[cardSize].itemsPerPage,
    );

    useEffect(() => {
        setDisplayCount(PAGINATION_CONFIG[cardSize].itemsPerPage);
    }, [cardSize, searchTerm]);

    useEffect(() => {
        let cancelled = false;

        setVideos([]);
        setHasError(false);
        setIsLoading(true);

        // `setVideos` y `setIsLoading` van juntos en el mismo callback a propósito.
        // Separarlos en `.then()` y `.finally()` los deja en microtareas distintas, o
        // sea en dos renders: en el de en medio ya hay vídeos (y por tanto páginas que
        // cargar) pero el componente sigue devolviendo el mensaje de carga, así que el
        // elemento que dispara el scroll infinito todavía no existe.
        fetchVideos(category)
            .then((data) => {
                if (cancelled) return;
                setVideos(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Error cargando videos:', err);
                if (cancelled) return;
                setHasError(true);
                setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [category]);

    const filteredVideos = useMemo(() => {
        if (!searchTerm.trim()) {
            return videos;
        }

        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        return videos.filter(
            (video) => video.title && video.title.toLowerCase().includes(normalizedSearchTerm),
        );
    }, [videos, searchTerm]);

    const displayedVideos = useMemo(
        () => filteredVideos.slice(0, displayCount),
        [filteredVideos, displayCount],
    );

    const hasMoreVideos = useMemo(
        () => filteredVideos.length > displayCount,
        [filteredVideos.length, displayCount],
    );

    // Los vídeos ya están todos en memoria: paginar es cortar un array, no pedir nada.
    // El `await` de 300 ms que había aquí solo retrasaba el render.
    const loadMoreVideos = useCallback(() => {
        if (!hasMoreVideos) return;

        setDisplayCount((prev) => prev + PAGINATION_CONFIG[cardSize].loadMoreIncrement);
    }, [hasMoreVideos, cardSize]);

    const loadMoreRef = useIntersectionObserver({
        onIntersect: loadMoreVideos,
        enabled: hasMoreVideos,
        threshold: 0.1,
        rootMargin: '50px',
    });

    if (isLoading) {
        return <div className="text-center p-8 text-white">{t('search.loading')}</div>;
    }

    if (hasError) {
        return <div className="text-center text-red-500 p-8">{t('error')}</div>;
    }

    return (
        <div
            className={`${CATEGORY_BG_COLORS[category]} ${sizeStyles[cardSize].columns} grid py-14 px-2 md:px-14`}
        >
            {displayedVideos.length > 0 ? (
                <>
                    {displayedVideos.map((video) => (
                        <VideoCard key={video.videoId} video={video} size={cardSize} />
                    ))}

                    {/* Trigger para carga automática y botón manual */}
                    {hasMoreVideos && (
                        <div className="col-span-full flex flex-col items-center mt-8 gap-4">
                            {/* Elemento trigger para Intersection Observer */}
                            <div ref={loadMoreRef} className="h-1" />

                            {/* Botón manual de respaldo */}
                            <button
                                onClick={loadMoreVideos}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                            >
                                {t('loadmore', {
                                    count: Math.min(
                                        PAGINATION_CONFIG[cardSize].loadMoreIncrement,
                                        filteredVideos.length - displayCount,
                                    ),
                                })}
                                <HiChevronDown aria-hidden="true" className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                // Aquí `isLoading` ya es false, así que no quedan vídeos por llegar:
                // si la lista está vacía, la categoría está vacía. Antes se mostraba
                // `search.loading` y el mensaje de carga se quedaba fijo para siempre.
                <div className="col-span-full text-center p-4">
                    {searchTerm ? t('search.dontfind') : t('search.empty')}
                </div>
            )}
        </div>
    );
});
