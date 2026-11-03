'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

export function useMagnetic(route: string) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        let current: HTMLElement | null = null;
        let content: HTMLElement | null = null;
        let rect: DOMRect | null = null;
        let x: ReturnType<typeof gsap.quickTo> | null = null;
        let y: ReturnType<typeof gsap.quickTo> | null = null;
        const reset = () => {
          x?.tween.kill();
          y?.tween.kill();
          if (content) gsap.to(content, { x: 0, y: 0, duration: 0.35, overwrite: true });
          current = content = null;
          rect = null;
        };
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse' || event.buttons) {
            reset();
            return;
          }
          const target =
            event.target instanceof Element
              ? event.target.closest<HTMLElement>('[data-magnetic]')
              : null;
          if (target !== current) {
            reset();
            current = target;
            content = target?.querySelector<HTMLElement>('[data-magnetic-content]') || null;
            if (target && content) {
              rect = target.getBoundingClientRect();
              x = gsap.quickTo(content, 'x', { duration: 0.25, ease: 'power3.out' });
              y = gsap.quickTo(content, 'y', { duration: 0.25, ease: 'power3.out' });
            }
          }
          if (!rect || !content) return;
          x?.(gsap.utils.clamp(-5, 5, (event.clientX - rect.left - rect.width / 2) * 0.12));
          y?.(gsap.utils.clamp(-5, 5, (event.clientY - rect.top - rect.height / 2) * 0.12));
        };
        document.addEventListener('pointermove', move, { passive: true });
        document.addEventListener('pointerleave', reset);
        window.addEventListener('blur', reset);
        window.addEventListener('scroll', reset, true);
        window.addEventListener('resize', reset);
        return () => {
          reset();
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerleave', reset);
          window.removeEventListener('blur', reset);
          window.removeEventListener('scroll', reset, true);
          window.removeEventListener('resize', reset);
        };
      },
    );
    return () => media.revert();
  }, [route]);
}
