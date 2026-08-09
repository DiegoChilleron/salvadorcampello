'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { HiChevronDown } from 'react-icons/hi2';

import { usePathname } from '@/i18n/navigation';
import { routing, localeNames, type Locale } from '@/i18n/routing';
import { localeHref, routeKeyFromPath, routeLocales } from '@/config/routes';

/**
 * Salta a la URL equivalente en el otro idioma. Como cada idioma tiene sus
 * propios segmentos, se resuelve la clave de ruta actual por búsqueda inversa
 * en `routes` y se recompone el destino con `localeHref`.
 *
 * Se usa un <a> normal en vez del Link de next-intl: cada idioma es un árbol
 * estático independiente, así que cambiar de idioma siempre es carga completa.
 *
 * `label` llega como prop desde el Footer, que es Server Component, en vez de
 * resolverse aquí con `useTranslations`: así el namespace `Footer` no entra en
 * CLIENT_NAMESPACES y no se serializa entero en las 14 páginas por un texto.
 */
export const LanguageSelector = ({ label }: { label: string }) => {
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const currentKey = routeKeyFromPath(pathname, locale);

    return (
        <div className="footer-div-lang">
            <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-xs bg-white/20 hover:bg-white/10 rounded-xl p-2 m-1 cursor-pointer flex items-center"
                aria-expanded={isDropdownOpen}
                aria-label={label}
            >
                {localeNames[locale]}
                <HiChevronDown
                    aria-hidden="true"
                    className={`ml-1 w-4 h-4 transition-transform ${isDropdownOpen ? '' : 'transform rotate-180'}`}
                />
            </button>

            {isDropdownOpen && (
                <div className="absolute z-10 right-0 bottom-full mb-1 bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
                    {routing.locales.map((lng) => {
                        const isCurrent = lng === locale;

                        // Si la ruta actual no existe en el idioma destino (las
                        // legales solo están en castellano), se va a la home.
                        const targetKey =
                            currentKey && routeLocales(currentKey).includes(lng)
                                ? currentKey
                                : 'home';

                        return (
                            <a
                                key={lng}
                                href={localeHref(targetKey, lng)}
                                hrefLang={lng}
                                onClick={() => setIsDropdownOpen(false)}
                                aria-current={isCurrent ? 'true' : undefined}
                                className={`block w-full text-left text-xs p-2 hover:bg-white/10 ${isCurrent ? 'bg-white/30' : ''}`}
                            >
                                {localeNames[lng]}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
