import { getTranslations } from 'next-intl/server';

import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Política de Cookies — Salvador Campello';

export default async function Image() {
    const t = await getTranslations({ locale: 'es', namespace: 'Og' });

    return renderOgImage({
        eyebrow: t('legalEyebrow'),
        title: 'Política de Cookies',
    });
}
