'use client';

import Link from 'next/link';
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { imageAssets } from '@/assets/imageAssets';
import { InvestmentCtaReveal } from './InvestmentCtaReveal';

export function InvestmentContactCTA() {
  return (
    <section
      className="sv-investment-contact"
      aria-labelledby="sv-investment-contact-title"
    >
      <div className="sv-investment-contact__media" aria-hidden="true">
        <img
          src={imageAssets.investmentFocus.contactCta}
          alt=""
          draggable={false}
        />
      </div>

      <div
        className="sv-investment-contact__overlay"
        aria-hidden="true"
      />

      <div className="container sv-investment-contact__inner">
        <InvestmentCtaReveal
          className="sv-investment-contact__content"
          headingId="sv-investment-contact-title"
          heading="Let&apos;s Build the Next Opportunity"
          lineBreakAfter={3}
        >
          <p>
            Connect with our team to discuss investment opportunities,
            strategic partnerships and ventures designed for long-term value.
          </p>

          <div className="sv-investment-contact__actions">
            <a
              href="mailto:info@sumathiventures.com"
              className="sv-investment-contact__button sv-investment-contact__button--glass"
            >
              <Mail size={18} strokeWidth={1.8} />

              <span>
                <small>EMAIL US</small>
                info@sumathiventures.com
              </span>
            </a>

            <a
              href="https://wa.me/94722259524"
              target="_blank"
              rel="noopener noreferrer"
              className="sv-investment-contact__button sv-investment-contact__button--whatsapp"
            >
              <MessageCircle size={18} strokeWidth={1.8} />

              <span>
                <small>WHATSAPP</small>
                +94 72 225 9524
              </span>
            </a>

            <Link
              href="/contact"
              className="sv-investment-contact__button sv-investment-contact__button--primary"
            >
              <span>Contact Us</span>

              <span className="sv-investment-contact__arrow">
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </span>
            </Link>
          </div>
        </InvestmentCtaReveal>
      </div>
    </section>
  );
}
