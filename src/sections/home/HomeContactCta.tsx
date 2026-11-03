import { imageAssets } from '@/assets/imageAssets';
import StrokeText from '@/components/common/StrokeText';

export function HomeContactCta() {
  return (
    <section
      className="sv-home-contact-cta"
      data-cursor="CONNECT ↗"
      aria-labelledby="sv-home-contact-cta-title"
    >
      <div className="sv-home-contact-cta__media">
        <img
          src={imageAssets.contactCtaBanner}
          alt="Premium Sumathi Ventures contact banner background"
          draggable={false}
        />
      </div>

      <div className="sv-home-contact-cta__overlay" />

      <div className="container sv-home-contact-cta__inner">
        <div className="sv-home-contact-cta__content">
          <span className="sv-home-contact-cta__eyebrow">
            CONTACT SUMATHI VENTURES
          </span>

          <h2 id="sv-home-contact-cta-title">
            <StrokeText text="Let’s Start a Strategic Conversation" />
          </h2>

          <p>
            Whether you are exploring a partnership, investment opportunity or
            business proposal, our team is ready to connect with you.
          </p>

          <div className="sv-home-contact-cta__actions">
            <a
              className="sv-home-contact-cta__btn sv-home-contact-cta__btn--primary"
              href="tel:+94112697106"
              data-magnetic
            >
              <span data-magnetic-content>Call Us</span>
            </a>

            <a
              className="sv-home-contact-cta__btn sv-home-contact-cta__btn--secondary"
              href="https://wa.me/94722259524"
              data-magnetic
              target="_blank"
              rel="noreferrer"
            >
              <span data-magnetic-content>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
