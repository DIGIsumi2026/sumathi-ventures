import { ArrowUpRight } from 'lucide-react';

import { imageAssets } from '@/assets/imageAssets';
import '@/styles/investment-focus/printing/sumathi-printers.css';

const strengths = [
  'Commercial Print',
  'Packaging',
  'Premium Finishing',
  'Binding',
  'Technology',
  'Market Expansion',
];

export function SumathiPrintersSection() {
  return (
    <section className="sv-sp-section">
      <div className="container sv-sp-section__inner">

        <div className="sv-sp-section__media">
          <div className="sv-sp-section__image-wrap">
            <img
              src={imageAssets.investmentFocus.printing.sumathiPrinters}
              alt="Sumathi Printers commercial printing facility"
              className="sv-sp-section__image"
              draggable={false}
            />

            <div
              className="sv-sp-section__image-shade"
              aria-hidden="true"
            />

            <div className="sv-sp-section__image-label">
              <span>01</span>

              <p>
                Portfolio
                <br />
                Company
              </p>
            </div>
          </div>
        </div>

        <div className="sv-sp-section__content">

          <span className="sv-sp-section__eyebrow">
            Portfolio Company 01
          </span>

          <h2>
            Sumathi
            <br />
            Printers
          </h2>

          <h3>
            Integrated Commercial
            <br />
            Print & Packaging
          </h3>

          <div className="sv-sp-section__copy">
            <p>
              Built on a printing and publishing heritage dating back to
              1984, Sumathi Printers has evolved into an integrated
              commercial printing operation combining established industry
              experience with modern production capability.
            </p>

            <p>
              Its capabilities extend across commercial printing, books and
              magazines, brochures and catalogues, packaging, labels,
              stationery, binding and premium finishing—supported by
              specialised production technologies and experienced
              operational teams.
            </p>
          </div>

          <div className="sv-sp-section__investment">
            <span>Investment Perspective</span>

            <p>
              For Sumathi Ventures, this established operating platform
              creates opportunities for the next stage of value creation
              through production modernisation, higher-value packaging,
              advanced finishing, operational automation and broader access
              to regional and international markets.
            </p>
          </div>

          <div className="sv-sp-section__strengths">
            {strengths.map((item) => (
              <span key={item}>
                {item}
              </span>
            ))}
          </div>

          <div className="sv-sp-section__footer">
            <p>
              Established capability. Broader applications.
              Higher-value growth.
            </p>

            <a
              href="https://www.sumathiprinters.lk/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Sumathi Printers website"
            >
              Visit Company

              <ArrowUpRight
                size={17}
                strokeWidth={1.7}
              />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}