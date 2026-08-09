import { getTranslations } from 'next-intl/server';

import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Portfolio multimedia — Salvador Campello';

export default async function Image() {
    const [og, page] = await Promise.all([
        getTranslations({ locale: 'es', namespace: 'Og' }),
        getTranslations({ locale: 'es', namespace: 'PortfolioPage' }),
    ]);

    return renderOgImage({
        eyebrow: og('portfolioEyebrow'),
        title: page('title'),
    });
}
