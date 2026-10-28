'use client';

import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {ArrowLeft,ArrowRight,ArrowUpRight} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { imageAssets } from '@/assets/imageAssets';

const AUTOPLAY_DELAY = 6500;

const heroSlides = [
  {
    id: 1,
    image: imageAssets.hero.boardroom,
    eyebrow: 'STRATEGIC VENTURES',
    title: 'Building Partnerships. Creating Lasting Value.',
    description:
      'We connect strategic expertise, capital and market opportunities to build ventures designed for sustainable, long-term growth.',
    primaryLabel: 'Explore Our Focus',
    primaryHref: '/investment-focus/',
  },

  {
    id: 2,
    image: imageAssets.hero.renewableEnergy,
    eyebrow: 'SUSTAINABLE INDUSTRY',
    title: 'Powering Sustainable Growth.',
    description:
      'Advancing renewable energy, responsible industry and future-focused development through strategic investment and collaboration.',
    primaryLabel: 'Explore Industry',
    primaryHref: '/investment-focus/industry/',
  },

  {
    id: 3,
    image: imageAssets.hero.technology,
    eyebrow: 'TECHNOLOGY & INNOVATION',
    title: 'Technology That Moves Business Forward.',
    description:
      'Supporting smarter and more secure enterprises through technology-led transformation, digital capability and strategic solutions.',
    primaryLabel: 'Explore Technology',
    primaryHref: '/investment-focus/technology/',
  },

  {
    id: 4,
    image: imageAssets.hero.agriculture,
    eyebrow: 'AGRICULTURE & AGRIBUSINESS',
    title: 'Growing Opportunity From the Ground Up.',
    description:
      'Developing agricultural value chains through responsible investment, modern practices and partnerships built for long-term value.',
    primaryLabel: 'Explore Industry',
    primaryHref: '/investment-focus/industry/',
  },

  {
    id: 5,
    image: imageAssets.hero.portLogistics,
    eyebrow: 'COMMERCE & INFRASTRUCTURE',
    title: 'Connecting Sri Lanka to Global Commerce.',
    description:
      'Creating opportunities across trade, logistics and infrastructure that connect businesses with regional and global markets.',
    primaryLabel: 'Explore Commerce',
    primaryHref: '/investment-focus/commerce/',
  },
] as const;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const activeSlide = heroSlides[activeIndex];
  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  };

  const previousSlide = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (isPaused || reduceMotion) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex(
        (current) => (current + 1) % heroSlides.length,
      );
    }, AUTOPLAY_DELAY);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeIndex, isPaused, reduceMotion]);

  return (
    <section
      className="sv-hero sv-hero-carousel"
      id="top"
      aria-label="Sumathi Ventures"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* =========================================
          BACKGROUND IMAGE
      ========================================== */}

      <div className="sv-hero-carousel__media">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeSlide.id}
            className="sv-hero-carousel__image-wrap"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 0,
                    scale: 1.075,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              opacity: {
                duration: reduceMotion ? 0 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              },

              scale: {
                duration: reduceMotion
                  ? 0
                  : AUTOPLAY_DELAY / 1000 + 0.5,

                ease: 'linear',
              },
            }}
          >
            <img
              src={activeSlide.image}
              alt=""
              className="sv-hero-carousel__image"
              aria-hidden="true"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =========================================
          DARK GRADIENT FOR TEXT READABILITY
      ========================================== */}

      <div
        className="sv-hero-carousel__overlay"
        aria-hidden="true"
      />

      <div
        className="sv-hero-carousel__texture"
        aria-hidden="true"
      />

      {/* =========================================
          HERO CONTENT
      ========================================== */}

      <div className="container sv-hero-carousel__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${activeSlide.id}`}
            className="sv-hero-carousel__copy"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 32,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={
              reduceMotion
                ? undefined
                : {
                    opacity: 0,
                    y: -20,
                  }
            }
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Slide number */}

            <div className="sv-hero-carousel__meta">
              <span>
                {String(activeSlide.id).padStart(2, '0')}
              </span>

              <span className="sv-hero-carousel__meta-line" />

              <span>
                {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Eyebrow */}

            <motion.p
              className="sv-hero-carousel__eyebrow"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -20,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : 0.12,
              }}
            >
              {activeSlide.eyebrow}
            </motion.p>

            {/* Heading */}

            <motion.h1
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 35,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: reduceMotion ? 0 : 0.17,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {activeSlide.title}
            </motion.h1>

            {/* Description */}

            <motion.p
              className="sv-hero-carousel__description"
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
                duration: 0.65,
                delay: reduceMotion ? 0 : 0.27,
              }}
            >
              {activeSlide.description}
            </motion.p>

            {/* Actions */}

            <motion.div
              className="sv-hero-carousel__actions"
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
                duration: 0.6,
                delay: reduceMotion ? 0 : 0.36,
              }}
            >
              <AnimatedButton
                href={activeSlide.primaryHref}
              >
                {activeSlide.primaryLabel}
              </AnimatedButton>

              <Link
                href="/contact/"
                className="sv-hero-carousel__secondary"
              >
                <span>Partner With Us</span>

                <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =========================================
          BOTTOM CONTROLS
      ========================================== */}

      <div className="container sv-hero-carousel__footer">
        {/* Slide indicators */}

        <div
          className="sv-hero-carousel__pagination"
          aria-label="Hero slides"
        >
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={
                index === activeIndex
                  ? 'sv-hero-carousel__pagination-item is-active'
                  : 'sv-hero-carousel__pagination-item'
              }
              onClick={() => goToSlide(index)}
              aria-label={`Show hero slide ${index + 1}`}
              aria-current={
                index === activeIndex ? 'true' : undefined
              }
            >
              <span>
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="sv-hero-carousel__pagination-line">
                {index === activeIndex && !reduceMotion && (
                  <span
                    key={`${activeSlide.id}-progress`}
                    className="sv-hero-carousel__progress"
                    style={{
                      animationDuration: `${AUTOPLAY_DELAY}ms`,
                      animationPlayState: isPaused
                        ? 'paused'
                        : 'running',
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Arrow navigation */}

        <div className="sv-hero-carousel__navigation">
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous slide"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}