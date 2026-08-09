import { getTranslations } from 'next-intl/server';

import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Salvador Campello';

export default async function Image() {
    const t = await getTranslations({ locale: 'it', namespace: 'Og' });

    return renderOgImage({
        eyebrow: t('homeEyebrow'),
        title: 'Salvador Campello',
    });
}
