import '@/styles/investment-focus/focus.css';
import { InnerHero } from '@/components/common/InnerHero';
import { AnimatedButton } from '@/components/common/AnimatedButton';
const focusAreas = [
    'Digital security printing',
    'Enterprise technology solutions',
    'Technology-enabled business processes',
];
export function TechnologyScreen() {
    return (
        <>
            <InnerHero
                eyebrow="INVESTMENT FOCUS / TECHNOLOGY"
                title="Technology"
                description="Enabling progress through technology partnerships."
            />
            <section className="sv-section container">
                <p className="sv-overline sv-overline--green">AREAS OF INTEREST</p>
                <h2>Opportunities within technology.</h2>
                <div className="sv-list-grid">
                    {focusAreas.map((item, index) => (
                        <div data-reveal className="sv-page-feature" key={item}>
                            <span>0{index + 1}</span>
                            <h3>{item}</h3>
                        </div>
                    ))}
                </div>
                <AnimatedButton dark href="/contact/">
                    Discuss a sector opportunity
                </AnimatedButton>
            </section>
        </>
    );
}
