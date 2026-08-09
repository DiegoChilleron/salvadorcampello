import { useCallback, useEffect, useInsertionEffect, useRef } from 'react';

/**
 * Un único IntersectionObserver compartido por todas las tarjetas de vídeo.
 *
 * Cada `VideoCard` creaba el suyo: con el tamaño «small» se llegaban a instanciar 85
 * observers en la misma página (medido). El navegador mantiene estructuras internas por
 * observer, y son todos idénticos salvo el elemento observado.
 *
 * Dispara una sola vez por elemento y lo deja de observar, que es justo lo que necesita
 * la carga diferida de miniaturas.
 */
const OPTIONS: IntersectionObserverInit = { threshold: 0.1, rootMargin: '50px' };

const callbacks = new WeakMap<Element, () => void>();

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
    if (!observer) {
        observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;

                const callback = callbacks.get(entry.target);
                callbacks.delete(entry.target);
                observer?.unobserve(entry.target);
                callback?.();
            }
        }, OPTIONS);
    }
    return observer;
}

export function useInViewOnce<T extends Element>(onEnter: () => void) {
    const ref = useRef<T>(null);

    // La referencia se guarda para que cambiar `onEnter` no vuelva a suscribir el
    // elemento (y con ello pierda el disparo si ya había entrado). Se sincroniza en un
    // efecto porque escribir una ref durante el render no es seguro.
    const handler = useRef(onEnter);

    useInsertionEffect(() => {
        handler.current = onEnter;
    }, [onEnter]);

    const stableHandler = useCallback(() => handler.current(), []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const io = getObserver();
        callbacks.set(element, stableHandler);
        io.observe(element);

        return () => {
            callbacks.delete(element);
            io.unobserve(element);
        };
    }, [stableHandler]);

    return ref;
}
