import { useTranslations } from 'next-intl';

import { CardCV } from './CardCV';
import { CopyBioButton } from './CopyBioButton';

import TeleElxLogo from '@/img/icons/logos/TeleElx_logo.svg';
import UMHLogo from '@/img/icons/logos/UMH_logo.svg';
import UMHRadioLogo from '@/img/icons/logos/UMH_radio_logo.svg';
import BolognaLogo from '@/img/icons/logos/bologna_logo.svg';
import AtresmediaLogo from '@/img/icons/logos/Atresmedia_logo.svg';
import COPELogo from '@/img/icons/logos/COPE_logo.svg';
import PuntoRadioLogo from '@/img/icons/logos/Punto_Radio_logo.svg';
import RadioJoveElxLogo from '@/img/icons/logos/RadioJoveElx_logo.webp';
import TarsaLogo from '@/img/icons/logos/Tarsa_logo.webp';

/**
 * Server Component: los ~45 textos del CV se resuelven en build. Solo el botón
 * de copiar biografía (CopyBioButton) y las tarjetas animadas (CardCV) son
 * componentes de cliente.
 */
export const Curriculum = () => {
    const t = useTranslations('Curriculum');

    const experiences = [
        {
            title: t('expblock1.company'),
            subtitle: t('expblock1.job1'),
            date: t('expblock1.date1'),
            description: t('expblock1.description1'),
            subtitle2: t('expblock1.job2'),
            date2: t('expblock1.date2'),
            description2: t('expblock1.description2'),
            subtitle3: t('expblock1.job3'),
            date3: t('expblock1.date3'),
            description3: t('expblock1.description3'),
            subtitle4: t('expblock1.job4'),
            date4: t('expblock1.date4'),
            description4: t('expblock1.description4'),
            img: TeleElxLogo,
            href: 'https://teleelx.es/',
        },
        {
            title: t('expblock2.company'),
            subtitle: t('expblock2.job'),
            date: t('expblock2.date'),
            description: t('expblock2.description'),
            img: TarsaLogo,
            href: 'https://tarsa.es/',
        },
        {
            title: t('expblock3.company'),
            subtitle: t('expblock3.job'),
            date: t('expblock3.date'),
            description: t('expblock3.description'),
            img: COPELogo,
            href: 'https://www.copeelche.com/',
        },
        {
            title: t('expblock4.company'),
            subtitle: t('expblock4.job'),
            date: t('expblock4.date'),
            description: t('expblock4.description'),
            img: UMHRadioLogo,
            href: 'https://radio.umh.es/',
        },
        {
            title: t('expblock5.company'),
            subtitle: t('expblock5.job'),
            date: t('expblock5.date'),
            description: t('expblock5.description'),
            img: PuntoRadioLogo,
            href: 'https://es.wikipedia.org/wiki/Punto_Radio',
        },
        {
            title: t('expblock6.company'),
            subtitle: t('expblock6.job'),
            date: t('expblock6.date'),
            description: t('expblock6.description'),
            img: RadioJoveElxLogo,
            href: 'https://www.elche.es/juventud/ocio-y-tiempo-libre/radio-joven-digital/',
        },
    ];

    const formaciones = [
        {
            title: t('formblock1.university'),
            subtitle: t('formblock1.title'),
            date: t('formblock1.date'),
            description: t('formblock1.description'),
            img: UMHLogo,
            href: 'https://www.umh.es/',
        },
        {
            title: t('formblock2.university'),
            subtitle: t('formblock2.title'),
            date: t('formblock2.date'),
            description: t('formblock2.description'),
            img: UMHLogo,
            href: 'https://www.umh.es/',
        },
        {
            title: t('formblock3.university'),
            subtitle: t('formblock3.title'),
            date: t('formblock3.date'),
            description: t('formblock3.description'),
            img: BolognaLogo,
            href: 'https://www.unibo.it/it',
        },
        {
            title: t('formblock4.university'),
            subtitle: t('formblock4.title'),
            date: t('formblock4.date'),
            description: t('formblock4.description'),
            img: AtresmediaLogo,
            href: 'https://www.atresmediaformacion.com/',
        },
    ];

    return (
        <section id="curriculum" className="px-6">
            <h2>{t('title')}</h2>

            <div className="curriculum__grid">
                <article className="curriculum__article">
                    <h3>{t('section1')}</h3>
                    {experiences.map((experience, index) => (
                        <CardCV key={index} {...experience} cat="experience" />
                    ))}
                </article>

                <article className="curriculum__article">
                    <h3>{t('section2')}</h3>
                    {formaciones.map((formacion, index) => (
                        <CardCV key={index} {...formacion} cat="formacion" />
                    ))}
                </article>
            </div>

            <div className="flex justify-center gap-x-4 md:gap-x-8 pt-8">
                <CopyBioButton
                    bio={t('clipboardbiography')}
                    copyLabel={t('clipboardcopy')}
                    copiedLabel={t('clipboardcopied')}
                />
            </div>
        </section>
    );
};
