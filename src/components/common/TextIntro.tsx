'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
export function TextIntro({ words }: { words: string }) {
    const root = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const parts = root.current.querySelectorAll('.sv-word');
        // Anime.js V4: discreet headline word stagger.
        const animation = animate(parts, {
            opacity: [0, 1],
            y: [26, 0],
            delay: stagger(95),
            duration: 800,
            ease: 'out(3)',
        });
        return () => {
            animation.revert();
        };
    }, [words]);
    return (
        <span ref={root} className="sv-intro-words">
            {words.split(' ').map((word, i) => (
                <span className="sv-word-outer" key={i}>
                    <span className="sv-word">{word}</span>{' '}
                </span>
            ))}
        </span>
    );
}
