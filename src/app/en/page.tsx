import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/Hero/Hero';
import { Description } from '@/components/Hero/Description';
import { HorizontalGallery } from '@/components/HorizontalGallery/HorizontalGallery';
import { Curriculum } from '@/components/Curriculum/Curriculum';
import { PortfolioMultimediaHome } from '@/components/PortfolioMultimedia/Home/PortfolioMultimediaHome';
import { Contact } from '@/components/Contact/Contact';
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
