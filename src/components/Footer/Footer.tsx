import { useLocale, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { localeHref, routePath } from '@/config/routes';
import type { Locale } from '@/i18n/routing';
import { ContactRRSS } from '../Contact/ContactRRSS';
import { LanguageSelector } from './LanguageSelector';

const LEGAL_KEYS = ['legalNotice', 'privacyPolicy', 'cookiesPolicy'] as const;

export const Footer = () => {
    const t = useTranslations('Footer');
    const locale = useLocale() as Locale;

    // Las páginas legales solo existen en castellano. Desde el árbol español se
    // navegan con el Link de next-intl; desde los demás idiomas hay que cruzar
    // de árbol, así que se enlazan con un <a> y carga completa.
    const legalLinks = [
        { key: LEGAL_KEYS[0], label: t('legalnotice') },
        { key: LEGAL_KEYS[1], label: t('privacitypolicy') },
        { key: LEGAL_KEYS[2], label: t('cookiespolicy') },
    ];

    return (
        <footer>
            <LanguageSelector label={t('changelanguage')} />

            <div className="footer-div-content">
                <p className="footer-content-website">salvadorcampello.com</p>

                <ContactRRSS />

                <p className="footer-content-links">
                    {legalLinks.map(({ key, label }) =>
                        locale === 'es' ? (
                            <Link key={key} href={routePath(key, 'es')}>
                                {label}
                            </Link>
                        ) : (
                            <a key={key} href={localeHref(key, 'es')} hrefLang="es">
                                {label}
                            </a>
                        ),
                    )}
                </p>
            </div>
        </footer>
    );
};
