import '@/styles/investment-focus/focus.css';
import { InnerHero } from '@/components/common/InnerHero';
import { AnimatedButton } from '@/components/common/AnimatedButton';
const focusAreas = [
    'Renewable energy and waste-to-energy',
    'Agricultural value chains',
    'Manufacturing and light engineering',
];
export function IndustryScreen() {
    return (
        <>
            <InnerHero
                eyebrow="INVESTMENT FOCUS / INDUSTRY"
                title="Industry"
                description="Advancing productive industries and sustainable development."
            />
            <section className="sv-section container">
                <p className="sv-overline sv-overline--green">AREAS OF INTEREST</p>
                <h2>Opportunities within industry.</h2>
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
