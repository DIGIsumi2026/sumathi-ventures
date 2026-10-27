import {AnimatedButton} from '@/components/common/AnimatedButton';
import {TextIntro} from '@/components/common/TextIntro';
import {ArrowDownRight,MoveUpRight} from 'lucide-react';
export function Hero(){
 return <section className="sv-hero" id="top">
  <div className="sv-hero__shapes" aria-hidden="true"><span/><span/><span/></div>
  <div className="container sv-hero__content"><div className="sv-hero__aside"><span>STRATEGIC INVESTMENTS &amp;<br/> VENTURE DEVELOPMENT</span><p>Connecting expertise, capital and opportunities through meaningful partnerships.</p><div className="sv-hero__social"><span>INDUSTRY</span><span>COMMERCE</span><span>TECHNOLOGY</span></div></div>
  <div className="sv-hero__main"><p className="sv-overline">ROOTED IN SRI LANKA. BUILT FOR OPPORTUNITY.</p><h1><TextIntro words="Building Partnerships. Creating Lasting Value." /></h1><div className="sv-hero__actions"><AnimatedButton href="/investment-focus/">Explore Our Focus</AnimatedButton><a href="/contact/" className="sv-inline-link">Partner with us <MoveUpRight size={17}/></a></div></div></div>
  <div className="sv-hero__bottom"><div className="sv-hero__graphic" aria-label="Three strategic pillars"><div className="sv-chart-bars"><span/><span/><span/><span/><span/></div><p><ArrowDownRight size={19}/> Three connected pillars.<br/> One long-term perspective.</p></div><div className="sv-hero__photopanel"><div className="sv-hero__panelgrain"/><span>INDUSTRY · COMMERCE · TECHNOLOGY</span><strong>Where ambitions<br/> become partnerships.</strong><span className="sv-hero__corner">↗</span></div></div>
 </section>;
}
