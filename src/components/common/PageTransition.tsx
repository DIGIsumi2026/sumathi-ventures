'use client';
import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
export function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const reduced = useReducedMotion();
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);
    return (
        // App Router owns page removal; waiting for an exit can strand its new content at opacity 0.
        <motion.div
            key={pathname}
            initial={reduced || !hydrated ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.33, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
