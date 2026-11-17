'use client';

import { ArrowUpRight } from 'lucide-react';
import { imageAssets } from '@/assets/imageAssets';

const fields = [
  {
    id:'industry-sustainability',
    title:'Industry & Sustainability',
    image:imageAssets.investmentFocus.fields.industry,
  },
  {
    id:'printing',
    title:'Printing',
    image:imageAssets.investmentFocus.fields.printing,
  },
  {
    id:'business',
    title:'Business',
    image:imageAssets.investmentFocus.fields.business,
  },
  {
    id:'entertainment',
    title:'Entertainment',
    image:imageAssets.investmentFocus.fields.entertainment,
  },
  {
    id:'technology',
    title:'Technology',
    image:imageAssets.investmentFocus.fields.technology,
  },
  {
    id:'engineering',
    title:'Engineering',
    image:imageAssets.investmentFocus.fields.engineering,
  },
] as const;

export function InvestmentFields() {
  return (
    <section
      className="sv-investment-fields"
      id="investment-fields"
      aria-labelledby="sv-investment-fields-title"
    >
      <div className="container">
        <div className="sv-investment-fields__heading">
          
          <h2 id="sv-investment-fields-title">
            Where We Focus
          </h2>

          <div
            className="sv-investment-fields__heading-line"
            aria-hidden="true"
          >
            <i />
          </div>
        </div>

        <div className="sv-investment-fields__grid">
          {fields.map((field) => (
            <article
              key={field.id}
              id={`investment-field-${field.id}`}
              className="sv-investment-field-card"
            >
              <div className="sv-investment-field-card__media">
                <img
                  src={field.image}
                  alt={`${field.title} investment field`}
                  loading="lazy"
                  draggable={false}
                />

                <div
                  className="sv-investment-field-card__overlay"
                  aria-hidden="true"
                />
              </div>

              <div className="sv-investment-field-card__content">
                <h3>{field.title}</h3>

                <span
                  className="sv-investment-field-card__line"
                  aria-hidden="true"
                />

                <button
                  type="button"
                  className="sv-investment-field-card__arrow"
                  aria-label={`Explore ${field.title}`}
                >
                  <ArrowUpRight
                    size={19}
                    strokeWidth={1.7}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}