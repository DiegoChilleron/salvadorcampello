import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { CookiesPolicy } from '@/components';
import { buildPageMetadata } from '@/config/metadata';
import { BreadcrumbSchema } from '@/components/UI/SEO/BreadcrumbSchema';

export function generateMetadata(): Metadata {
    return buildPageMetadata({
        key: 'cookiesPolicy', locale: 'es', title: 'Política de Cookies',
        description: 'Uso de cookies en salvadorcampello.com: el sitio no instala cookies propias ni de terceros hasta que reproduces un vídeo.',
        noindex: true,
    });
}

export default function CookiesPolicyPage() {
    setRequestLocale('es');

    return (
        <main>
            <BreadcrumbSchema
                locale="es"
                items={[
                    { name: 'Inicio', key: 'home' },
                    { name: 'Política de Cookies', key: 'cookiesPolicy' },
                ]}
            />
            <CookiesPolicy />
        </main>
    );
}
