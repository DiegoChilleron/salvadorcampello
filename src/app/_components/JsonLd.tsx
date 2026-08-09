import { getTranslations } from 'next-intl/server';

import {
    SITE_NAME,
    SITE_URL,
    CONTACT_EMAIL,
    SOCIAL_LINKS,
    SITE_LAST_MODIFIED,
} from '@/config/site';
import { absoluteUrl } from '@/config/canonicals';
import { JsonLdScript } from '@/lib/jsonLd';
import type { Locale } from '@/i18n/routing';

/** Grafo Schema.org (WebSite + Person) que antes vivía inline en index.html. */
export async function JsonLd({ locale }: { locale: Locale }) {
    const t = await getTranslations({ locale, namespace: 'Schema' });

    /**
     * Home del idioma en curso, con su prefijo y su barra final: la misma URL que
     * el canonical. Con `SITE_URL` a secas, las páginas de /en/, /ca/ e /it/
     * declaraban la home española en `url` mientras el canonical apuntaba a la
     * suya, y encima sin la barra final.
     */
    const home = absoluteUrl('home', locale);

    /**
     * Los `@id` cuelgan de la home de cada idioma. Sin ellos, `publisher` era un
     * nodo `Person` repetido en línea: dos entidades distintas para la misma
     * persona, y la del `publisher` sin `sameAs`, `jobTitle` ni `worksFor`.
     *
     * Un `@id` único para los cuatro idiomas tampoco vale: los cuatro árboles
     * describen a la misma persona en su idioma, así que harían afirmaciones
     * contradictorias (cuatro `description`, cuatro `jobTitle`) sobre una sola
     * entidad. Los enlaza `sameAs` junto a los perfiles sociales.
     */
    const websiteId = `${home}#website`;
    const personId = `${home}#person`;

    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': websiteId,
                url: home,
                name: SITE_NAME,
                description: t('websiteDescription'),
                inLanguage: locale,
                dateModified: SITE_LAST_MODIFIED,
                publisher: { '@id': personId },
            },
            {
                '@type': 'Person',
                '@id': personId,
                name: SITE_NAME,
                alternateName: 'Salva Campello',
                image: `${SITE_URL}/assets/icons/profile.webp`,
                url: home,
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
                // `t.raw` y no una lista de índices a mano: con `knowsAbout.0…4`
                // fijos, un idioma que añadiera un tema lo perdía en silencio y
                // otro que quitara uno publicaba la clave literal como si fuera
                // texto ("Schema.knowsAbout.4").
                knowsAbout: Object.values(t.raw('knowsAbout') as Record<string, string>),
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
                    url: `${home}#contacto`,
                },
            },
        ],
    };

    return <JsonLdScript data={graph} />;
}
