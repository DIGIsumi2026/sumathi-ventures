import { imageAssets } from '@/assets/imageAssets';

export function PrintingHero() {
  return (
    <section className="sv-printing-hero">
      <img
        src={imageAssets.investmentFocus.printing.hero}
        alt=""
        className="sv-printing-hero__image"
        draggable={false}
      />

      <div
        className="sv-printing-hero__overlay"
        aria-hidden="true"
      />

      <div className="container sv-printing-hero__inner">
        <div className="sv-printing-hero__content">
          <h1>Printing at Scale</h1>

          <p>
            Advanced printing and packaging capabilities built for quality,
            efficiency and large-scale commercial production.
          </p>
        </div>
      </div>
    </section>
  );
}