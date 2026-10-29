'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';

import { imageAssets } from '@/assets/imageAssets';

const investmentFields = [
  {
    id: 'industry',
    number: '01',
    title: 'Industry & Sustainable Development',
    image:
      imageAssets.investmentFields.industrySustainableDevelopment,
    href:'/investment-fields/industry-sustainable-development/',
  },

  {
    id: 'printing',
    number: '02',
    title: 'Printing',
    image: imageAssets.investmentFields.industryPrinting,
    href: '/investment-fields/printing/',
  },

  {
    id: 'business',
    number: '03',
    title: 'Business',
    image: imageAssets.investmentFields.industryBusiness,
    href: '/investment-fields/business/',
  },

  {
    id: 'entertainment',
    number: '04',
    title: 'Entertainment',
    image: imageAssets.investmentFields.industryEntertainment,
    href: '/investment-fields/entertainment/',
  },

  {
    id: 'technology',
    number: '05',
    title: 'Technology',
    image: imageAssets.investmentFields.industryTechnology,
    href: '/investment-fields/technology/',
  },

  {
    id: 'engineering',
    number: '06',
    title: 'Engineering',
    image: imageAssets.investmentFields.industryEngineering,
    href: '/investment-fields/engineering/',
  },
] as const;

export function InvestmentFieldsCarousel() {
  const reduceMotion = useReducedMotion();

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,

      /*
       * Matches the loose/free movement
       * visible in the reference recording.
       */
      dragFree: true,

      /*
       * We deliberately do not snap each
       * card into the center.
       */
      align: 'start',

      containScroll: false,

      /*
       * Gives drag movement a softer,
       * weightier finish.
       */
      duration: 34,
    },

    [
      AutoScroll({
        /*
         * Continuous horizontal movement
         * like courasel.mp4.
         */
        playOnInit: !reduceMotion,

        /*
         * Lower = slower.
         *
         * This gives a controlled,
         * premium continuous movement.
         */
        speed: 1.05,

        /*
         * Keep autoplay available after
         * the user drags the carousel.
         */
        stopOnInteraction: false,

        /*
         * Reference movement pauses while
         * the pointer interacts with cards.
         */
        stopOnMouseEnter: true,

        /*
         * Pause while keyboard users focus
         * on links/buttons.
         */
        stopOnFocusIn: true,
      }),
    ],
  );

  return (
    <section
      className="sv-investment-fields"
      id="investment-fields"
      aria-labelledby="investment-fields-title"
    >
      <div className="container sv-investment-fields__heading">
        <div>
          <p className="sv-overline">
            OUR INVESTMENT FIELDS
          </p>

          <h2 id="investment-fields-title">
            Investing Across Industries That
            <br />
            Shape Tomorrow.
          </h2>
        </div>

        <p className="sv-investment-fields__intro">
          Our investment interests span industries where
          strategic partnerships, technology and long-term
          thinking can create lasting commercial value.
        </p>
      </div>

      <div
        className="sv-investment-carousel"
        ref={emblaRef}
        aria-label="Sumathi Ventures investment fields"
      >
        <div className="sv-investment-carousel__track">
          {investmentFields.map((field) => (
            <article
              className="sv-investment-card"
              key={field.id}
            >
              {/* Background image */}

              <div className="sv-investment-card__media">
                <img
                  src={field.image}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                />
              </div>

              {/* Gradient overlays */}

              <div
                className="sv-investment-card__shade"
                aria-hidden="true"
              />

              {/* Top number */}

              <span className="sv-investment-card__number">
                {field.number}
              </span>

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