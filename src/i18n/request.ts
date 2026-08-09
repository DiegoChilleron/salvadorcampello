import { getRequestConfig } from 'next-intl/server';
import { SITE_TIME_ZONE } from '@/config/site';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = routing.locales.includes(requested as Locale)
        ? (requested as Locale)
        : routing.defaultLocale;

    return {
        locale,
        timeZone: SITE_TIME_ZONE,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
