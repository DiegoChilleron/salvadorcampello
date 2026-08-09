import Image, { type StaticImageData } from 'next/image';

interface GalleryItemProps {
    src: StaticImageData;
    alt: string;
}

export const GalleryItem = ({ src, alt }: GalleryItemProps) => {
    return (
        <li className="gallery-container">
            <Image
                src={src}
                className="w-full h-full object-cover rounded-2xl"
                alt={alt}
                loading="lazy"
                decoding="async"
            />
        </li>
    );
};
