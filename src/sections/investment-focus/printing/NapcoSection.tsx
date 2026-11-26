import { ArrowUpRight } from 'lucide-react';

import { imageAssets } from '@/assets/imageAssets';
import '@/styles/investment-focus/printing/napco.css';

const strengths = [
  'High-Volume Printing',
  'Publishing',
  'Contract Printing',
  'Specialised Production',
  'Quality Control',
  'Scalable Capacity',
];

export function NapcoSection() {
  return (
    <section className="sv-napco-section">
      <div className="container sv-napco-section__inner">

        <div className="sv-napco-section__content">

          <span className="sv-napco-section__eyebrow">
            Portfolio Company 02
          </span>

          <h2>
            NAPCO
          </h2>

          <h3>
            Large-Scale & Specialized
            <br />
            Print Production
          </h3>

          <div className="sv-napco-section__copy">
            <p>
              Established in 2003, NAPCO has developed a strong position
              in large-scale commercial printing and publishing, supporting
              institutional, corporate and high-volume production
              requirements.
            </p>

            <p>
              Its production capabilities extend across books, publications,
              brochures, catalogues, annual reports, labels and other
              specialised print applications, supported by dedicated
              production machinery, experienced teams and disciplined
              quality-control processes.
            </p>
          </div>

          <div className="sv-napco-section__investment">
            <span>
              Investment Perspective
            </span>

            <p>
              For Sumathi Ventures, NAPCO represents a scalable production
              platform with opportunities centred on modernisation,
              automation, productivity and recurring contract demand.
              Investment in advanced press technology, efficient production
              workflows and energy-conscious operations can further
              strengthen its ability to serve larger commercial,
              institutional and regional print programmes.
            </p>
          </div>

          <div className="sv-napco-section__strengths">
            {strengths.map((item) => (
              <span key={item}>
                {item}
              </span>
            ))}
          </div>

          <div className="sv-napco-section__footer">
            <p>
              Scale. Reliability. Production discipline.
            </p>

            <a
              href="https://napco.lk/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit NAPCO website"
            >
              Visit Company

              <ArrowUpRight
                size={17}
                strokeWidth={1.7}
              />
            </a>
          </div>

        </div>

        <div className="sv-napco-section__media">
          <div className="sv-napco-section__image-wrap">
            <img
              src={imageAssets.investmentFocus.printing.napco}
              alt="NAPCO specialised print production facility"
              className="sv-napco-section__image"
              draggable={false}
            />

            <div
              className="sv-napco-section__image-shade"
              aria-hidden="true"
            />

            <div className="sv-napco-section__image-label">
              <span>02</span>

              <p>
                Portfolio
                <br />
                Company
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}