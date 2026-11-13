'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { imageAssets } from '@/assets/imageAssets';
import { videoAssets } from '@/assets/videoAssets';

export function InvestmentFocusHero() {
  const reduced = useReducedMotion();
  const [videoAllowed, setVideoAllowed] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const showVideo = videoAllowed && !videoFinished;

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
    const player = video.current;
    if (!showVideo || !player) return;
    let active = true;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const clearFallback = () => {
      clearTimeout(fallback);
      fallback = undefined;
    };
    const showThumbnail = () => {
      if (active) setVideoFinished(true);
    };
    const waitForPlayback = () => {
      if (fallback === undefined) fallback = setTimeout(showThumbnail, 8000);
    };
    player.addEventListener('playing', clearFallback);
    player.addEventListener('waiting', waitForPlayback);
    player.addEventListener('stalled', waitForPlayback);
    waitForPlayback();
    player.play().then(clearFallback, showThumbnail);
    return () => {
      active = false;
      clearFallback();
      player.pause();
      player.removeEventListener('playing', clearFallback);
      player.removeEventListener('waiting', waitForPlayback);
      player.removeEventListener('stalled', waitForPlayback);
    };
  }, [showVideo]);

  return (
    <section
      className="sv-investment-hero"
      aria-labelledby="sv-investment-hero-title"
      data-page-hero
    >
      <div
        className="sv-investment-hero__responsive-media"
        aria-hidden="true"
      >
        <picture>
          <source
            media="(max-width:700px)"
            srcSet={imageAssets.investmentFocus.heroMobilePoster}
          />

          <img
            src={imageAssets.investmentFocus.heroTabletPoster}
            alt=""
            draggable={false}
            fetchPriority="high"
          />
        </picture>
      </div>

      <AnimatePresence>
        {showVideo && (
        <motion.div
          key="investment-hero-video"
          className="sv-investment-hero__desktop-media"
          aria-hidden="true"
          initial={false}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:reduced ? 0 : .75, ease:[.22,1,.36,1] }}
        >
          <video
            ref={video}
            className="sv-investment-hero__video"
            src={videoAssets.investmentFocus.hero}
            poster={imageAssets.investmentFocus.heroTabletPoster}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onEnded={() => setVideoFinished(true)}
            onError={() => setVideoFinished(true)}
          />
        </motion.div>
        )}
      </AnimatePresence>

      <div
        className="sv-investment-hero__overlay"
        aria-hidden="true"
      />

      <div className="container sv-investment-hero__inner">
        <motion.div
          className="sv-investment-hero__content"
          initial={false}
          animate={{ opacity:1, y:0 }}
          transition={{
            duration:reduced ? 0 : .9,
            ease:[.22,1,.36,1],
          }}
        >

          <h1 id="sv-investment-hero-title">
            Investing Across Industries
            <br />
            Building Long Term Value
          </h1>

          <p>
            From sustainable industry and engineering to technology,
            printing, business and entertainment, we pursue strategic
            opportunities built around partnership, execution and
            long term growth.
          </p>

          <a
            href="#investment-fields"
            className="sv-investment-hero__explore"
          >
            <span>EXPLORE OUR FOCUS</span>

            <span
              className="sv-investment-hero__explore-line"
              aria-hidden="true"
            />
          </a>
        </motion.div>
      </div>

    </section>
  );
}
