'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { routePath } from '@/config/routes';
import type { Locale } from '@/i18n/routing';

const SECTION_IDS = ['inicio', 'curriculum', 'portfolio', 'contacto'] as const;

/**
 * Se queda como componente de cliente a propósito, aunque parezca lo contrario:
 * pasarlo a servidor obliga a serializar los 8 `<Link>` —que son componentes de
 * cliente— con sus props en el payload RSC de las 14 páginas. Medido: +6 KB gzip de
 * HTML a cambio de ahorrar 1 KB de JS.
 *
 * La navegación ya no lleva `onClick`: los enlaces son anclas reales, el `Link` de
 * next-intl hace la navegación de cliente y el desplazamiento suave lo da
 * `scroll-behavior: smooth` del CSS. El handler que había hacía `preventDefault()` para
 * luego rehacer a mano lo mismo, y de paso rompía abrir en pestaña nueva con ⌘/Ctrl+clic.
 *
 * El único manejador que queda cierra el menú móvil, por delegación en el `<ul>`.
 */
export const Navbar = () => {
    const t = useTranslations('Navbar');
    const locale = useLocale() as Locale;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const home = routePath('home', locale);

    const links = SECTION_IDS.map((id, index) => {
        const label = t(`section${index + 1}`);
        return (
            <li key={id}>
                <Link href={`${home}#${id}`} aria-label={label}>
                    {label}
                </Link>
            </li>
        );
    });

    return (
        <header>
            <nav aria-label={t('mainNav')}>
                <div className="nav-div">
                    <div className="md:hidden">
                        <button
                            className="text-white hamburger-button"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            aria-label={t('toggleMenu')}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {/* Un único <svg> que cambia de `path`, no dos componentes
                                distintos: la transición de `.hamburger-icon` solo se
                                reproduce si React conserva el mismo elemento al
                                cambiarle la clase. Con <HiBars3>/<HiXMark> se desmontaba
                                uno y se montaba el otro, ya rotado, sin animar. */}
                            <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                className={`w-6 h-6 hamburger-icon ${isMenuOpen ? 'hamburger-icon--open' : ''}`}
                                aria-hidden="true"
                            >
                                {isMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                    <ul className="nav-ul-desktop">{links}</ul>
                </div>

                <ul
                    className={`nav-ul-mobile ${isMenuOpen ? 'nav-ul-mobile--open' : 'nav-ul-mobile--closed'}`}
                    id="mobile-menu"
                    onClick={() => setIsMenuOpen(false)}
                >
                    {links}
                </ul>
            </nav>
        </header>
    );
};
