import { useTranslations } from 'next-intl';

import { ContactMethod } from './ContactMethod';
import { ContactRRSS } from './ContactRRSS';

export const Contact = () => {
    const t = useTranslations('Contact');

    return (
        <section id="contacto" className="contact">
            <h2>{t('title')}</h2>
            <p>{t('subtitle')}</p>

            <ContactRRSS />
            <ContactMethod />
        </section>
    );
};
