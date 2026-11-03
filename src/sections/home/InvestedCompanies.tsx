import LogoLoop, { type LogoItem } from '@/components/common/LogoLoop';
import { imageAssets } from '@/assets/imageAssets';
import '@/styles/home/invested-companies.css';

const logos: LogoItem[] = [
  { src: imageAssets.investedCompanies.company1, alt: 'Sumathi Universal' },
  { src: imageAssets.investedCompanies.company2, alt: 'THI' },
  { src: imageAssets.investedCompanies.company3, alt: 'Sumathi Universal Trading' },
  { src: imageAssets.investedCompanies.company4, alt: 'Rabbit' },
  { src: imageAssets.investedCompanies.company5, alt: 'Sujala' },
  { src: imageAssets.investedCompanies.company6, alt: 'Butlers' },
  { src: imageAssets.investedCompanies.company7, alt: 'Octagon Engineering' },
  { src: imageAssets.investedCompanies.company8, alt: 'Napco' },
  { src: imageAssets.investedCompanies.company9, alt: 'Sumathi Printers' },
  { src: imageAssets.investedCompanies.company10, alt: 'Suko' },
  { src: imageAssets.investedCompanies.company11, alt: 'Sumi Shakthi' },
  { src: imageAssets.investedCompanies.company12, alt: 'Sumathi Films' },
  { src: imageAssets.investedCompanies.company13, alt: 'Sumathi Hospitality' },
  { src: imageAssets.investedCompanies.company14, alt: 'Sumathi Awards' },
  { src: imageAssets.investedCompanies.company15, alt: 'Sumathi Entertainment' },
  { src: imageAssets.investedCompanies.company16, alt: 'Octagon Force' },
  { src: imageAssets.investedCompanies.company17, alt: 'Kookaburra' },
].map((logo) => ({ ...logo, width: 2160, height: 2160 }));

export function InvestedCompanies() {
  return (
    <section className="sv-invested-companies" aria-labelledby="invested-companies-title">
      <div className="sv-invested-companies__inner">
        <h2 id="invested-companies-title">Our Invested Companies</h2>
        <LogoLoop
          logos={logos}
          speed={100}
          direction="left"
          logoHeight={140}
          gap={64}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutWidth={0.12}
          draggable
          intro
          ariaLabel="Our invested company logos"
        />
      </div>
    </section>
  );
}
