import { getTranslations } from 'next-intl/server';

import {
    SITE_NAME,
    SITE_URL,
    CONTACT_EMAIL,
    SOCIAL_LINKS,
    SITE_LAST_MODIFIED,
} from '@/config/site';
import type { Locale } from '@/i18n/routing';

/** Grafo Schema.org (WebSite + Person) que antes vivía inline en index.html. */
export async function JsonLd({ locale }: { locale: Locale }) {
    const t = await getTranslations({ locale, namespace: 'Schema' });

    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                url: SITE_URL,
                name: SITE_NAME,
                description: t('websiteDescription'),
                inLanguage: locale,
                dateModified: SITE_LAST_MODIFIED,
                publisher: {
                    '@type': 'Person',
                    name: SITE_NAME,
                    url: SITE_URL,
                },
            },
            {
                '@type': 'Person',
                name: SITE_NAME,
                alternateName: 'Salva Campello',
                image: `${SITE_URL}/assets/icons/profile.webp`,
                url: SITE_URL,
                description: t('personDescription'),
                jobTitle: t('jobTitle'),
                worksFor: {
                    '@type': 'Organization',
                    name: 'TeleElx',
                    url: 'https://teleelx.es',
                    logo: 'https://teleelx.es/wp-content/uploads/2018/07/teleelx-elx_LOGO.png',
                },
                birthPlace: {
                    '@type': 'Place',
                    name: t('birthPlace'),
                },
                nationality: {
                    '@type': 'Country',
                    name: t('country'),
                },
                knowsAbout: [0, 1, 2, 3, 4].map((i) => t(`knowsAbout.${i}`)),
                alumniOf: {
                    '@type': 'EducationalOrganization',
                    name: t('alumniOf'),
                },
                sameAs: [
                    SOCIAL_LINKS.facebook,
                    SOCIAL_LINKS.instagram,
                    SOCIAL_LINKS.linkedin,
                    SOCIAL_LINKS.twitter,
                ],
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: t('contactType'),
                    email: CONTACT_EMAIL,
                    url: `${SITE_URL}/#contacto`,
                },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
    );
}
