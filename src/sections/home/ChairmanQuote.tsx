'use client';

import { motion, useReducedMotion } from 'motion/react';
import { imageAssets } from '@/assets/imageAssets';

export function ChairmanQuote() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="sv-chairman-quote"
      aria-labelledby="chairman-quote-title"
    >
      <div className="sv-chairman-quote__media">
        <img
          src={imageAssets.quote}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </div>

      <div
        className="sv-chairman-quote__overlay"
        aria-hidden="true"
      />

      <div className="container sv-chairman-quote__inner">
        <motion.div
          className="sv-chairman-quote__content"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 40,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span
            className="sv-chairman-quote__mark"
            aria-hidden="true"
          >
            “
          </span>

          <blockquote>
            <h2 id="chairman-quote-title">
              Our Goal is to become Globally Present,
              Regionally Strong, Sri Lankan based leader
              in Ventures.
            </h2>

            <footer>
              <span className="sv-chairman-quote__line" />

              <div>
                <strong>Thilanga Sumathipala</strong>

                <span>
                  Chairman of Sumathi Ventures
                </span>
              </div>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}