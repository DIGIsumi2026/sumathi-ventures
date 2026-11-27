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
        <InvestmentCtaReveal headingId="sv-print-cta-title" heading="Invest in the Future of Print">
          <p>
            Partner with us to expand production capability, introduce
            new technologies, unlock new markets and create long term
            value across our printing portfolio.
          </p>

          <div className="sv-print-cta__actions">
            <Link href="/contact" className="sv-investment-contact__button sv-investment-contact__button--primary">
              <span>Discuss an Opportunity</span>
              <span className="sv-investment-contact__arrow">
                <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </Link>

            <a href="mailto:info@sumathiventures.com" className="sv-investment-contact__button sv-investment-contact__button--glass">
              <Mail size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>Email Us</span>
            </a>
          </div>
        </InvestmentCtaReveal>
      </div>
    </section>
  );
}
