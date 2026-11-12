'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MarketChartBackground } from '@/components/common/MarketChartBackground';
import { useSectionEntered } from '@/hooks/useSectionEntered';

export function CompanyIntro() {
  const section = useRef<HTMLElement>(null);
  const entered = useSectionEntered(section);
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <section ref={section} className="sv-company-intro" aria-labelledby="sv-company-intro-title">
      <div className="sv-company-intro__chart" aria-hidden="true">
        <MarketChartBackground />
      </div>
      <div className="sv-company-intro__veil" aria-hidden="true" />
      <div className="container sv-company-intro__inner">
        <motion.div
          className="sv-company-intro__content"
          initial={false}
          animate={!hydrated || entered || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: reduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 id="sv-company-intro-title">
            Built on Experience.
            <br />
            Structured for Partnership.
          </h2>
          <p>
            Incorporated on the 30th October 2020, Sumathi Ventures is driven by the visionary
            leadership of Mr. Thilanga Sumathipala- a veteran businessman with a wealth of expertise
            in the corporate world driving many organizations to the height of progress
          </p>
          <p>
            Sumathi Ventures is a fully owned subsidiary of Sumathi Universal Management and
            Investment PVT Limited (SUMI) a management holding company which has established
            business ventures in the fields of Printing, Trading, Hospitality, &amp; Information
            Technology Services.
          </p>
          <p>
            The company will leverage the intellectual property, practices and resources of its
            potential venture partners and combine these inputs with SUMIs financial capital and
            local reputation and market presence through structures such as Joint ventures, BOOT,
            PPP’s, to achieve mutually agreed upon business outcomes.
          </p>
          <div className="sv-company-intro__experience">
            <span>BACKED BY EXPERIENCE ACROSS</span>
            <ul>
              {['Printing', 'Trading', 'Hospitality', 'Information Technology'].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
