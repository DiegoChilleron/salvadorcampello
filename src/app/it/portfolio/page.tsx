import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PortfolioMultimediaAllVideos } from '@/components';
import { buildPageMetadata } from '@/config/metadata';
import { BreadcrumbSchema } from '@/components/UI/SEO/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations({ locale: 'it', namespace: 'PortfolioPage' });

    return buildPageMetadata({
        key: 'portfolio',
        locale: 'it',
        title: t('title'),
        // `metaDescription` y no `description`: esta última se pinta como <p> bajo el
        // H1, así que alargarla para SERP cambiaría el texto visible de la página.
        description: t('metaDescription'),
    });
}

export default async function ItPortfolio() {
    setRequestLocale('it');
    const t = await getTranslations({ locale: 'it', namespace: 'PortfolioPage' });
    const nav = await getTranslations({ locale: 'it', namespace: 'Navbar' });

    return (
        <main>
            <BreadcrumbSchema
                locale="it"
                items={[
                    { name: nav('section1'), key: 'home' },
                    { name: t('title'), key: 'portfolio' },
                ]}
            />
            <PortfolioMultimediaAllVideos />
        </main>
    );
}
