'use client';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
export function BackToTop() {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const onScroll = () => setShown(window.scrollY > 500);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const scrollTop = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.scrollTo(0, 0);
            return;
        }
        // Starts slowly and speeds up near the end, as requested.
        const duration = Math.min(2.1, Math.max(0.85, window.scrollY / 1800));
        gsap.to(window, {
            duration,
            ease: 'power3.in',
            scrollTo: { y: 0, autoKill: true },
            overwrite: 'auto',
        });
    };
    return (
        <button
            type="button"
            onClick={scrollTop}
            className={`sv-top ${shown ? 'is-shown' : ''}`}
            aria-label="Scroll to top"
        >
            <ArrowUp size={21} />
        </button>
    );
}
