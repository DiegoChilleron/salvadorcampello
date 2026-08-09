import { useCallback, useEffect, useInsertionEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Observa un elemento y avisa cuando entra en el viewport.
 *
 * Devuelve una **ref de callback**, no una `useRef`. Con `useRef` el efecto podía
 * ejecutarse en un render en el que el elemento aún no estaba montado
 * (`targetRef.current === null`), y como después las dependencias ya no volvían a
 * cambiar, el efecto no se repetía y el elemento nunca llegaba a observarse. Con una
 * ref de callback el nodo entra en el estado, así que su aparición provoca por sí misma
 * la ejecución del efecto.
 *
 * `onIntersect` se lee de una ref para que cambiar de callback no recree el observer.
 */
export const useIntersectionObserver = ({
  onIntersect,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true
}: UseIntersectionObserverProps) => {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  const handler = useRef(onIntersect);

  useInsertionEffect(() => {
    handler.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!target || !enabled) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        handler.current();
      }
    }, {
      threshold,
      rootMargin
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [target, threshold, rootMargin, enabled]);

  return useCallback((node: HTMLDivElement | null) => setTarget(node), []);
};
