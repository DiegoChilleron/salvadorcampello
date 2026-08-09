'use client';

import Image, { type StaticImageData } from 'next/image';

interface CardCVProps {
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
    subtitle2?: string;
    date2?: string;
    description2?: string;
    subtitle3?: string;
    date3?: string;
    description3?: string;
    subtitle4?: string;
    date4?: string;
    description4?: string;
    img?: StaticImageData;
    href?: string;
    cat: string;
}

export const CardCV = ({
    title,
    subtitle,
    date,
    description,
    subtitle2,
    date2,
    description2,
    subtitle3,
    date3,
    description3,
    subtitle4,
    date4,
    description4,
    img,
    href,
    cat,
}: CardCVProps) => {
    // Experiencia entra desde la izquierda, formación desde la derecha.
    const reveal = ['experience', 'language'].includes(cat) ? 'fade-right' : 'fade-left';

    const logo = img && (
        <Image
            src={img}
            alt={`Logotipo de ${title}`}
            className="w-8 h-auto mr-2"
            style={{ height: 'auto' }}
            loading="lazy"
        />
    );

    return (
        <div
            className="curriculum__card"
            data-reveal={reveal}
            style={{ '--reveal-duration': '1s' } as React.CSSProperties}
        >
            {href ? (
                <a href={href} className="flex items-center py-2" rel="nofollow">
                    {logo}
                    <h4>{title}</h4>
                </a>
            ) : (
                <div className="flex items-center py-2">
                    {logo}
                    <h4>{title}</h4>
                </div>
            )}
            {subtitle && <h5>{subtitle}</h5>}
            {date && <p className="date">{date}</p>}
            {description && <p>{description}</p>}

            {subtitle2 && (
                <>
                    <br />
                    <h5>{subtitle2}</h5>
                    {date2 && <p className="date">{date2}</p>}
                    {description2 && <p>{description2}</p>}
                </>
            )}

            {subtitle3 && (
                <>
                    <br />
                    <h5>{subtitle3}</h5>
                    {date3 && <p className="date">{date3}</p>}
                    {description3 && <p>{description3}</p>}
                </>
            )}

            {subtitle4 && (
                <>
                    <br />
                    <h5>{subtitle4}</h5>
                    {date4 && <p className="date">{date4}</p>}
                    {description4 && <p>{description4}</p>}
                </>
            )}
        </div>
    );
};
