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
    return buildPageMetadata({ key: 'home', locale: 'en' });
}

export default function EnHome() {
    setRequestLocale('en');

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
