'use client';

import { memo, useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { routePath } from '@/config/routes';
import type { Locale } from '@/i18n/routing';
import { VideoCard, type Video } from '../VideoCard';
import { fetchVideos } from '../fetchVideos';
import type { CategoryId } from '../categories';

interface ListSectionProps {
    id: CategoryId;
    title: string;
    description: string;
}

export const ListSection = memo(function ListSection({
    id,
    title,
    description,
}: ListSectionProps) {
    const t = useTranslations('ListSection');
    const locale = useLocale() as Locale;
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // Un booleano y no el texto ya traducido: así el efecto no depende de `t` y
    // el mensaje se resuelve en el render, con el idioma vigente.
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            try {
                const data = await fetchVideos(id);
                // Solo los 3 primeros vídeos (los más recientes)
                if (!cancelled) setVideos(data.slice(0, 3));
            } catch (err) {
                console.error(`Error cargando videos para ${id}:`, err);
                if (!cancelled) setHasError(true);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    return (
        <article className="list-section">
            <header className="mb-4">
                <h3 className="uppercase">{title}</h3>
                <p>{description}</p>
            </header>

            <div id={`section-${id}`} className="list-section__container">
                {isLoading ? (
                    <div className="text-center p-4">{t('loading')}</div>
                ) : hasError ? (
                    <div className="text-center text-red-500 p-4">{t('error')}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 xl:gap-12 ">
                        {videos.map((video, index) => (
                            <div
                                key={video.videoId}
                                data-reveal="fade-up"
                                style={
                                    {
                                        '--stagger': index,
                                        '--reveal-duration': '0.6s',
                                    } as React.CSSProperties
                                }
                            >
                                <VideoCard video={video} size="big" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="list-section__footer">
                <div data-reveal="zoom-in">
                    <Link
                        href={`${routePath('portfolio', locale)}#${id}`}
                        className="button"
                        aria-label={t('viewAll', { title })}
                    >
                        {t(`button.${id}`)} &#10095;
                    </Link>
                </div>
            </div>
        </article>
    );
});
