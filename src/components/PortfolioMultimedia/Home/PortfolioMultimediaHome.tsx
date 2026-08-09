import { useTranslations } from 'next-intl';

import { ListSection } from './ListSection';
import { DialogYoutube } from '../DialogYoutube';
import type { CategoryId } from '../categories';

const SECTIONS: { id: CategoryId; titleKey: string; descriptionKey: string }[] = [
    { id: 'telenit', titleKey: 'subtitle1', descriptionKey: 'description1' },
    { id: 'entrevistas', titleKey: 'subtitle2', descriptionKey: 'description2' },
    { id: 'eventos', titleKey: 'subtitle3', descriptionKey: 'description3' },
];

/**
 * Server Component: solo resuelve textos. Los hijos que necesitan cliente
 * (ListSection, DialogYoutube) llevan su propio "use client".
 */
export const PortfolioMultimediaHome = () => {
    const t = useTranslations('PortfolioMultimedia');

    return (
        <section id="portfolio" className="portfolio-multimedia">
            <h2 className="portfolio-multimedia__title">{t('title')}</h2>
            {SECTIONS.map(({ id, titleKey, descriptionKey }) => (
                <ListSection
                    key={id}
                    id={id}
                    title={t(titleKey)}
                    description={t(descriptionKey)}
                />
            ))}

            {/* Añadir DialogYoutube para que esté disponible en esta página */}
            <DialogYoutube />
        </section>
    );
};
