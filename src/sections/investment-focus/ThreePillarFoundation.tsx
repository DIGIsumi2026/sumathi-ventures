'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { imageAssets } from '@/assets/imageAssets';

const pillars = [
  {
    number:'01',
    title:'Industry',
    description:'Building resilient industries through sustainable development, infrastructure and long term operational value.',
    image:imageAssets.investmentFocus.pillas.industry,
  },
  {
    number:'02',
    title:'Commerce',
    description:'Creating commercial opportunity through strategic partnerships, market access and high-value business ventures.',
    image:imageAssets.investmentFocus.pillas.commerce,
  },
  {
    number:'03',
    title:'Technology',
    description:'Advancing enterprise capability through scalable technology, secure systems and intelligent digital infrastructure.',
    image:imageAssets.investmentFocus.pillas.technology,
  },
] as const;

type Position = 'left' | 'active' | 'right';

function getPosition(index:number, active:number):Position {
  if(index === active) return 'active';

  const total = pillars.length;
  const next = (active + 1) % total;

  return index === next ? 'right' : 'left';
}

export function ThreePillarFoundation() {
  const [active,setActive] = useState(0);
  const reduced = useReducedMotion();

  const previous = () => {
    setActive((current) =>
      current === 0 ? pillars.length - 1 : current - 1
    );
  };

  const next = () => {
    setActive((current) =>
      (current + 1) % pillars.length
    );
  };

  const current = pillars[active];

  return (
    <section
      className="sv-pillar-foundation"
      aria-labelledby="sv-pillar-foundation-title"
    >
      <div className="container sv-pillar-foundation__heading">
        <span>OUR FOUNDATION</span>

        <h2 id="sv-pillar-foundation-title">
          Three Pillars.
          <br />
          One Investment Vision.
        </h2>

        <p>
          Our investment portfolio is shaped around three interconnected
          pillars - Industry, Commerce and Technology creating a strong
          foundation for sustainable partnerships and long-term growth.
        </p>
      </div>

      <div
        className="sv-pillar-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Investment pillars"
      >
        <div className="sv-pillar-carousel__stage">
          {pillars.map((pillar,index) => {
            const position = getPosition(index,active);

            return (
              <button
                key={pillar.number}
                type="button"
                className="sv-pillar-carousel__card"
                data-position={position}
                onClick={() => setActive(index)}
                aria-label={`Show ${pillar.title}`}
                aria-current={position === 'active' ? 'true' : undefined}
              >
                <img
                  src={pillar.image}
                  alt=""
                  draggable={false}
                />

                <span
                  className="sv-pillar-carousel__shade"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <div className="sv-pillar-carousel__info">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.number}
              className="sv-pillar-carousel__copy"
              initial={reduced ? false : { opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              exit={reduced ? undefined : { opacity:0, y:-8 }}
              transition={{
                duration:reduced ? 0 : .32,
                ease:[.22,1,.36,1],
              }}
            >
              <div className="sv-pillar-carousel__title">
                <span>{current.number}</span>
                <h3>{current.title}</h3>
              </div>

              <p>{current.description}</p>
            </motion.div>
          </AnimatePresence>

          <div
            className="sv-pillar-carousel__controls"
            aria-label="Carousel controls"
          >
            <button
              type="button"
              onClick={previous}
              aria-label="Previous investment pillar"
            >
              <ChevronLeft size={18} strokeWidth={1.7} />
            </button>

            <span className="sv-pillar-carousel__counter">
              {String(active + 1).padStart(2,'0')}
              <i>/</i>
              {String(pillars.length).padStart(2,'0')}
            </span>

            <button
              type="button"
              onClick={next}
              aria-label="Next investment pillar"
            >
              <ChevronRight size={18} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}