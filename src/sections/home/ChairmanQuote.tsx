'use client';

import TextType from '@/components/common/TextType';
import { imageAssets } from '@/assets/imageAssets';

export function ChairmanQuote() {
  return (
    <section
      className="sv-chairman-quote"
      aria-labelledby="chairman-quote-title"
    >
      <div className="sv-chairman-quote__media">
        <img
          src={imageAssets.quote}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </div>

      <div
        className="sv-chairman-quote__overlay"
        aria-hidden="true"
      />

      <div className="container sv-chairman-quote__inner">
        <div className="sv-chairman-quote__content">
          <span
            className="sv-chairman-quote__mark"
            aria-hidden="true"
          >
            “
          </span>

          <blockquote>
            <h2 id="chairman-quote-title">
              <TextType
                text="Our Goal is to become Globally Present, Regionally Strong, Sri Lankan based leader in Ventures"
                typingSpeed={75}
                cursorBlinkDuration={0.5}
                cursorGlide
                showCursor
              />
            </h2>

            <footer>
              <span className="sv-chairman-quote__line" />

              <div>
                <strong>Thilanga Sumathipala</strong>

                <span>
                  Chairman of Sumathi Ventures
                </span>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
