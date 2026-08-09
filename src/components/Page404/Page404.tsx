'use client';

import { useTranslations } from 'next-intl';

import { localeHref } from '@/config/routes';

const NOISE_BACKGROUND =
    'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url%28%23noise%29%22/%3E%3C/svg%3E")';

export const Page404 = () => {
    const t = useTranslations('NotFound');

    return (
        <div className="min-h-screen flex items-center justify-center bg-lighttertiary p-4">
            <div className="relative w-full max-w-3xl">
                {/* Old TV frame */}
                <div className="bg-gray-800 rounded-lg p-8 border-8 border-gray-700 shadow-2xl relative overflow-hidden animate-tv-turn-on">
                    {/* TV screen */}
                    <div className="relative bg-gray-900 aspect-video rounded-md overflow-hidden">
                        {/* El parpadeo lo hace la animación `flicker` de .bg-static */}
                        <div
                            className="absolute inset-0 bg-static"
                            style={{
                                backgroundImage: NOISE_BACKGROUND,
                                mixBlendMode: 'screen',
                            }}
                        />

                        {/* Error message */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <div className="animate-tv-message-in">
                                <h1 className="text-4xl md:text-4xl font-bold text-white mb-2">404</h1>
                                <div className="bg-red-600 text-white px-4 py-1 rounded-sm inline-block mb-6 uppercase">
                                    {t('title')}
                                </div>
                                <p className="text-1xl md:text-2xl text-white mb-6">{t('subtitle')}</p>
                                <div className="text-sm md:text-base text-gray-400 mb-8 max-w-md mx-auto">
                                    {t('description')}
                                </div>

                                {/* Channel buttons */}
                                <div className="flex justify-center mt-4 gap-4">
                                    {/* <a> normal: el 404.html se sirve para
                                        cualquier ruta, también las de otros idiomas. */}
                                    <a
                                        href={localeHref('home', 'es')}
                                        className="press-scale inline-block bg-white text-black font-medium py-2 px-6 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        {t('button')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TV controls */}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
