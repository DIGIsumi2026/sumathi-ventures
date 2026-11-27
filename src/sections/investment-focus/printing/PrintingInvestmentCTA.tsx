import { imageAssets } from '@/assets/imageAssets';

import { InvestmentContactCTA } from '../InvestmentContactCta';

export function PrintingInvestmentCTA() {
  return (
    <InvestmentContactCTA
      headingId="sv-print-cta-title"
      heading="Invest in the Future of Print"
      description="Partner with us to expand production capability, introduce new technologies, unlock new markets and create long term value across our printing portfolio."
      image={imageAssets.investmentFocus.printing.printingCta}
    />
  );
}
