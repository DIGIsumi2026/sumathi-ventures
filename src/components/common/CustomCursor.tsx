'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useMagnetic } from '@/hooks/useMagnetic';
import '@/styles/common/cursor.css';

export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const route = usePathname();
  useMagnetic(route);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = gsap.matchMedia();
    media.add(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        const dot = node.querySelector<HTMLElement>('.sv-cursor-dot')!;
        const ring = node.querySelector<HTMLElement>('.sv-cursor-ring')!;
        const shape = node.querySelector<HTMLElement>('.sv-cursor-shape')!;
        const label = node.querySelector<HTMLElement>('.sv-cursor-label')!;
        const dotX = gsap.quickTo(dot, 'x', { duration: 0.09, ease: 'power2.out' });
        const dotY = gsap.quickTo(dot, 'y', { duration: 0.09, ease: 'power2.out' });
        const ringX = gsap.quickTo(ring, 'x', { duration: 0.24, ease: 'power2.out' });
        const ringY = gsap.quickTo(ring, 'y', { duration: 0.24, ease: 'power2.out' });
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
        let visible = false;
        let state = '';
        let pressed = false;
        let dragging = false;
        let size = 1;
        let pointer: { x: number; y: number } | null = null;
        let frame = 0;
        let target: Element | null = null;
        let hitTest = false;
        let lastX = Number.NaN;
        let lastY = Number.NaN;
        node.dataset.enabled = 'true';

        const hide = () => {
          pressed = dragging = false;
          if (!visible) return;
          visible = false;
          document.documentElement.classList.remove('sv-cursor-enabled');
          gsap.to(node, { opacity: 0, duration: 0.15, overwrite: true });
        };
        const updateState = (target: Element) => {
          const control = target.closest(
            'a,button,summary,[role="button"],[data-cursor],[data-draggable]',
          );
          const text = dragging
            ? 'DRAGGING ↔'
            : control?.getAttribute('data-cursor') ||
              (control?.hasAttribute('data-draggable') ? 'DRAG ↔' : '');
          const next = dragging ? 'dragging' : text ? 'label' : control ? 'interactive' : 'default';
          const key = `${next}:${text}:${pressed}`;
          if (state === key) return;
          state = key;
          node.dataset.state = next;
          label.textContent = text;
          size = text ? 78 / 44 : control ? 72 / 44 : 1;
          gsap.to(shape, {
            scale: size * (pressed ? 0.82 : 1),
            duration: 0.3,
            ease: 'power3.out',
            overwrite: true,
          });
          gsap.to(dot, { scale: text ? 0 : control ? 0.5 : 1, duration: 0.2, overwrite: 'auto' });
        };
        const showAt = (target: Element | null, x: number, y: number) => {
          if (
            !target ||
            target.closest(
              'input,textarea,select,option,iframe,[contenteditable]:not([contenteditable="false"]),button:disabled',
            )
          ) {
            hide();
            return;
          }
          if (!visible) {
            gsap.set(dot, { x, y });
            gsap.set(ring, { x, y });
            // Seed cached tweens at the entry point so they cannot resume from an old position.
            dotX(x, x); dotY(y, y);
            ringX(x, x); ringY(y, y);
            lastX = x;
            lastY = y;
            gsap.to(node, { opacity: 1, duration: 0.18, overwrite: true });
            document.documentElement.classList.add('sv-cursor-enabled');
            visible = true;
          }
          updateState(target);
          if (x !== lastX) { dotX(x); ringX(x); lastX = x; }
          if (y !== lastY) { dotY(y); ringY(y); lastY = y; }
        };
        const schedule = () => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            if (!pointer) return;
            if (hitTest) target = document.elementFromPoint(pointer.x, pointer.y);
            hitTest = false;
            showAt(target, pointer.x, pointer.y);
          });
        };
        const leave = () => {
          pointer = null;
          target = null;
          hitTest = false;
          cancelAnimationFrame(frame);
          frame = 0;
          hide();
        };
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') { leave(); return; }
          pointer = { x: event.clientX, y: event.clientY };
          target = event.target instanceof Element ? event.target : null;
          schedule();
        };
        const down = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse' || !visible || !(event.target instanceof Element))
            return;
          pressed = true;
          dragging = !!event.target.closest('[data-cursor-drag],[data-draggable]');
          updateState(event.target);
        };
        const up = (event: PointerEvent) => {
          pressed = dragging = false;
          if (event.target instanceof Element) updateState(event.target);
        };
        const visibility = () => {
          if (document.hidden) leave();
        };
        const key = (event: KeyboardEvent) => {
          if (event.key === 'Tab') leave();
        };
        const scroll = () => {
          if (!pointer) return;
          hitTest = true;
          schedule();
        };
        document.addEventListener('pointermove', move, { passive: true });
        document.addEventListener('pointerover', move, { passive: true });
        document.addEventListener('pointerdown', down, { passive: true });
        document.addEventListener('pointerup', up, { passive: true });
        document.addEventListener('pointercancel', leave);
        document.addEventListener('pointerleave', leave);
        document.addEventListener('visibilitychange', visibility);
        document.addEventListener('keydown', key);
        document.addEventListener('contextmenu', leave);
        window.addEventListener('blur', leave);
        window.addEventListener('scroll', scroll, { passive: true, capture: true });
        return () => {
          leave();
          node.dataset.enabled = 'false';
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerover', move);
          document.removeEventListener('pointerdown', down);
          document.removeEventListener('pointerup', up);
          document.removeEventListener('pointercancel', leave);
          document.removeEventListener('pointerleave', leave);
          document.removeEventListener('visibilitychange', visibility);
          document.removeEventListener('keydown', key);
          document.removeEventListener('contextmenu', leave);
          window.removeEventListener('blur', leave);
          window.removeEventListener('scroll', scroll, true);
          [dotX, dotY, ringX, ringY].forEach((quick) => quick.tween.kill());
          gsap.killTweensOf([node, dot, ring, shape]);
          gsap.set(node, { opacity: 0 });
        };
      },
    );
    return () => media.revert();
  }, [route]);

  return (
    <div ref={root} className="sv-custom-cursor" aria-hidden="true">
      <div className="sv-cursor-ring">
        <div className="sv-cursor-shape" />
        <span className="sv-cursor-label" />
      </div>
      <div className="sv-cursor-dot" />
    </div>
  );
}
