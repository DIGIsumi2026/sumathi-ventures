import Aurora from './Aurora';

export function PrintingPlatform() {
  return (
    <section className="sv-printing-platform">
      <div
        className="sv-printing-platform__shade"
        aria-hidden="true"
      />

      <div className="container sv-printing-platform__inner">

        <div className="sv-printing-platform__content">

          <h2>
            An Established Platform
            <br />
            for the Future of Print
          </h2>

          <div className="sv-printing-platform__copy">
            <p>
              Sumathi Ventures&apos; printing portfolio brings together
              <strong> Sumathi Printers</strong> and
              <strong> NAPCO</strong>, two operating businesses with
              complementary strengths across commercial printing,
              large volume production, finishing and specialised
              print capabilities.
            </p>

            <p>
              Together, they create a scalable platform for the next phase
              of growth: modernising production technologies, expanding
              packaging and value-added print solutions, improving
              operational efficiency, developing strategic partnerships
              and pursuing new regional market opportunities.
            </p>
          </div>

          <div className="sv-printing-platform__priorities">
            <span>Technology Modernisation</span>
            <span>Packaging Expansion</span>
            <span>Strategic Partnerships</span>
            <span>Regional Growth</span>
          </div>
        </div>

        <div className="sv-printing-platform__portfolio">

          <div className="sv-printing-platform__company">
            <div>
              <h3>Sumathi Printers</h3>
              <p>Commercial & integrated print production</p>
            </div>
          </div>

          <div className="sv-printing-platform__company">
            <div>
              <h3>NAPCO</h3>
              <p>Large-scale & specialised print production</p>
            </div>
          </div>
        </div>

      </div>

      <div className="sv-printing-platform__aurora" aria-hidden="true">
        <Aurora
          colorStops={["#10b981", "#27ff6f", "#84cc16"]}
          amplitude={1.75}
          blend={0.5}
          height={0.34}
          speed={2}
          glow={0.75}
          direction="bottom"
        />
      </div>
    </section>
  );
}