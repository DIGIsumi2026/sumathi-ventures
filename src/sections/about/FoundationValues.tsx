'use client';

import { motion, useReducedMotion } from 'motion/react';
import { imageAssets } from '@/assets/imageAssets';

export function FoundationValues() {
  const reduced = useReducedMotion();

  return (
    <section
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
          initial={reduced ? false : { opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:.35 }}
          transition={{
            duration:reduced ? 0 : .8,
            ease:[.22,1,.36,1],
          }}
        >

          <h2 id="sv-foundation-values-title">
            Our Foundation of Values
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