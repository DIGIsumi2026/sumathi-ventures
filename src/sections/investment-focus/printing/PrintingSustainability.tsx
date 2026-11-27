'use client';

import {
  Leaf,
  Recycle,
  Layers3,
  SunMedium,
} from 'lucide-react';

import { videoAssets } from '@/assets/videoAssets';
import '@/styles/investment-focus/printing/printing-sustainability.css';

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

export function PrintingSustainability() {
  return (
    <section className="sv-print-sustainability">
      <div className="container sv-print-sustainability__inner">

        <div className="sv-print-sustainability__content">

          <h2>
            Building a More Efficient Print Future
          </h2>

          <div
            className="sv-print-sustainability__accent"
            aria-hidden="true"
          />

          <p className="sv-print-sustainability__description">
            Our printing platform is increasingly focused on improving
            energy efficiency, reducing production waste and encouraging
            more responsible material use while strengthening long-term
            operational resilience.
          </p>

          <p className="sv-print-sustainability__description sv-print-sustainability__description--secondary">
            NAPCO&apos;s existing solar installation provides a tangible
            foundation for this direction, supporting a broader approach
            to more efficient and responsible print production.
          </p>

          <div className="sv-print-sustainability__solar">
            <div className="sv-print-sustainability__solar-icon">
              <SunMedium
                size={30}
                strokeWidth={1.6}
              />
            </div>

            <div className="sv-print-sustainability__solar-divider" />

            <div>
              <span>Existing Renewable Energy Initiative</span>

              <strong>
                300 KVA Solar Installation
              </strong>
            </div>
          </div>

          <div className="sv-print-sustainability__priorities">
            {priorities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="sv-print-sustainability__priority"
                >
                  <Icon
                    size={24}
                    strokeWidth={1.6}
                  />

                  <span>
                    {item.title}
                  </span>
                </div>
              );
            })}
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