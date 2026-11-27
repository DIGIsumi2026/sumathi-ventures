import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';

import { imageAssets } from '@/assets/imageAssets';
import '@/styles/investment-focus/printing/printing-investment.css';

export function PrintingInvestmentCTA() {
  return (
    <section className="sv-print-cta">
      <img
        src={imageAssets.investmentFocus.printing.printingCta}
        alt=""
        className="sv-print-cta__image"
        draggable={false}
      />

      <div
        className="sv-print-cta__overlay"
        aria-hidden="true"
      />

      <div className="sv-print-cta__content">
        <span className="sv-print-cta__eyebrow">
          Investment & Partnership
        </span>

        <h2>
          Invest in the
          <br />
          Future of Print.
        </h2>

        <p>
          Partner with us to expand production capability, introduce
          new technologies, unlock new markets and create long-term
          value across our printing portfolio.
        </p>

        <div className="sv-print-cta__actions">
          <Link
            href="/contact"
            className="sv-print-cta__primary"
          >
            Discuss an Opportunity

            <ArrowUpRight
              size={17}
              strokeWidth={1.8}
            />
          </Link>

          <a
            href="mailto:info@sumathiventures.com"
            className="sv-print-cta__secondary"
          >
            <Mail
              size={16}
              strokeWidth={1.8}
            />

            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}