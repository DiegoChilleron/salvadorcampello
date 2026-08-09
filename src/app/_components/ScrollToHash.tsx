'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

/**
 * Sustituye al `ScrollToTop` de react-router. Next ya restaura el scroll al
 * navegar, así que aquí solo hace falta el salto suave a una ancla cuando se
 * llega a la página con hash (los enlaces del navbar apuntan a `/#curriculum`).
 */
export const ScrollToHash = () => {
    const pathname = usePathname();

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;

        const timer = setTimeout(() => {
            document.getElementById(hash.substring(1))?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
};
