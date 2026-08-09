import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { PrivacityPolicy } from '@/components';
import { buildPageMetadata } from '@/config/metadata';
import { BreadcrumbSchema } from '@/components/UI/SEO/BreadcrumbSchema';

export function generateMetadata(): Metadata {
    return buildPageMetadata({
        key: 'privacyPolicy', locale: 'es', title: 'Política de Privacidad',
        description: 'Cómo se recogen, usan y protegen los datos personales en salvadorcampello.com, conforme al RGPD.',
        noindex: true,
    });
}

export default function PrivacityPolicyPage() {
    setRequestLocale('es');

    return (
        <main>
            <BreadcrumbSchema
                locale="es"
                items={[
                    { name: 'Inicio', key: 'home' },
                    { name: 'Política de Privacidad', key: 'privacyPolicy' },
                ]}
            />
            <PrivacityPolicy />
        </main>
    );
}
