import { ArrowUpRight } from 'lucide-react';

import SpecularButton from './SpecularButton';

type CompanyWebsiteLinkProps = {
  href: string;
  company: string;
  textColor?: string;
  lineColor?: string;
};

export function CompanyWebsiteLink({
  href,
  company,
  textColor = '#0f0f0f',
  lineColor = '#0a7b4d',
}: CompanyWebsiteLinkProps) {
  return (
    <SpecularButton
      className="specular-button--company"
      size="md"
      radius={40}
      tint="#fffdfd"
      tintOpacity={0.88}
      blur={8}
      textColor={textColor}
      lineColor={lineColor}
      baseColor="#3a3939"
      intensity={1}
      idleIntensity={0.35}
      shineSize={14}
      shineFade={40}
      thickness={1.5}
      glow={1.4}
      followMouse
      proximity={250}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={"Visit " + company + " website"}
    >
      Visit Company

      <ArrowUpRight
        size={17}
        strokeWidth={1.7}
        aria-hidden="true"
      />
    </SpecularButton>
  );
}
