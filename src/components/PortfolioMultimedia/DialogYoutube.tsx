'use client';

import { useRef, useEffect, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';

export const openDialog = (videoId: string): void => {
    const popup = document.getElementById('video-popup') as HTMLDialogElement | null;
    const iframe = document.getElementById('iframe') as HTMLIFrameElement | null;

    if (iframe) {
        iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`);
    }
    document.body.classList.add('overflow-hidden');

    if (popup) {
        popup.showModal();
    }
};

export const closeDialog = (): void => {
    const popup = document.getElementById('video-popup') as HTMLDialogElement | null;
    const iframe = document.getElementById('iframe') as HTMLIFrameElement | null;

    if (iframe) {
        iframe.removeAttribute('src');
    }
    document.body.classList.remove('overflow-hidden');

    if (popup) {
        popup.close();
    }
};

export const DialogYoutube = memo(function DialogYoutube() {
    const t = useTranslations('DialogYoutube');
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDialogElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent): void => {
        if (popupRef.current && event.target === popupRef.current) {
            closeDialog();
        }
    }, []);

    const preventTouchMove = useCallback((e: TouchEvent): void => {
        e.preventDefault();
    }, []);

    useEffect(() => {
        const closeButton = closeButtonRef.current;
        const popup = popupRef.current;

        if (closeButton) {
            closeButton.addEventListener('click', closeDialog);
        }

        if (popup) {
            popup.addEventListener('click', handleClickOutside);
            popup.addEventListener('touchmove', preventTouchMove, { passive: false });
        }

        return () => {
            if (closeButton) {
                closeButton.removeEventListener('click', closeDialog);
            }

            if (popup) {
                popup.removeEventListener('click', handleClickOutside);
                popup.removeEventListener('touchmove', preventTouchMove);
            }
        };
    }, [handleClickOutside, preventTouchMove]);

    return (
        <dialog
            id="video-popup"
            ref={popupRef}
            className="bg-white/50 dark:bg-black/60 backdrop-blur-md rounded-xl p-1 md:p-2 border border-gray-500 w-full md:w-9/12 lg:w-7/12 m-auto h-fit text-gray-800 dark:text-gray-200 dark:border-gray-700"
            aria-labelledby="dialog-title"
        >
            <div className="flex justify-between items-center mb-2">
                <span id="dialog-title" className="sr-only">
                    {t('title')}
                </span>
                <button
                    id="close-popup"
                    ref={closeButtonRef}
                    className="ml-auto px-2 py-1 rounded"
                    aria-label={t('closelabel')}
                >
                    {t('close')}
                </button>
            </div>
            <iframe
                id="iframe"
                className="aspect-video w-full h-auto bg-black rounded-xl"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>
        </dialog>
    );
});
