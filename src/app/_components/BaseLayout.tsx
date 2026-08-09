import type { ReactNode } from 'react';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Navbar, Footer } from '@/components';
import type { Locale } from '@/i18n/routing';
import { CLIENT_NAMESPACES, pickMessages } from '@/i18n/clientMessages';
import { openSans } from '@/app/fonts';
import { IntlProvider } from './IntlProvider';
import { JsonLd } from './JsonLd';
import { RevealOnScroll } from './RevealOnScroll';
import { ScrollToHash } from './ScrollToHash';

import '@/app/globals.css';

/**
 * Estructura común a los cuatro árboles de idioma: `<html>`/`<body>`, la fuente,
 * el provider de next-intl, el JSON-LD y el navbar/footer. Cada `layout.tsx` de
 * idioma solo fija su locale.
 */
export async function BaseLayout({ locale, children }: { locale: Locale; children: ReactNode }) {
    setRequestLocale(locale);
    const messages = await getMessages({ locale });

    return (
        <html lang={locale} className={openSans.variable}>
            <body>
                {/* Solo los namespaces que usan componentes de cliente: el resto
                    ya está resuelto en el HTML y no hace falta enviarlo. */}
                <IntlProvider
                    locale={locale}
                    messages={pickMessages(messages, CLIENT_NAMESPACES)}
                >
                    <JsonLd locale={locale} />
                    <ScrollToHash />
                    <RevealOnScroll />
                    <Navbar />
                    {children}
                    <Footer />
                </IntlProvider>
            </body>
        </html>
    );
}
