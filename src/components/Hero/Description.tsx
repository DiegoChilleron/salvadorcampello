import { useTranslations } from 'next-intl';

export const Description = () => {
    const t = useTranslations('Hero.description');

    const em = (chunks: React.ReactNode) => <span>{chunks}</span>;

    return (
        <div id="description" className="description__section">
            <div className="description__container">
                <p>{t.rich('paragraph1', { em })}</p>
                <p>{t.rich('paragraph2', { em })}</p>
                <p>{t.rich('paragraph3', { em })}</p>
            </div>
        </div>
    );
};
