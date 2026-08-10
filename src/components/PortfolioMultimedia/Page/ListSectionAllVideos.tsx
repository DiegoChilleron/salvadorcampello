'use client';

import { useEffect, useState, useCallback, memo, useMemo, useRef } from 'react';
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
    /**
     * Listado recortado que ya viene resuelto en el HTML (src/lib/videos.ts). Es el
     * estado inicial, no un `fetch` que se evita: al activarse se sigue pidiendo el
     * catálogo completo para que la búsqueda alcance también a los vídeos antiguos.
     */
    initialVideos: Video[];
    /** Pestaña visible. Las otras se renderizan igual, pero ocultas y sin pedir nada. */
    isActive: boolean;
}

/**
 * Tarjetas que se cargan con prioridad. Tres es una fila completa en la rejilla de
 * escritorio; en móvil, que va a una columna, sobran dos miniaturas de ~12 KB, un precio
 * razonable por no adivinar el ancho en el servidor.
 */
const PRIORITY_CARDS = 3;

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
    initialVideos,
    isActive,
}: ListSectionAllVideosProps) {
    const t = useTranslations('PortfolioPage');
    const [videos, setVideos] = useState<Video[]>(initialVideos);
    const [isLoading, setIsLoading] = useState(false);
    // Un booleano y no el texto ya traducido: así el efecto no depende de `t` y
    // el mensaje se resuelve en el render, con el idioma vigente.
    const [hasError, setHasError] = useState(false);
    /**
     * Petición en vuelo teniendo ya vídeos en pantalla. No enseña «Cargando vídeos…» en
     * lugar de la lista (para eso está `isLoading`), pero sí evita que una búsqueda diga
     * «no se encontraron vídeos» cuando lo cierto es que el catálogo antiguo todavía no
     * ha llegado: alcanzar esos vídeos es justo para lo que sirve la petición.
     */
    const [isExpanding, setIsExpanding] = useState(false);
    // Se pinta todo lo prerenderizado, no la primera página: si se cortara en
    // `itemsPerPage` (24 en vista grande), los otros ~230 vídeos que la page resolvió en
    // build viajarían en el HTML sin llegar al DOM, que es justo lo que lee el rastreador.
    // `content-visibility: auto` en `.video-card` evita que las tarjetas de más abajo
    // cuesten pintado.
    const [displayCount, setDisplayCount] = useState<number>(() =>
        Math.max(PAGINATION_CONFIG[cardSize].itemsPerPage, initialVideos.length),
    );

    /**
     * Volver a la primera página al cambiar de tamaño o de búsqueda, pero **no** al
     * montar: en el primer pase este efecto recortaba a `itemsPerPage` las 251 tarjetas
     * que la page acababa de prerenderizar, así que nada más hidratar desaparecían del
     * DOM 179 de ellas —un salto de contenido enorme— y el trabajo del servidor se
     * tiraba a la basura.
     *
     * Se compara el valor anterior en vez de llevar una bandera de «primera ejecución»:
     * StrictMode invoca el efecto dos veces al montar, y con la bandera la segunda pasada
     * ya la habría consumido la primera, así que el recorte volvía en desarrollo.
     */
    const lastPagingInput = useRef({ cardSize, searchTerm });

    useEffect(() => {
        const previous = lastPagingInput.current;
        if (previous.cardSize === cardSize && previous.searchTerm === searchTerm) return;

        lastPagingInput.current = { cardSize, searchTerm };
        setDisplayCount(PAGINATION_CONFIG[cardSize].itemsPerPage);
    }, [cardSize, searchTerm]);

    useEffect(() => {
        // La categoría oculta no pide nada: son tres listados y bajarlos todos al montar
        // serían ~200 KB para pestañas que quizá no se abran. Hasta que se active, se
        // queda con lo prerenderizado, que ya está en el DOM.
        if (!isActive) return;

        let cancelled = false;

        // Con la lista ya prerenderizada no se vacía el estado ni se enseña el mensaje
        // de carga: sustituirla por «Cargando vídeos…» sería un parpadeo que borra
        // contenido que ya está pintado. La petición solo la amplía.
        const hasPrerendered = initialVideos.length > 0;

        if (hasPrerendered) {
            setIsExpanding(true);
        } else {
            setVideos([]);
            setIsLoading(true);
        }
        setHasError(false);

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
                setIsExpanding(false);
            })
            .catch((err) => {
                console.error('Error cargando videos:', err);
                if (cancelled) return;
                // Si había vídeos prerenderizados se conservan: el catálogo completo no
                // llega, pero cambiar una lista visible por un error es peor que
                // quedarse con los ~150 más recientes.
                if (!hasPrerendered) setHasError(true);
                setIsLoading(false);
                setIsExpanding(false);
            });

        return () => {
            cancelled = true;
        };
    }, [category, initialVideos, isActive]);

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
                    {displayedVideos.map((video, index) => (
                        <VideoCard
                            key={video.videoId}
                            video={video}
                            size={cardSize}
                            // Solo en la pestaña visible: las ocultas van con `hidden`, así
                            // que priorizar sus miniaturas descargaría imágenes que nadie ve.
                            priority={isActive && index < PRIORITY_CARDS}
                        />
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
                // Con `isLoading` a false no quedan vídeos por llegar y una lista vacía
                // significa categoría vacía. La excepción es `isExpanding`: hay lista
                // prerenderizada, pero el catálogo completo sigue en camino, así que una
                // búsqueda sin resultados todavía puede encontrarlos.
                <div className="col-span-full text-center p-4">
                    {!searchTerm
                        ? t('search.empty')
                        : isExpanding
                          ? t('search.loading')
                          : t('search.dontfind')}
                </div>
            )}
        </div>
    );
});
