import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';

import { imageAssets } from '@/assets/imageAssets';
import '@/styles/investment-focus/inventment-contact.css';
import '@/styles/investment-focus/printing/printing-investment.css';

import { InvestmentCtaReveal } from '../InvestmentCtaReveal';

export function PrintingInvestmentCTA() {
  return (
    <section className="sv-print-cta" aria-labelledby="sv-print-cta-title">
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
        <InvestmentCtaReveal headingId="sv-print-cta-title" heading="Invest in the Future of Print.">
          <p>
            Partner with us to expand production capability, introduce
            new technologies, unlock new markets and create long term
            value across our printing portfolio.
          </p>

          <div className="sv-print-cta__actions">
            <Link href="/contact" className="sv-print-cta__primary">
              Discuss an Opportunity
              <ArrowUpRight className="sv-print-cta__arrow" size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>

            <a href="mailto:info@sumathiventures.com" className="sv-print-cta__secondary">
              <Mail size={16} strokeWidth={1.8} aria-hidden="true" />
              Email Us
            </a>
          </div>
        </InvestmentCtaReveal>
      </div>
    </section>
  );
}
