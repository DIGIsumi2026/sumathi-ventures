import '@/styles/approach/approach.css';
import { InnerHero } from '@/components/common/InnerHero';
import { AnimatedButton } from '@/components/common/AnimatedButton';
const approaches = [
    {
        title: 'Joint ventures',
        description:
            'Combining complementary capabilities and resources to pursue shared business objectives.',
    },
    {
        title: 'Public–private partnerships',
        description:
            'Exploring responsibly structured public-sector initiatives with private-sector capability.',
    },
    {
        title: 'BOOT arrangements',
        description:
            'Considering Build–Own–Operate–Transfer models when commercially and contractually appropriate.',
    },
];
export function ApproachScreen() {
    return (
        <>
            <InnerHero
                eyebrow="OUR PARTNERSHIP APPROACH"
                title="Strategic thinking. Collaborative execution."
                description="Our approach prioritises strategic fit, complementary strengths and partnership structures appropriate for each opportunity."
            />
            <section className="sv-section container">
                <p className="sv-overline sv-overline--green">HOW WE PARTNER</p>
                <h2>Partnership structures</h2>
                <div className="sv-list-grid">
                    {approaches.map((a, i) => (
                        <div key={a.title} className="sv-page-feature" data-reveal>
                            <span>0{i + 1}</span>
                            <h3>{a.title}</h3>
                            <p>{a.description}</p>
                        </div>
                    ))}
                </div>
                <AnimatedButton dark href="/contact/">
                    Submit an enquiry
                </AnimatedButton>
            </section>
        </>
    );
}
