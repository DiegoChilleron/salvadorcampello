import type { StaticImageData } from 'next/image';

import { StaticImg } from '@/components/UI/StaticImg';

interface GalleryItemProps {
    src: StaticImageData;
    alt: string;
}

export const GalleryItem = ({ src, alt }: GalleryItemProps) => {
    return (
        <li className="gallery-container">
            <StaticImg
                src={src}
                className="w-full h-full object-cover rounded-2xl"
                alt={alt}
                loading="lazy"
                decoding="async"
            />
        </li>
    );
};
