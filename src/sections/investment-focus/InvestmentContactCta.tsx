'use client';

import Link from 'next/link';
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { imageAssets } from '@/assets/imageAssets';

export function InvestmentContactCTA() {
  const reduced = useReducedMotion();

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
        <motion.div
          className="sv-investment-contact__content"
          initial={reduced ? false : { opacity:0, y:28 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:.35 }}
          transition={{
            duration:reduced ? 0 : .8,
            ease:[.22,1,.36,1],
          }}
        >
          <span className="sv-investment-contact__eyebrow">
            PARTNER WITH SUMATHI VENTURES
          </span>

          <h2 id="sv-investment-contact-title">
            Let&apos;s Build the
            <br />
            Next Opportunity.
          </h2>

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
        </motion.div>
      </div>
    </section>
  );
}