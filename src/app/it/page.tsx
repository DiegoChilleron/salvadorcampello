import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import {
    Hero,
    Description,
    HorizontalGallery,
    Curriculum,
    PortfolioMultimediaHome,
    Contact,
} from '@/components';
import { buildPageMetadata } from '@/config/metadata';

export function generateMetadata(): Metadata {
    return buildPageMetadata({ key: 'home', locale: 'it' });
}

export default function ItHome() {
    setRequestLocale('it');

    return (
        <main>
            <Hero>
                <Description />
            </Hero>
            <HorizontalGallery />
            <Curriculum />
            <PortfolioMultimediaHome />
            <Contact />
        </main>
    );
}
