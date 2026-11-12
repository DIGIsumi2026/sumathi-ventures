'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { imageAssets } from '@/assets/imageAssets';
import TrueFocus from '@/components/common/TrueFocus';

export function FoundationValues() {
  const section = useRef<HTMLElement>(null);
  const active = useInView(section, { amount: 0.15, margin: '-80px 0px 0px 0px' });
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <section
      ref={section}
      className="sv-foundation-values"
      aria-labelledby="sv-foundation-values-title"
    >
      <div className="sv-foundation-values__media" aria-hidden="true">
        <img
          src={imageAssets.about.foundationValues}
          alt=""
          draggable={false}
        />
      </div>

      <div className="sv-foundation-values__overlay" aria-hidden="true" />

      <div className="container sv-foundation-values__inner">
        <motion.div
          className="sv-foundation-values__content"
          initial={false}
          animate={!hydrated || active || reduced ? { opacity:1, y:0 } : { opacity:0, y:30 }}
          transition={{
            duration:reduced ? 0 : .8,
            ease:[.22,1,.36,1],
          }}
        >

          <h2 id="sv-foundation-values-title">
            <TrueFocus
              active={active}
              sentence="Foundation Values"
              manualMode={false}
              focusStyle="brackets"
              easing="smooth"
              order="sequential"
              blurAmount={5}
              focusScale={1}
              unfocusedOpacity={1}
              borderColor="#27ff6f"
              cornerSize={16}
              borderWidth={3}
              animationDuration={0.5}
              pauseBetweenAnimations={1}
              highlightColor="#27ff6f"
            />
          </h2>

          <p>
            We are a trusted entity driven by a solid foundation of unity and
            integrity. The three pillars on the logo stand strong to represent
            three siblings, who currently lead the business towards excellence.
            The brand also incorporates the teaching of Dhamma: principles
            which the company places in high regard and treats as the ultimate
            guiding light.
          </p>

          <span
            className="sv-foundation-values__line"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
