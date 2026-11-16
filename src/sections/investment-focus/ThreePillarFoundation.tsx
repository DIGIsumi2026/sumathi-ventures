'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { imageAssets } from '@/assets/imageAssets';

const pillars = [
  {
    number:'01',
    title:'Industry',
    description:'Building resilient industries through sustainable development, infrastructure and longterm operational value.',
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

const positions = ['far-left', 'outer-left', 'left', 'active', 'right', 'outer-right', 'far-right'];
const wrap = (index:number) => ((index % pillars.length) + pillars.length) % pillars.length;

export function ThreePillarFoundation() {
  const [active,setActive] = useState(0);
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, { amount:.25 });
  const dragX = useMotionValue(0);
  const gesture = useRef<{ id:number; x:number; y:number; lastX:number; lastTime:number; velocity:number; horizontal:boolean } | null>(null);
  const suppressClick = useRef(false);
  const settling = useRef<{ stop():void } | null>(null);
  useEffect(() => () => settling.current?.stop(), []);

  const finishDrag = (event:PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    const distance = event.clientX - start.x;
    const threshold = Math.min(90, Math.max(40, event.currentTarget.clientWidth * .08));
    const recentVelocity = performance.now() - start.lastTime < 120 ? start.velocity : 0;
    if (!cancelled && start.horizontal && (Math.abs(distance) > threshold || (Math.abs(distance) > 15 && Math.abs(recentVelocity) > .45))) {
      setActive(current => current + (distance < 0 ? 1 : -1));
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    settling.current = animate(dragX, 0, { duration:reduced ? 0 : .65, ease:[.22,1,.36,1] });
  };

  const previous = () => {
    setActive(current => current - 1);
  };

  const next = () => {
    setActive((current) =>
      current + 1
    );
  };

  const current = pillars[wrap(active)];

  return (
    <section
      className="sv-pillar-foundation"
      aria-labelledby="sv-pillar-foundation-title"
    >
      <div className="container sv-pillar-foundation__heading">

        <h2 id="sv-pillar-foundation-title">
          Three Pillars
          <br />
          One Investment Vision
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
        onKeyDown={event => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            setActive(current => current + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
      >
        <div
          ref={stage}
          className="sv-pillar-carousel__stage"
          data-visible={visible}
          data-cursor="DRAG ↔"
          onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return;
            suppressClick.current = false;
            gesture.current = { id:event.pointerId, x:event.clientX, y:event.clientY, lastX:event.clientX, lastTime:performance.now(), velocity:0, horizontal:false };
          }}
          onPointerMove={event => {
            const start = gesture.current;
            if (!start || start.id !== event.pointerId) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (!start.horizontal) {
              if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { gesture.current = null; return; }
              if (Math.abs(dx) < 8) return;
              start.horizontal = true;
              settling.current?.stop();
              suppressClick.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.dataset.dragging = 'true';
            }
            const now = performance.now();
            start.velocity = (event.clientX - start.lastX) / Math.max(1, now - start.lastTime);
            start.lastX = event.clientX;
            start.lastTime = now;
            dragX.set(Math.max(-event.currentTarget.clientWidth * .6, Math.min(event.currentTarget.clientWidth * .6, dx)));
          }}
          onPointerUp={event => { event.currentTarget.dataset.dragging = 'false'; finishDrag(event); }}
          onPointerCancel={event => { event.currentTarget.dataset.dragging = 'false'; finishDrag(event, true); }}
          onLostPointerCapture={event => {
            if (event.target !== event.currentTarget) return;
            event.currentTarget.dataset.dragging = 'false';
            finishDrag(event, true);
          }}
          onClickCapture={event => {
            if (suppressClick.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); }
          }}
          onDragStart={event => event.preventDefault()}
        >
          <motion.div className="sv-pillar-carousel__track" style={{ x:dragX }}>
          {positions.map((position,slot) => {
            const virtualIndex = active + slot - 3;
            const pillar = pillars[wrap(virtualIndex)];
            const decorative = Math.abs(slot - 3) > 1;

            return (
              <button
                key={virtualIndex}
                type="button"
                className="sv-pillar-carousel__card"
                data-position={position}
                onClick={() => setActive(virtualIndex)}
                tabIndex={decorative ? -1 : 0}
                aria-hidden={decorative || undefined}
                aria-label={`Show ${pillar.title}`}
                aria-current={position === 'active' ? 'true' : undefined}
              >
                <img
                  src={pillar.image}
                  alt=""
                  draggable={false}
                />

                <span className="sv-pillar-carousel__color" aria-hidden="true">
                  <img src={pillar.image} alt="" draggable={false} />
                </span>
              </button>
            );
          })}
          </motion.div>
        </div>

        <div className="sv-pillar-carousel__info">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
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
              {String(wrap(active) + 1).padStart(2,'0')}
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
