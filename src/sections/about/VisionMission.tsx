'use client';

import { motion, useReducedMotion } from 'motion/react';
import { imageAssets } from '@/assets/imageAssets';

export function VisionMission() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="sv-vision-mission">

      {/* =========================
          VISION
      ========================== */}

      <div className="container sv-vision-mission__row sv-vision-mission__row--vision">

        <motion.div
          className="sv-vision-mission__content"
          initial={reduceMotion ? false : { opacity:0, x:-45 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true, amount:.3 }}
          transition={{
            duration:reduceMotion ? 0 : .8,
            ease:[.22,1,.36,1],
          }}
        >
          <span className="sv-vision-mission__badge">
            OUR VISION
          </span>

          <h2>
            Building Partnerships.
            <br />
            Creating Long-Term Growth.
          </h2>

          <p>
            To become a Global company most admired for our partnerships and
            performance amongst competitors with our portfolio of services.
            We are positioned for long term growth that will benefit our
            valued customers, partners &amp; Society.
          </p>

          <span
            className="sv-vision-mission__accent"
            aria-hidden="true"
          />
        </motion.div>

        <motion.div
          className="sv-vision-mission__image"
          initial={reduceMotion ? false : { opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:.25 }}
          transition={{
            duration:reduceMotion ? 0 : .9,
            ease:[.22,1,.36,1],
          }}
        >
          <img
            src={imageAssets.about.vision}
            alt="Sumathi Ventures vision represented through strategic infrastructure and operational development"
            draggable={false}
          />
        </motion.div>

      </div>


      {/* =========================
          MISSION
      ========================== */}

      <div className="container sv-vision-mission__row sv-vision-mission__row--mission">

        <motion.div
          className="sv-vision-mission__image"
          initial={reduceMotion ? false : { opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:.25 }}
          transition={{
            duration:reduceMotion ? 0 : .9,
            ease:[.22,1,.36,1],
          }}
        >
          <img
            src={imageAssets.about.mission}
            alt="Sumathi Ventures mission represented through commerce, logistics and operational coordination"
            draggable={false}
          />
        </motion.div>

        <motion.div
          className="sv-vision-mission__content"
          initial={reduceMotion ? false : { opacity:0, x:45 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true, amount:.3 }}
          transition={{
            duration:reduceMotion ? 0 : .8,
            ease:[.22,1,.36,1],
          }}
        >
          <span className="sv-vision-mission__badge">
            OUR MISSION
          </span>

          <h2>
            Integrity in Every
            <br />
            Venture We Build.
          </h2>

          <p>
            We intend to remain true to our logo and uphold the highest levels
            of integrity as we accomplish our vision and persevere to become
            the best.
          </p>

          <span
            className="sv-vision-mission__accent"
            aria-hidden="true"
          />
        </motion.div>

      </div>

    </section>
  );
}