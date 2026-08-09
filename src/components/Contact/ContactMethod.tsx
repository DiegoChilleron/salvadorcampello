import Image from 'next/image';
import { useTranslations } from 'next-intl';

import MailIcon from '@/img/icons/mail_icon.svg';
import { CONTACT_EMAIL } from '@/config/site';

export const ContactMethod = () => {
    const t = useTranslations('SocialNetworks');

    return (
        <article>
            <div className="contact__method">
                <a href={`mailto:${CONTACT_EMAIL}`}>
                    <Image
                        src={MailIcon}
                        alt="Correo"
                        title={`Enviar correo a ${CONTACT_EMAIL}`}
                    />
                </a>
            </div>
            <p>
                <br />
                {t('mail')}: {CONTACT_EMAIL}
            </p>
        </article>
    );
};
