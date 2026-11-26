import { imageAssets } from '@/assets/imageAssets';
import '@/styles/investment-focus/printing/napco.css';

import { CompanyWebsiteLink } from './CompanyWebsiteLink';

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

          <h2>
            NAPCO
          </h2>

          <h3>
            Large Scale & Specialized
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
              quality control processes.
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

            <CompanyWebsiteLink
              href="https://napco.lk/"
              company="NAPCO"
              textColor="#000000"
              lineColor="#d3b452"
            />
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

              <p>
                Napco
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
