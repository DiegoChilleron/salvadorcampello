'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { HiArrowUp, HiMagnifyingGlass } from 'react-icons/hi2';

import { Link } from '@/i18n/navigation';
import { routePath } from '@/config/routes';
import type { Locale } from '@/i18n/routing';
import { ListSectionAllVideos } from './ListSectionAllVideos';
import { DialogYoutube } from '../DialogYoutube';
import { CATEGORY_IDS, type CategoryId } from '../categories';
import type { CardSize } from '../VideoCard';

import icon_small from '@/img/icons/icon_small.svg';
import icon_medium from '@/img/icons/icon_medium.svg';
import icon_big from '@/img/icons/icon_big.svg';
import back_arrow_icon from '@/img/icons/back_arrow_icon.svg';

// Solo el asset: el texto alternativo se traduce en el render (`PortfolioPage.size`).
const SIZE_ICONS: Record<CardSize, typeof icon_big> = {
    big: icon_big,
    medium: icon_medium,
    small: icon_small,
};

export const PortfolioMultimediaAllVideos = () => {
    const t = useTranslations('PortfolioPage');
    const locale = useLocale() as Locale;
    const [activeSection, setActiveSection] = useState<CategoryId>('telenit');
    const [cardSize, setCardSize] = useState<CardSize>('big');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Debounce para la búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Procesar el hash fragment de la URL al cargar. El hash no existe durante
    // el prerenderizado, así que solo puede leerse tras montar.
    useEffect(() => {
        const hash = window.location.hash.substring(1).toLowerCase();
        const matchingCategory = CATEGORY_IDS.find((cat) => cat === hash);

        if (matchingCategory) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveSection(matchingCategory);
        }

        window.scrollTo(0, 0);
    }, []);

    // Control del botón de scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 1500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = useCallback((category: CategoryId) => {
        setActiveSection(category);
        // Actualizar el hash de la URL cuando el usuario cambie de categoría
        window.history.replaceState(null, '', `#${category}`);
    }, []);

    // Función para cambiar el tamaño de las tarjetas
    const handleSizeChange = useCallback(() => {
        setCardSize((currentSize) => {
            switch (currentSize) {
                case 'big':
                    return 'medium';
                case 'medium':
                    return 'small';
                default:
                    return 'big';
            }
        });
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    return (
        <div className="min-h-svh pt-28">
            <div>
                <h1 className="pt-6">{t('title')}</h1>

                <p className="text-center p-4">{t('description')}</p>

                <div className="flex flex-wrap gap-x-2 justify-center my-2 md:my-6">
                    {CATEGORY_IDS.map((category, index) => (
                        <button
                            key={category}
                            id={category}
                            className={`button-category ${
                                activeSection === category
                                    ? 'bg-blue-900/80 text-white'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-900 hover:bg-gray-400 dark:hover:bg-gray-500 dark:text-white'
                            }`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {t(`category.${index + 1}`)}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center gap-x-1 p-2 md:px-14">
                    {/* Botón para ir a home - alineado a la izquierda */}
                    <div>
                        <Link
                            href={routePath('home', locale)}
                            className="button group inline-flex"
                            aria-label={t('backbutton')}
                            title={t('backbutton')}
                        >
                            <Image
                                src={back_arrow_icon}
                                alt={t('backbutton')}
                                className="w-5 h-5 group-hover:invert dark:invert"
                            />
                        </Link>
                    </div>

                    {/* Controles alineados a la derecha */}
                    <div className="flex gap-x-1">
                        <div>
                            {/* Botón para cambiar el tamaño */}
                            <button
                                className="button group"
                                onClick={handleSizeChange}
                                aria-label={t('sizetoggle')}
                                title={t('sizetoggle')}
                            >
                                <Image
                                    src={SIZE_ICONS[cardSize]}
                                    alt={t(`size.${cardSize}`)}
                                    className="w-5 h-5 group-hover:invert dark:invert"
                                />
                            </button>
                        </div>

                        {/* Cuadro de búsqueda */}
                        <div>
                            <label htmlFor="search-videos" className="sr-only">
                                {t('search.placeholder')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiMagnifyingGlass
                                        aria-hidden="true"
                                        className="h-5 w-5 text-gray-400"
                                    />
                                </div>
                                <input
                                    id="search-videos"
                                    className="search-box"
                                    placeholder={t('search.placeholder')}
                                    type="search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ListSectionAllVideos
                key={activeSection}
                category={activeSection}
                cardSize={cardSize}
                searchTerm={debouncedSearchTerm}
            />

            {/* Botón flotante para volver arriba */}
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 bg-blue-900/80 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
                    aria-label={t('scrolltop')}
                    title={t('scrolltop')}
                >
                    <HiArrowUp aria-hidden="true" className="h-6 w-6" />
                </button>
            )}

            <DialogYoutube />
        </div>
    );
};
