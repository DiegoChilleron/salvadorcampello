import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LegalNotice } from '@/components';
import { buildPageMetadata } from '@/config/metadata';
import { BreadcrumbSchema } from '@/components/UI/SEO/BreadcrumbSchema';

export function generateMetadata(): Metadata {
    return buildPageMetadata({
        key: 'legalNotice', locale: 'es', title: 'Aviso Legal',
        description: 'Titularidad, propiedad intelectual, responsabilidad sobre los contenidos, protección de datos y jurisdicción aplicable del sitio web de Salvador Campello.',
        noindex: true,
    });
}

export default function LegalNoticePage() {
    setRequestLocale('es');

    return (
        <main>
            <BreadcrumbSchema
                locale="es"
                items={[
                    { name: 'Inicio', key: 'home' },
                    { name: 'Aviso Legal', key: 'legalNotice' },
                ]}
            />
            <LegalNotice />
        </main>
    );
}
