'use client';

import { useInView } from 'motion/react';
import { useRef } from 'react';

import {
  Leaf,
  Recycle,
  Layers3,
  SunMedium,
} from 'lucide-react';

import { videoAssets } from '@/assets/videoAssets';
import '@/styles/investment-focus/printing/printing-sustainability.css';

import MagicBento from './MagicBento';

const priorities = [
  {
    title:'Energy Efficiency',
    icon:Leaf,
  },
  {
    title:'Reduced Waste',
    icon:Recycle,
  },
  {
    title:'Responsible Materials',
    icon:Layers3,
  },
];

const sustainabilityCards = [
  {
    id: 'solar-installation',
    fullWidth: true,
    content: (
      <div className="sv-print-sustainability__solar">
        <div className="sv-print-sustainability__solar-icon">
          <SunMedium size={30} strokeWidth={1.6} aria-hidden="true" />
        </div>
        <div>
          <span>Existing Renewable Energy Initiative</span>
          <strong>300 KVA Solar Installation</strong>
        </div>
      </div>
    ),
  },
  ...priorities.map(({ title, icon: Icon }) => ({
    id: title,
    content: (
      <div className="sv-print-sustainability__priority">
        <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
        <span>{title}</span>
      </div>
    ),
  })),
];

export function PrintingSustainability() {
  const accentRef = useRef<HTMLDivElement>(null);
  const accentInView = useInView(accentRef, { once: true });

  return (
    <section className="sv-print-sustainability">
      <div className="container sv-print-sustainability__inner">

        <div className="sv-print-sustainability__content">

          <h2>
            Building a More Efficient Print Future
          </h2>

          <div
            ref={accentRef}
            className="sv-print-sustainability__accent"
            data-filled={accentInView}
            aria-hidden="true"
          />

          <p className="sv-print-sustainability__description">
            Our printing platform is increasingly focused on improving
            energy efficiency, reducing production waste and encouraging
            more responsible material use while strengthening long term
            operational resilience.
          </p>

          <p className="sv-print-sustainability__description sv-print-sustainability__description--secondary">
            NAPCO&apos;s existing solar installation provides a tangible
            foundation for this direction, supporting a broader approach
            to more efficient and responsible print production.
          </p>

          <div className="sv-print-sustainability__priorities">
            <MagicBento
              items={sustainabilityCards}
              columns={3}
              rowHeight={116}
              gap={12}
              radius={20}
              enableBorderGlow
              enableSpotlight
              spotlightRadius={300}
              clickEffect
            />
          </div>

        </div>

        <div className="sv-print-sustainability__media">
          <div className="sv-print-sustainability__video-wrap">

            <video
              className="sv-print-sustainability__video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="NAPCO sustainable printing and production"
            >
              <source
                src={
                  videoAssets.investmentFocus.printing.napcoSustainability
                }
                type="video/webm"
              />
            </video>

            <div
              className="sv-print-sustainability__video-shade"
              aria-hidden="true"
            />

            <div className="sv-print-sustainability__video-label">

              <p>
                Sustainable Production
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
