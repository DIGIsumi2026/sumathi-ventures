'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { imageAssets } from '@/assets/imageAssets';
import { videoAssets } from '@/assets/videoAssets';

export function AboutHero() {
  const [videoEnded, setVideoEnded] = useState(false);
  const reduceMotion = useReducedMotion();
  const [videoAllowed, setVideoAllowed] = useState<boolean | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const showFinal = videoAllowed !== true || videoEnded;
  const showVideo = videoAllowed === true && !videoEnded;
  const skipEntrance = reduceMotion || videoAllowed === null;

  useEffect(() => {
    const media = window.matchMedia(
      '(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const update = () => setVideoAllowed(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!showVideo || !video.current) return;
    const player = video.current;
    let active = true;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const clearFallback = () => {
      clearTimeout(fallback);
      fallback = undefined;
    };
    const showThumbnail = () => {
      if (active) setVideoEnded(true);
    };
    const waitForPlayback = () => {
      if (fallback !== undefined) return;
      // A stalled intro must not keep the page content hidden indefinitely.
      fallback = setTimeout(showThumbnail, 8000);
    };
    player.addEventListener('playing', clearFallback);
    player.addEventListener('waiting', waitForPlayback);
    player.addEventListener('stalled', waitForPlayback);
    waitForPlayback();
    player.play().then(clearFallback, showThumbnail);
    return () => {
      active = false;
      clearFallback();
      player.removeEventListener('playing', clearFallback);
      player.removeEventListener('waiting', waitForPlayback);
      player.removeEventListener('stalled', waitForPlayback);
    };
  }, [showVideo]);

  return (
    <section className="sv-about-hero" aria-labelledby="sv-about-hero-title">
      <div className="sv-about-hero__media">
        {showVideo && (
          <motion.video
            ref={video}
            className="sv-about-hero__video"
            src={videoAssets.logoReveal}
            poster={imageAssets.about.heroFinal}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setVideoEnded(true)}
            onError={() => setVideoEnded(true)}
            aria-hidden="true"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        <motion.div
          className="sv-about-hero__final"
          initial={false}
          animate={{
            opacity: 1,
            scale: showFinal ? 1 : 1.025,
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
            fetchPriority="high"
          />
        </motion.div>
      </div>

      <div
        className={`sv-about-hero__overlay ${showFinal ? 'is-visible' : ''}`}
        aria-hidden="true"
      />

      <div className="container sv-about-hero__inner">
        <AnimatePresence>
          {showFinal && (
            <motion.div
              className="sv-about-hero__content"
              initial={
                skipEntrance
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
                  skipEntrance
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
                  duration: 0.55,
                  delay: reduceMotion ? 0 : 0.35,
                }}
              >
                ABOUT SUMATHI VENTURES
              </motion.span>

              <motion.h1
                id="sv-about-hero-title"
                initial={
                  skipEntrance
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
                  duration: 0.75,
                  delay: reduceMotion ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Building Strategic Ventures.
                <br />
                Creating Lasting Value.
              </motion.h1>

              <motion.p
                initial={
                  skipEntrance
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
                  duration: 0.7,
                  delay: reduceMotion ? 0 : 0.6,
                }}
              >
                Bringing together opportunity, partnerships and long-term thinking to build ventures
                positioned for sustainable growth.
              </motion.p>

              <motion.div
                className="sv-about-hero__line"
                initial={skipEntrance ? false : { scaleX: 0 }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 0.9,
                  delay: reduceMotion ? 0 : 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sv-about-hero__scroll" aria-hidden="true">
        <span>SCROLL</span>
        <span className="sv-about-hero__scroll-line" />
      </div>
    </section>
  );
}
