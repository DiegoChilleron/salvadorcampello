import { useLocale, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { routePath } from '@/config/routes';
import type { Locale } from '@/i18n/routing';
import { VideoCard, type Video } from '../VideoCard';
import type { CategoryId } from '../categories';

interface ListSectionProps {
    id: CategoryId;
    title: string;
    description: string;
    /** Los 3 vídeos más recientes, resueltos en build (src/lib/videos.ts). */
    videos: Video[];
}

/**
 * Server Component. Antes era de cliente solo para pedir con `fetchVideos` los 3 vídeos
 * que muestra: eso descargaba los tres listados completos —1.712 entradas solo el de
 * telenit— en cada visita a la home para pintar 9 miniaturas, y dejaba la sección vacía
 * en el HTML. Ahora los vídeos llegan como prop desde la page y aquí no queda estado:
 * ni petición, ni mensajes de carga y error, ni JavaScript.
 *
 * `VideoCard` sigue siendo de cliente (abre el diálogo), pero es él quien lleva su propia
 * directiva.
 */
export const ListSection = ({ id, title, description, videos }: ListSectionProps) => {
    const t = useTranslations('ListSection');
    const locale = useLocale() as Locale;

    return (
        <article className="list-section">
            <header className="mb-4">
                <h3 className="uppercase">{title}</h3>
                <p>{description}</p>
            </header>

            <div id={`section-${id}`} className="list-section__container">
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
};
