import printingHero from '../../../../public/images/investment-focus/printing/printing-hero.png';

export function PrintingHero() {
  return (
    <section className="sv-printing-hero">
      <img
        src={printingHero.src}
        alt=""
        className="sv-printing-hero__image"
        draggable={false}
      />

      <div
        className="sv-printing-hero__overlay"
        aria-hidden="true"
      />

      <div className="container sv-printing-hero__inner">
        <h1>Printing at Scale</h1>
      </div>
    </section>
  );
}