import { useTranslations } from 'next-intl';

import { getPreviewVideos } from '@/lib/videos';
import { ListSection } from './ListSection';
import { DialogYoutube } from '../DialogYoutube';
import type { CategoryId } from '../categories';

const SECTIONS: { id: CategoryId; titleKey: string; descriptionKey: string }[] = [
    { id: 'telenit', titleKey: 'subtitle1', descriptionKey: 'description1' },
    { id: 'entrevistas', titleKey: 'subtitle2', descriptionKey: 'description2' },
    { id: 'eventos', titleKey: 'subtitle3', descriptionKey: 'description3' },
];

/** Cuántas tarjetas enseña cada sección de la home. */
const PREVIEW_COUNT = 3;

/**
 * Server Component: resuelve textos y lee en build los vídeos que se muestran. El único
 * hijo que necesita cliente (DialogYoutube, y la VideoCard que cuelga de ListSection)
 * lleva su propio "use client".
 */
export const PortfolioMultimediaHome = () => {
    const t = useTranslations('PortfolioMultimedia');
    const previews = getPreviewVideos(PREVIEW_COUNT);

    return (
        <section id="portfolio" className="portfolio-multimedia">
            <h2 className="portfolio-multimedia__title">{t('title')}</h2>
            {SECTIONS.map(({ id, titleKey, descriptionKey }) => (
                <ListSection
                    key={id}
                    id={id}
                    title={t(titleKey)}
                    description={t(descriptionKey)}
                    videos={previews[id]}
                />
            ))}

            {/* Añadir DialogYoutube para que esté disponible en esta página */}
            <DialogYoutube />
        </section>
    );
};
