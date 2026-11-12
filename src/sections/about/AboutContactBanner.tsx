'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { imageAssets } from '@/assets/imageAssets';

export function AboutContactBanner() {
  const reduced = useReducedMotion();

  return (
    <section
      className="sv-about-contact"
      aria-labelledby="sv-about-contact-title"
    >
      <div className="sv-about-contact__media" aria-hidden="true">
        <img
          src={imageAssets.about.contactBanner}
          alt=""
          draggable={false}
        />
      </div>

      <div className="sv-about-contact__overlay" aria-hidden="true" />

      <div className="container sv-about-contact__inner">
        <motion.div
          className="sv-about-contact__content"
          initial={reduced ? false : { opacity:0, y:28 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:.35 }}
          transition={{
            duration:reduced ? 0 : .8,
            ease:[.22,1,.36,1],
          }}
        >
          <span className="sv-about-contact__eyebrow">
            LET&apos;S CONNECT
          </span>

          <h2 id="sv-about-contact-title">
            Let&apos;s Build What&apos;s Next.
          </h2>

          <p>
            Connect with Sumathi Ventures to explore partnerships,
            opportunities and strategic ventures built for long-term value.
          </p>

          <div className="sv-about-contact__actions">
            <a
              className="sv-about-contact__button sv-about-contact__button--whatsapp"
              href="https://wa.me/94722259524"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Sumathi Ventures on WhatsApp at +94 72 225 9524"
            >
              <span className="sv-about-contact__button-icon">
                <MessageCircle size={18} strokeWidth={1.8} />
              </span>

              <span>
                <small>WHATSAPP</small>
                +94 72 225 9524
              </span>
            </a>

            <Link
              className="sv-about-contact__button sv-about-contact__button--contact"
              href="/contact"
            >
              <span>Contact Us</span>

              <span className="sv-about-contact__button-arrow">
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}