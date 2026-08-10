import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PortfolioMultimediaAllVideos } from '@/components';
import { buildPageMetadata } from '@/config/metadata';
import { BreadcrumbSchema } from '@/components/UI/SEO/BreadcrumbSchema';
import { VideoListSchema } from '@/components/UI/SEO/VideoListSchema';
import { getInitialVideos, toClientVideos } from '@/lib/videos';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations({ locale: 'en', namespace: 'PortfolioPage' });

    return buildPageMetadata({
        key: 'portfolio',
        locale: 'en',
        title: t('title'),
        // `metaDescription` y no `description`: esta última se pinta como <p> bajo el
        // H1, así que alargarla para SERP cambiaría el texto visible de la página.
        description: t('metaDescription'),
    });
}

export default async function EnPortfolio() {
    setRequestLocale('en');
    const t = await getTranslations({ locale: 'en', namespace: 'PortfolioPage' });
    const nav = await getTranslations({ locale: 'en', namespace: 'Navbar' });
    // Lectura en build de los listados: sin esto la página servía 352 caracteres de
    // texto y todo el catálogo llegaba por fetch de cliente (ver src/lib/videos.ts).
    const videos = getInitialVideos();

    return (
        <main>
            <BreadcrumbSchema
                locale="en"
                items={[
                    { name: nav('section1'), key: 'home' },
                    { name: t('title'), key: 'portfolio' },
                ]}
            />
            <VideoListSchema locale="en" videos={videos} />
            <PortfolioMultimediaAllVideos initialVideos={toClientVideos(videos)} />
        </main>
    );
}
