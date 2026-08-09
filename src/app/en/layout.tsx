import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

import { BaseLayout } from '@/app/_components/BaseLayout';
import { buildLayoutMetadata } from '@/config/metadata';

export function generateMetadata(): Promise<Metadata> {
    return buildLayoutMetadata('en');
}

export const viewport: Viewport = {
    themeColor: '#CB333B',
};

export default function EnLayout({ children }: { children: ReactNode }) {
    return <BaseLayout locale="en">{children}</BaseLayout>;
}
