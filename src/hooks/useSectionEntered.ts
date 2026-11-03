'use client';

import { useEffect, useState, type RefObject } from 'react';

export function useSectionEntered(ref: RefObject<HTMLElement | null>) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element.closest('section') || element);
    return () => observer.disconnect();
  }, [ref]);
  return entered;
}
