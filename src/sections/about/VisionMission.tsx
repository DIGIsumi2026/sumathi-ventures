'use client';

import FadeContent from '@/components/common/FadeContent';
import { imageAssets } from '@/assets/imageAssets';

export function VisionMission() {

  return (
    <section className="sv-vision-mission">

      {/* =========================
          VISION
      ========================== */}

      <div className="container sv-vision-mission__row sv-vision-mission__row--vision">

        <FadeContent
          className="sv-vision-mission__content"
          effect="mist" duration={1.8} ease="power2.out" stagger={0.1} threshold={0.1}
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
        </FadeContent>

        <FadeContent
          className="sv-vision-mission__image"
          effect="mist" duration={1.8} ease="power2.out" stagger={0} threshold={0.1}
        >
          <img
            src={imageAssets.about.vision}
            alt="Sumathi Ventures vision represented through strategic infrastructure and operational development"
            draggable={false}
          />
        </FadeContent>

      </div>


      {/* =========================
          MISSION
      ========================== */}

      <div className="container sv-vision-mission__row sv-vision-mission__row--mission">

        <FadeContent
          className="sv-vision-mission__image"
          effect="mist" duration={1.8} ease="power2.out" stagger={0} threshold={0.1}
        >
          <img
            src={imageAssets.about.mission}
            alt="Sumathi Ventures mission represented through commerce, logistics and operational coordination"
            draggable={false}
          />
        </FadeContent>

        <FadeContent
          className="sv-vision-mission__content"
          effect="mist" duration={1.8} ease="power2.out" stagger={0.1} threshold={0.1}
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
        </FadeContent>

      </div>

    </section>
  );
}
