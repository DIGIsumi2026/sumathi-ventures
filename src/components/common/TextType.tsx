'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSectionEntered } from '@/hooks/useSectionEntered';
import '@/styles/common/text-type.css';

type TextTypeProps = {
  text: string;
  typingSpeed?: number;
  initialDelay?: number;
  showCursor?: boolean;
  cursorGlide?: boolean;
  cursorColor?: string;
  cursorBlinkDuration?: number;
  className?: string;
};

// Type once when the containing section first becomes visible.
export default function TextType({
  text,
  typingSpeed = 75,
  initialDelay = 0,
  showCursor = true,
  cursorGlide = true,
  cursorColor = 'currentColor',
  cursorBlinkDuration = 0.5,
  className = '',
}: TextTypeProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progress, setProgress] = useState({ text, count: 0 });
  const container = useRef<HTMLSpanElement>(null);
  const entered = useSectionEntered(container);
  const characters = useRef<(HTMLSpanElement | null)[]>([]);
  const cursor = useRef<HTMLSpanElement>(null);
  const blink = useRef<HTMLSpanElement>(null);
  const blinkTimeline = useRef<gsap.core.Timeline | null>(null);
  const blinkResume = useRef<gsap.core.Tween | null>(null);
  const previousPosition = useRef<{ x: number; y: number } | null>(null);
  const placeCursor = useRef<(instant: boolean) => void>(() => {});
  const chars = useMemo(() => {
    if (typeof Intl.Segmenter !== 'undefined') {
      return Array.from(
        new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text),
        (part) => part.segment,
      );
    }
    return Array.from(text);
  }, [text]);
  const count = reduceMotion
    ? chars.length
    : Math.min(progress.text === text ? progress.count : 0, chars.length);
  const cursorVisible = showCursor && entered && count < chars.length && !reduceMotion;

  useEffect(() => {
    // Keep the server and first client render identical, then apply the preference.
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (progress.text === text && progress.count >= chars.length) return;
    if (reduceMotion) {
      setProgress({ text, count: chars.length });
      return;
    }
    if (!entered) return;
    const timeout = setTimeout(
      () => setProgress({ text, count: count + 1 }),
      Math.max(0, typingSpeed) + (count === 0 ? Math.max(0, initialDelay) : 0),
    );
    return () => clearTimeout(timeout);
  }, [text, chars.length, count, progress, typingSpeed, initialDelay, reduceMotion, entered]);

  useEffect(() => {
    const node = blink.current;
    if (!cursorVisible || !node) return;
    gsap.set(node, { opacity: 1 });
    if (reduceMotion || cursorBlinkDuration <= 0) return;
    const hold = cursorBlinkDuration * 0.7;
    const fade = cursorBlinkDuration * 0.45;
    const timeline = gsap.timeline({ repeat: -1 });
    timeline
      .to(node, { opacity: 0, duration: fade, ease: 'sine.inOut' }, hold)
      .to(
        node,
        { opacity: 1, duration: fade, ease: 'sine.inOut' },
        hold + fade + cursorBlinkDuration * 0.4,
      );
    blinkTimeline.current = timeline;
    return () => {
      timeline.kill();
      blinkResume.current?.kill();
      gsap.killTweensOf(node);
      blinkTimeline.current = null;
    };
  }, [cursorVisible, cursorBlinkDuration, reduceMotion]);

  const positionCursor = useCallback(
    (instant: boolean) => {
      const node = cursor.current;
      // All letters keep their final layout, including the letters still to be revealed.
      const next = characters.current[count];
      const last = characters.current[count - 1];
      if (!node || (!next && !last)) return;
      const x = next ? next.offsetLeft : last!.offsetLeft + last!.offsetWidth;
      const y = (next || last)!.offsetTop;
      const previous = previousPosition.current;
      if (previous && Math.abs(previous.x - x) < 0.5 && Math.abs(previous.y - y) < 0.5) return;
      previousPosition.current = { x, y };
      if (instant || !previous || !cursorGlide || reduceMotion || Math.abs(previous.y - y) > 1) {
        gsap.killTweensOf(node);
        gsap.set(node, { x, y });
      } else {
        gsap.to(node, {
          x,
          y,
          duration: Math.min(0.18, Math.max(0.06, typingSpeed * 0.0016)),
          ease: 'power3.out',
          overwrite: true,
        });
      }
      const timeline = blinkTimeline.current;
      if (!instant && timeline && blink.current) {
        timeline.pause();
        blinkResume.current?.kill();
        gsap.to(blink.current, { opacity: 1, duration: 0.12, overwrite: true });
        blinkResume.current = gsap.delayedCall(0.12, () => timeline.restart());
      }
    },
    [count, cursorGlide, reduceMotion, typingSpeed],
  );

  useLayoutEffect(() => {
    if (!cursorVisible) previousPosition.current = null;
    placeCursor.current = positionCursor;
    positionCursor(false);
  }, [positionCursor, cursorVisible]);

  useEffect(() => {
    const node = container.current;
    const cursorNode = cursor.current;
    if (!node || !cursorNode) return;
    let active = true;
    const observer = new ResizeObserver(() => placeCursor.current(true));
    observer.observe(node);
    document.fonts.ready.then(() => {
      if (active) placeCursor.current(true);
    });
    return () => {
      active = false;
      observer.disconnect();
      if (cursorNode) gsap.killTweensOf(cursorNode);
    };
  }, [cursorVisible]);

  return (
    <span ref={container} className={`text-type ${className}`}>
      <span className="text-type__sr">{text}</span>
      <span className="text-type__content" aria-hidden="true">
        {chars.map((char, index) => (
          <span
            key={`${text}-${index}`}
            ref={(node) => {
              characters.current[index] = node;
            }}
            className={`text-type__char${index >= count ? ' text-type__char--pending' : ''}`}
          >
            {char}
          </span>
        ))}
      </span>
      {cursorVisible && (
        <span
          ref={cursor}
          className="text-type__cursor text-type__cursor--underscore"
          aria-hidden="true"
          style={{ color: cursorColor }}
        >
          <span ref={blink} className="text-type__blink">
            <span className="text-type__shape" />
          </span>
        </span>
      )}
    </span>
  );
}
