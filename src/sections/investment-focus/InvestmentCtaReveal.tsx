'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, type ReactNode } from 'react';

import StrokeText from '@/components/common/StrokeText';

type InvestmentCtaRevealProps = {
  className?: string;
  headingId: string;
  heading: string;
  lineBreakAfter?: number;
  children: ReactNode;
};

export function InvestmentCtaReveal({
  className,
  headingId,
  heading,
  lineBreakAfter,
  children,
}: InvestmentCtaRevealProps) {
  const reduced = useReducedMotion();
  const content = useRef<HTMLDivElement>(null);
  const viewport = { once: true, amount: .35 } as const;
  const entered = useInView(content, viewport);

  return (
    <motion.div
      ref={content}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: reduced ? 0 : .8, ease: [.22, 1, .36, 1] }}
    >
      <h2 id={headingId}>
        <StrokeText text={heading} fontWeight={600} lineBreakAfter={lineBreakAfter} active={entered} />
      </h2>
      {children}
    </motion.div>
  );
}
