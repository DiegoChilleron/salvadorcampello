import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PortfolioMultimediaAllVideos } from '@/components';
import { buildPageMetadata } from '@/config/metadata';
import { BreadcrumbSchema } from '@/components/UI/SEO/BreadcrumbSchema';
import { VideoListSchema } from '@/components/UI/SEO/VideoListSchema';
import { getInitialVideos, toClientVideos } from '@/lib/videos';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations({ locale: 'es', namespace: 'PortfolioPage' });

    return buildPageMetadata({
        key: 'portfolio',
        locale: 'es',
        title: t('title'),
        // `metaDescription` y no `description`: esta última se pinta como <p> bajo el
        // H1, así que alargarla para SERP cambiaría el texto visible de la página.
        description: t('metaDescription'),
    });
}

export default async function EsPortfolio() {
    setRequestLocale('es');
    const t = await getTranslations({ locale: 'es', namespace: 'PortfolioPage' });
    const nav = await getTranslations({ locale: 'es', namespace: 'Navbar' });
    // Lectura en build de los listados: sin esto la página servía 352 caracteres de
    // texto y todo el catálogo llegaba por fetch de cliente (ver src/lib/videos.ts).
    const videos = getInitialVideos();

    return (
        <main>
            {/* La miniatura de la primera tarjeta es el elemento LCP de esta página y
                vive en un origen ajeno, así que antes de poder pedirla hay que resolver
                DNS y negociar TLS con i.ytimg.com. El preconnect adelanta ese coste al
                parseo del HTML, en paralelo con el resto de la carga.
                React 19 lo iza al <head> aunque se declare aquí. */}
            <link rel="preconnect" href="https://i.ytimg.com" />
            <BreadcrumbSchema
                locale="es"
                items={[
                    { name: nav('section1'), key: 'home' },
                    { name: t('title'), key: 'portfolio' },
                ]}
            />
            <VideoListSchema locale="es" videos={videos} />
            <PortfolioMultimediaAllVideos initialVideos={toClientVideos(videos)} />
        </main>
    );
}
