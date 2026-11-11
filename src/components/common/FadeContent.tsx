'use client';

import { useLayoutEffect, useRef, type HTMLAttributes } from 'react';
import { gsap } from 'gsap';

const SVG_NS = 'http://www.w3.org/2000/svg';
const LEVELS = Array.from(
  { length: 33 },
  (_, index) => 1 / (1 + Math.exp(-10.8 * (index / 32 - 0.5))),
);
let maskCount = 0;

function createMist(target: HTMLElement) {
  const originalFilter = target.style.filter;
  const originalVisibility = target.style.visibility;
  const box = target.getBoundingClientRect();
  const size = Math.sqrt(Math.max(box.width * box.height, 1));
  const node = (name: string, attributes: Record<string, string | number>, parent: Element) => {
    const child = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => child.setAttribute(key, String(value)));
    parent.appendChild(child);
    return child;
  };
  const svg = node('svg', { width: 0, height: 0, 'aria-hidden': 'true' }, document.body);
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const id = `sv-fade-mist-${++maskCount}`;
  const filter = node(
    'filter',
    {
      id,
      x: '-10%',
      y: '-10%',
      width: '120%',
      height: '120%',
      'color-interpolation-filters': 'sRGB',
    },
    svg,
  );
  node(
    'feTurbulence',
    {
      type: 'fractalNoise',
      baseFrequency: Math.min(Math.max(4 / size, 0.004), 0.02),
      numOctaves: 3,
      seed: Math.floor(Math.random() * 1000),
      result: 'noise',
    },
    filter,
  );
  node(
    'feColorMatrix',
    { in: 'noise', type: 'matrix', values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.43 0 0 0 -0.21' },
    filter,
  );
  const curve = node(
    'feFuncA',
    { type: 'table' },
    node('feComponentTransfer', { result: 'mask' }, filter),
  );
  node('feComposite', { in: 'SourceGraphic', in2: 'mask', operator: 'in' }, filter);
  const state = { progress: 0 };
  let drawn = -1;
  const render = () => {
    const progress = state.progress;
    if (progress === drawn) return;
    drawn = progress;
    if (progress >= 1) {
      target.style.filter = originalFilter;
      target.style.visibility = originalVisibility;
      return;
    }
    const front = progress * 1.7 - 0.35;
    curve.setAttribute(
      'tableValues',
      LEVELS.map((level) => {
        const t = Math.min(Math.max((level - front + 0.35) / 0.7, 0), 1);
        return (1 - t * t * (3 - 2 * t)).toFixed(3);
      }).join(' '),
    );
    target.style.filter = `url(#${id}) blur(${(10 * (1 - progress)).toFixed(2)}px)`;
    target.style.visibility = progress <= 0 ? 'hidden' : originalVisibility || 'inherit';
  };
  render();
  return {
    state,
    render,
    remove: () => {
      svg.remove();
      target.style.filter = originalFilter;
      target.style.visibility = originalVisibility;
    },
  };
}

type Props = HTMLAttributes<HTMLDivElement> & {
  effect?: 'mist';
  duration?: number;
  ease?: string;
  stagger?: number;
  threshold?: number;
};

export default function FadeContent({
  children,
  effect = 'mist',
  duration = 1.8,
  ease = 'power2.out',
  stagger = 0.1,
  threshold = 0.1,
  ...props
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const completed = useRef(false);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add(
      {
        reduced: '(prefers-reduced-motion: reduce)',
        normal: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        if (context.conditions?.reduced) {
          completed.current = true;
          return;
        }
        if (completed.current) return;
        const targets =
          stagger > 0 && element.children.length
            ? (Array.from(element.children) as HTMLElement[])
            : [element];
        const masks = targets.map(createMist);
        const timeline = gsap
          .timeline({
            paused: true,
            onComplete: () => {
              completed.current = true;
              masks.forEach((mask) => mask.remove());
            },
          })
          .to(
            masks.map((mask) => mask.state),
            {
              progress: 1,
              duration,
              ease,
              stagger,
              onUpdate: () => masks.forEach((mask) => mask.render()),
            },
          );
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            timeline.play();
            observer.disconnect();
          },
          { threshold: Math.min(Math.max(threshold, 0), 1) },
        );
        observer.observe(element);
        return () => {
          observer.disconnect();
          timeline.kill();
          masks.forEach((mask) => mask.remove());
        };
      },
    );
    return () => media.revert();
  }, [effect, duration, ease, stagger, threshold]);

  // Server-rendered content remains readable if JavaScript is unavailable.
  return (
    <div ref={root} {...props}>
      {children}
    </div>
  );
}
