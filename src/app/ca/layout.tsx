import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

import { BaseLayout } from '@/app/_components/BaseLayout';
import { buildLayoutMetadata } from '@/config/metadata';

export function generateMetadata(): Promise<Metadata> {
    return buildLayoutMetadata('ca');
}

export const viewport: Viewport = {
    themeColor: '#CB333B',
};

export default function CaLayout({ children }: { children: ReactNode }) {
    return <BaseLayout locale="ca">{children}</BaseLayout>;
}
