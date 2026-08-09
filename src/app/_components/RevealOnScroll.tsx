'use client';

import { useEffect } from 'react';

/**
 * Disparo único de las animaciones de entrada: al asomar un `[data-reveal]` se
 * le añade `is-visible` y la animación CSS se reproduce sola durante su
 * duración. Sustituye a `whileInView` + `viewport={{ once: true }}` de motion.
 *
 * Un único observer para toda la página, en vez de un componente cliente por
 * elemento: así los componentes animados siguen siendo Server Components.
 *
 * La clase `js-reveal` en `<html>` es la red de seguridad: el estado inicial
 * oculto solo se aplica bajo ella, así que si este script no llega a ejecutarse
 * el contenido se ve igualmente (nunca queda en `opacity: 0` para siempre).
 */
export const RevealOnScroll = () => {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('js-reveal');

        const pending = new Set<Element>();

        const reveal = (el: Element) => {
            el.classList.add('is-visible');
            pending.delete(el);
            observer.unobserve(el);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) reveal(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
        );

        /**
         * Un IntersectionObserver solo avisa al **cruzar** un umbral. Un
         * elemento que pasa de estar por debajo del viewport a estar por
         * encima sin llegar a intersecar (restauración de scroll al recargar,
         * un salto brusco) nunca lo cruza y se quedaría invisible para
         * siempre. Este barrido revela los que ya han quedado atrás.
         */
        const sweepPassed = () => {
            for (const el of pending) {
                if (el.getBoundingClientRect().bottom < 0) reveal(el);
            }
            if (pending.size === 0) stopSweeping();
        };

        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                sweepPassed();
            });
        };

        const stopSweeping = () => {
            window.removeEventListener('scroll', onScroll);
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        const observe = (el: Element) => {
            pending.add(el);
            observer.observe(el);
        };

        const observeAll = (scope: ParentNode) => {
            for (const el of scope.querySelectorAll('[data-reveal]:not(.is-visible)')) {
                observe(el);
            }
        };

        observeAll(document);
        sweepPassed();

        // Las tarjetas de vídeo del home se insertan al terminar el `fetch`.
        const mutations = new MutationObserver((records) => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    const el = node as Element;
                    if (el.matches('[data-reveal]:not(.is-visible)')) observe(el);
                    observeAll(el);
                }
            }
            sweepPassed();
        });

        mutations.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutations.disconnect();
            stopSweeping();
            root.classList.remove('js-reveal');
        };
    }, []);

    return null;
};
