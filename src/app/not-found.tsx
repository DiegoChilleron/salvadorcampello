import type { Metadata } from 'next';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Page404 } from '@/components';
import { IntlProvider } from '@/app/_components/IntlProvider';
import { pickMessages } from '@/i18n/clientMessages';
import { routing } from '@/i18n/routing';
import { openSans } from '@/app/fonts';

import '@/app/globals.css';

export const metadata: Metadata = {
    title: '404',
    robots: { index: false, follow: false },
};

/**
 * Con varios root layouts (uno por idioma) el not-found global no hereda
 * ninguno, así que renderiza su propio `<html>`/`<body>`. Se sirve en castellano
 * porque el export estático genera un único `404.html`.
 *
 * No necesita NextIntlClientProvider: Page404 es Server Component.
 */
export default async function NotFound() {
    const locale = routing.defaultLocale;
    setRequestLocale(locale);
    const messages = await getMessages({ locale });

    return (
        <html lang={locale} className={openSans.variable}>
            <body>
                <IntlProvider locale={locale} messages={pickMessages(messages, ['NotFound'])}>
                    <Page404 />
                </IntlProvider>
            </body>
        </html>
    );
}
