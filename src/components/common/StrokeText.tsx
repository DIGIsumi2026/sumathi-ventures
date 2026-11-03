'use client';

import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSectionEntered } from '@/hooks/useSectionEntered';
import '@/styles/common/stroke-text.css';

type Props = {
  text: string;
  strokeColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  fontWeight?: number;
};

type Layout = {
  width: number;
  height: number;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  letters: { char: string; x: number; y: number }[];
};

// Measure the real heading's wrapped words so the SVG retains its responsive typography.
export default function StrokeText({
  text,
  strokeColor = '#0ada95',
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = 'power2.out',
  fontWeight = 800,
}: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const entered = useSectionEntered(root);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const baselines = useRef<(HTMLSpanElement | null)[]>([]);
  const wipe = useRef<SVGRectElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const wipeId = `stroke-wipe-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const words = useMemo(() => {
    let start = 0;
    return text.split(/\s+/).map((word) => {
      const chars = Array.from(word);
      const result = { chars, start };
      start += chars.length;
      return result;
    });
  }, [text]);

  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    let active = true;
    const measure = () => {
      if (!active) return;
      const font = getComputedStyle(node);
      setLayout({
        width: node.clientWidth,
        height: node.clientHeight,
        fontFamily: font.fontFamily,
        fontSize: font.fontSize,
        fontWeight: font.fontWeight,
        letters: words.flatMap((word, wordIndex) =>
          word.chars.map((char, index) => ({
            char,
            x: letters.current[word.start + index]?.offsetLeft || 0,
            y: baselines.current[wordIndex]?.offsetTop || 0,
          })),
        ),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    document.fonts.ready.then(measure);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [words, fontWeight]);

  const ready = layout !== null;
  useLayoutEffect(() => {
    const node = root.current;
    const clip = wipe.current;
    if (!node || !clip || !ready) return;
    const strokes = node.querySelectorAll('[data-stroke-char]');
    const motion = gsap.matchMedia();
    let finished = false;
    motion.add(
      {
        reduced: '(prefers-reduced-motion: reduce)',
        normal: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        if (context.conditions?.reduced || finished) {
          gsap.set(strokes, { strokeDashoffset: 0 });
          gsap.set(clip, { attr: { width: 1 } });
          finished = true;
          return;
        }
        gsap.set(strokes, { strokeDasharray: 900, strokeDashoffset: 900 });
        gsap.set(clip, { attr: { width: 0 } });
        if (!entered) return;
        gsap
          .timeline({
            onComplete: () => {
              finished = true;
            },
          })
          .to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger }, 0)
          .to(
            clip,
            {
              attr: { width: 1 },
              duration: Math.max(0.4, drawDuration * 0.5),
              ease: 'power2.inOut',
            },
            drawDuration + fillDelay,
          );
      },
    );
    return () => motion.revert();
  }, [ready, entered, text, drawDuration, fillDelay, stagger, ease]);

  return (
    <span ref={root} className="stroke-text" role="img" aria-label={text} style={{ fontWeight }}>
      <span className="stroke-text__layout" aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={wordIndex}>
            {wordIndex > 0 && ' '}
            <span className="stroke-text__word">
              {word.chars.map((char, index) => (
                <span
                  key={index}
                  ref={(node) => {
                    letters.current[word.start + index] = node;
                  }}
                >
                  {char}
                </span>
              ))}
              <span
                className="stroke-text__baseline"
                ref={(node) => {
                  baselines.current[wordIndex] = node;
                }}
              />
            </span>
          </span>
        ))}
      </span>
      {layout && (
        <svg
          className="stroke-text__svg"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          aria-hidden="true"
          style={{
            fontFamily: layout.fontFamily,
            fontSize: layout.fontSize,
            fontWeight: layout.fontWeight,
          }}
        >
          <defs>
            <clipPath id={wipeId} clipPathUnits="objectBoundingBox">
              <rect ref={wipe} x="0" y="0" width="0" height="1" />
            </clipPath>
          </defs>
          <text
            className="stroke-text__stroke"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={900}
            strokeDashoffset={900}
          >
            {layout.letters.map((letter, index) => (
              <tspan key={index} x={letter.x} y={letter.y} data-stroke-char>
                {letter.char}
              </tspan>
            ))}
          </text>
          <text className="stroke-text__fill" fill="currentColor" clipPath={`url(#${wipeId})`}>
            {layout.letters.map((letter, index) => (
              <tspan key={index} x={letter.x} y={letter.y}>
                {letter.char}
              </tspan>
            ))}
          </text>
        </svg>
      )}
    </span>
  );
}
