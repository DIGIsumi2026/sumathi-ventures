'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';

import { imageAssets } from '@/assets/imageAssets';

const investmentFields = [
  {
    id: 'industry',
    title: 'Industry & Sustainable Development',
    image: imageAssets.investmentFields.industrySustainableDevelopment,
    href: '/investment-fields/industry-sustainable-development/',
  },

  {
    id: 'printing',
    title: 'Printing',
    image: imageAssets.investmentFields.industryPrinting,
    href: '/investment-fields/printing/',
  },

  {
    id: 'business',
    title: 'Business',
    image: imageAssets.investmentFields.industryBusiness,
    href: '/investment-fields/business/',
  },

  {
    id: 'entertainment',
    title: 'Entertainment',
    image: imageAssets.investmentFields.industryEntertainment,
    href: '/investment-fields/entertainment/',
  },

  {
    id: 'technology',
    title: 'Technology',
    image: imageAssets.investmentFields.industryTechnology,
    href: '/investment-fields/technology/',
  },

  {
    id: 'engineering',
    title: 'Engineering',
    image: imageAssets.investmentFields.industryEngineering,
    href: '/investment-fields/engineering/',
  },
] as const;

export function InvestmentFieldsCarousel() {
  const autoScroll = useMemo(
    () =>
      AutoScroll({
        direction: 'forward',
        speed: 50 / 60,
        startDelay: 0,
        playOnInit: false,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        breakpoints: {
          '(hover: none)': { stopOnMouseEnter: false },
          '(prefers-reduced-motion: reduce)': { active: false },
        },
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: 'start',
      containScroll: false,
      duration: 34,
    },
    [autoScroll],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const viewport = emblaApi.rootNode();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hover = window.matchMedia('(hover: hover)');
    let inView = false;
    const updatePlayback = () => {
      if (
        motion.matches ||
        document.hidden ||
        !inView ||
        (hover.matches && viewport.matches(':hover')) ||
        viewport.contains(document.activeElement)
      ) {
        autoScroll.stop();
      } else {
        autoScroll.play(0);
      }
    };
    const afterFocusChange = () => queueMicrotask(updatePlayback);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        updatePlayback();
      },
      { threshold: 0.1 },
    );
    observer.observe(viewport);
    document.addEventListener('visibilitychange', updatePlayback);
    motion.addEventListener('change', updatePlayback);
    viewport.addEventListener('mouseenter', updatePlayback);
    viewport.addEventListener('mouseleave', updatePlayback);
    viewport.addEventListener('focusin', updatePlayback);
    viewport.addEventListener('focusout', afterFocusChange);
    emblaApi.on('reInit', updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updatePlayback);
      motion.removeEventListener('change', updatePlayback);
      viewport.removeEventListener('mouseenter', updatePlayback);
      viewport.removeEventListener('mouseleave', updatePlayback);
      viewport.removeEventListener('focusin', updatePlayback);
      viewport.removeEventListener('focusout', afterFocusChange);
      emblaApi.off('reInit', updatePlayback);
      autoScroll.stop();
    };
  }, [emblaApi, autoScroll]);

  return (
    <section
      className="sv-investment-fields"
      id="investment-fields"
      aria-labelledby="investment-fields-title"
    >
      <div className="container sv-investment-fields__heading">
        <div>
          <p className="sv-overline">OUR INVESTMENT FIELDS</p>

          <h2 id="investment-fields-title">
            Investing Across Industries That
            <br />
            Shape Tomorrow.
          </h2>
        </div>

        <p className="sv-investment-fields__intro">
          Our investment interests span industries where strategic partnerships, technology and
          long-term thinking can create lasting commercial value.
        </p>
      </div>

      <div
        className="sv-investment-carousel"
        ref={emblaRef}
        aria-label="Sumathi Ventures investment fields"
      >
        <div className="sv-investment-carousel__track">
          {investmentFields.map((field) => (
            <article className="sv-investment-card" key={field.id}>
              {/* Background image */}

              <div className="sv-investment-card__media">
                <img
                  src={field.image}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  decoding="async"
                />
              </div>

              {/* Gradient overlays */}

              <div className="sv-investment-card__shade" aria-hidden="true" />

              {/* Content */}

              <div className="sv-investment-card__content">
                <h3>{field.title}</h3>

                <Link
                  href={field.href}
                  className="sv-investment-card__button"
                  aria-label={`Explore ${field.title}`}
                >
                  <span>Explore Field</span>

                  <span className="sv-investment-card__button-icon">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
