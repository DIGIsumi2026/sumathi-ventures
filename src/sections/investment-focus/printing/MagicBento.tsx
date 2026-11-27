'use client';

import { useInView } from 'motion/react';
import { useRef, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from 'react';

import '@/styles/investment-focus/printing/MagicBento.css';

type MagicBentoProps = {
  items: { id: string; content: ReactNode; fullWidth?: boolean }[];
  columns: number;
  rowHeight: number;
  gap: number;
  radius: number;
  enableBorderGlow: boolean;
  enableSpotlight: boolean;
  spotlightRadius: number;
  clickEffect: boolean;
};

export default function MagicBento({
  items,
  columns,
  rowHeight,
  gap,
  radius,
  enableBorderGlow,
  enableSpotlight,
  spotlightRadius,
  clickEffect,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 'some' });

  function moveSpotlight(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return;

    const grid = event.currentTarget;
    const { clientX, clientY } = event;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.magic-bento__card'));
    const bounds = cards.map(card => card.getBoundingClientRect());

    cards.forEach((card, index) => {
      card.style.setProperty('--mb-x', `${clientX - bounds[index].left}px`);
      card.style.setProperty('--mb-y', `${clientY - bounds[index].top}px`);
    });

    grid.dataset.spotActive = 'true';
  }

  function clearSpotlight(event: PointerEvent<HTMLDivElement>) {
    delete event.currentTarget.dataset.spotActive;
  }

  function ripple(event: MouseEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!(event.target instanceof Element) || !event.target.closest('.magic-bento__card')) return;

    const { clientX, clientY } = event;
    const grid = event.currentTarget.getBoundingClientRect();
    const reach = Math.hypot(
      Math.max(clientX - grid.left, grid.right - clientX),
      Math.max(clientY - grid.top, grid.bottom - clientY),
    );
    const waves = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('.magic-bento__wave'));
    const bounds = waves.map(wave => wave.parentElement!.getBoundingClientRect());

    waves.forEach((wave, index) => {
      wave.getAnimations().forEach(animation => animation.cancel());
      const x = clientX - bounds[index].left;
      const y = clientY - bounds[index].top;
      wave.animate(
        [
          { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0.75 },
          { transform: `translate(${x}px, ${y}px) scale(${reach / 50 + 1})`, opacity: 0 },
        ],
        { duration: 900, easing: 'ease-out' },
      );
    });
  }

  return (
    <div className="magic-bento">
      <div
        ref={gridRef}
        className="magic-bento__grid"
        data-in-view={inView}
        data-border-glow={enableBorderGlow}
        data-spotlight={enableSpotlight}
        onPointerMove={enableBorderGlow || enableSpotlight ? moveSpotlight : undefined}
        onPointerLeave={clearSpotlight}
        onClick={clickEffect ? ripple : undefined}
        style={{
          '--mb-columns': columns,
          '--mb-row-height': `${rowHeight}px`,
          '--mb-gap': `${gap}px`,
          '--mb-radius': `${radius}px`,
          '--mb-spot-size': `${spotlightRadius}px`,
        } as CSSProperties}
      >
        {items.map(({ id, content, fullWidth }, index) => (
          <div
            key={id}
            className="magic-bento__card"
            data-full-width={fullWidth}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="magic-bento__content">{content}</div>
            {clickEffect && <div className="magic-bento__wave" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}
