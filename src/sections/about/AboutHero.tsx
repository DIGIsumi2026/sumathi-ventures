'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { imageAssets } from '@/assets/imageAssets';
import { videoAssets } from '@/assets/videoAssets';

export function AboutHero() {
  const [videoEnded, setVideoEnded] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="sv-about-hero"
      aria-labelledby="sv-about-hero-title"
    >
      <div className="sv-about-hero__media">

        {!videoEnded && !reduceMotion && (
          <motion.video
            className="sv-about-hero__video"
            src={videoAssets.logoReveal}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setVideoEnded(true)}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        <AnimatePresence>
          {(videoEnded || reduceMotion) && (
            <motion.div
              className="sv-about-hero__final"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, scale: 1.025 }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                opacity: {
                  duration: reduceMotion ? 0 : 0.65,
                  ease: [0.22, 1, 0.36, 1],
                },

                scale: {
                  duration: reduceMotion ? 0 : 1.8,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              <img
                src={imageAssets.about.heroFinal}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div
        className={`sv-about-hero__overlay ${
          videoEnded || reduceMotion
            ? 'is-visible'
            : ''
        }`}
        aria-hidden="true"
      />

      <div className="container sv-about-hero__inner">

        <AnimatePresence>
          {(videoEnded || reduceMotion) && (
            <motion.div
              className="sv-about-hero__content"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -40,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.85,
                delay: reduceMotion ? 0 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.span
                className="sv-about-hero__eyebrow"
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 12,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: .55,
                  delay: reduceMotion ? 0 : .35,
                }}
              >
                ABOUT SUMATHI VENTURES
              </motion.span>

              <motion.h1
                id="sv-about-hero-title"
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 25,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: .75,
                  delay: reduceMotion ? 0 : .45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Building Strategic Ventures.
                <br />
                Creating Lasting Value.
              </motion.h1>

              <motion.p
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 20,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: .7,
                  delay: reduceMotion ? 0 : .6,
                }}
              >
                Bringing together opportunity, partnerships and
                long-term thinking to build ventures positioned
                for sustainable growth.
              </motion.p>

              <motion.div
                className="sv-about-hero__line"
                initial={
                  reduceMotion
                    ? false
                    : { scaleX: 0 }
                }
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  duration: .9,
                  delay: reduceMotion ? 0 : .7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div
        className="sv-about-hero__scroll"
        aria-hidden="true"
      >
        <span>SCROLL</span>
        <span className="sv-about-hero__scroll-line" />
      </div>
    </section>
  );
}
