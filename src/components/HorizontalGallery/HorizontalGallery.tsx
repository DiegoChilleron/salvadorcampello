import { useTranslations } from 'next-intl';

import { GalleryScrollButton } from './GalleryScrollButton';
import { GalleryItem } from './GalleryItem';

import Photo01 from '@/img/photos/carrousel/photo_01.webp';
import Photo02 from '@/img/photos/carrousel/photo_02.webp';
import Photo03 from '@/img/photos/carrousel/photo_03.webp';
import Photo04 from '@/img/photos/carrousel/photo_04.webp';
import Photo05 from '@/img/photos/carrousel/photo_05.webp';
import Photo06 from '@/img/photos/carrousel/photo_06.webp';
import Photo07 from '@/img/photos/carrousel/photo_07.webp';
import Photo08 from '@/img/photos/carrousel/photo_08.webp';

const photos = [Photo01, Photo02, Photo03, Photo04, Photo05, Photo06, Photo07, Photo08];

/**
 * `overflow-x-clip` recorta los 300 px que la pista se desplaza al entrar sin
 * crear scroll container (a diferencia de `overflow-x-hidden`, que fuerza
 * `overflow-y: auto`), así que no aparece barra de scroll horizontal.
 */
export const HorizontalGallery = () => {
    // Las fotos no son decorativas: son imágenes de Salvador en plató y en eventos,
    // así que llevan `alt` descriptivo y traducido en vez del `alt=""` que tenían.
    const t = useTranslations('Gallery');

    return (
        <section className="relative overflow-x-clip">
            <GalleryScrollButton direction="left" label="Anterior" />

            <div
                id="gallery-items"
                className="gallery-div"
                data-reveal="slide-left"
                style={{ '--reveal-duration': '2s' } as React.CSSProperties}
            >
                <ul className="gallery-div-ul">
                    {photos.map((src, index) => (
                        <GalleryItem key={index} src={src} alt={t(String(index))} />
                    ))}
                </ul>
            </div>

            <GalleryScrollButton direction="right" label="Siguiente" />
        </section>
    );
};
