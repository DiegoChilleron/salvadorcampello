'use client';

import type { ReactNode } from 'react';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';

import { SITE_TIME_ZONE } from '@/config/site';
import { onClientMessageError } from '@/i18n/clientMessages';

/**
 * Envuelve a NextIntlClientProvider para poder pasarle `onError`: las funciones
 * no cruzan la frontera servidor→cliente, así que tiene que definirse ya dentro
 * del bundle de cliente.
 *
 * `timeZone` se importa aquí en vez de recibirse como prop: es una constante, y
 * pasarla desde el layout la serializaría en el payload RSC de las 14 páginas
 * para nada. Tiene que declararse también en el provider de cliente, no basta
 * con `getRequestConfig`: ese solo cubre el lado servidor.
 */
export function IntlProvider({
    locale,
    messages,
    children,
}: {
    locale: string;
    messages: AbstractIntlMessages;
    children: ReactNode;
}) {
    return (
        <NextIntlClientProvider
            locale={locale}
            timeZone={SITE_TIME_ZONE}
            messages={messages}
            onError={onClientMessageError}
        >
            {children}
        </NextIntlClientProvider>
    );
}
