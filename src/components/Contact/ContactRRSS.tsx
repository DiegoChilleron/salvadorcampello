import Image from 'next/image';

import InstagramIcon from '@/img/icons/rrss/instagram_icon.svg';
import FacebookIcon from '@/img/icons/rrss/facebook_icon.svg';
import TwitterIcon from '@/img/icons/rrss/x_icon.svg';
import LinkedInIcon from '@/img/icons/rrss/linked_in_icon.svg';
import { SOCIAL_LINKS } from '@/config/site';

export const ContactRRSS = () => {
    return (
        <article className="contact__rrss">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" id="instagram">
                <Image src={InstagramIcon} alt="Instagram" title="@SalvaElx" />
            </a>

            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" id="facebook">
                <Image src={FacebookIcon} alt="Facebook" title="@CampelloIborra" />
            </a>

            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" id="twitter">
                <Image src={TwitterIcon} alt="X" title="@SalvaElx" />
            </a>

            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" id="linkedin">
                <Image src={LinkedInIcon} alt="LinkedIn" title="@SalvadorCampelloIborra" />
            </a>
        </article>
    );
};
