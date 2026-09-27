import type { ImgHTMLAttributes } from 'react';
import type { StaticImageData } from 'next/image';

type StaticImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
    src: StaticImageData;
    alt: string;
};

/**
 * `<img>` para imágenes importadas estáticamente (`import logo from '@/img/…'`).
 *
 * Sustituye a `next/image`: con `output: 'export'` e `images.unoptimized` no hay optimizador
 * ni srcset, así que solo renderizaba este mismo `<img>`, pero añadía su runtime al JS de
 * todas las páginas que lo usaban. Conserva lo que aportaba: `width`/`height` del import
 * (sin saltos de maquetación), `loading="lazy"` y `decoding="async"` por defecto.
 */
export function StaticImg({ src, alt, loading = 'lazy', decoding = 'async', ...rest }: StaticImgProps) {
    return (
        <img
            src={src.src}
            width={src.width}
            height={src.height}
            alt={alt}
            loading={loading}
            decoding={decoding}
            {...rest}
        />
    );
}
