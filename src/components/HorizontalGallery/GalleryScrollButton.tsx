'use client';

interface GalleryScrollButtonProps {
    direction: 'left' | 'right';
    label: string;
}

/**
 * Único trozo interactivo del carrusel. El resto de la galería (las 8 fotos y
 * su animación de entrada) se renderiza en servidor.
 */
export const GalleryScrollButton = ({ direction, label }: GalleryScrollButtonProps) => {
    const offset = direction === 'left' ? -400 : 400;

    return (
        <button
            id={direction === 'left' ? 'scrollLeft' : 'scrollRight'}
            onClick={() =>
                document
                    .getElementById('gallery-items')
                    ?.scrollBy({ left: offset, behavior: 'smooth' })
            }
            aria-label={label}
            data-reveal="fade-in"
            style={{ '--reveal-duration': '3s' } as React.CSSProperties}
            className={`gallery-button ${direction === 'left' ? 'left-10' : 'right-10'}`}
        >
            {direction === 'left' ? '❮' : '❯'}
        </button>
    );
};
