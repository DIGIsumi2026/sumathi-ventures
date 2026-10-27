import '@/styles/ventures/ventures.css';
import {InnerHero} from '@/components/common/InnerHero';
import {AnimatedButton} from '@/components/common/AnimatedButton';
export function VenturesScreen(){return <><InnerHero eyebrow="VENTURES & PROJECTS" title="Building value through strategic ventures." description="A dedicated home for verified venture and project profiles."/><section className="sv-section container"><div className="sv-empty-state"><strong>Content awaiting approval.</strong><p>Project information, client names, outcomes, timelines and statuses will only be published when verified and authorised by Sumathi Ventures.</p></div><div style={{marginTop:30}}><AnimatedButton dark href="/contact/">Discuss an opportunity</AnimatedButton></div></section></>}
