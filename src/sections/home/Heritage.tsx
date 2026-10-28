import { AnimatedButton } from '@/components/common/AnimatedButton';
export function Heritage() {
    return (
        <section className="sv-heritage sv-section">
            <div className="container sv-heritage__grid">
                <div data-reveal>
                    <p className="sv-overline">OUR HERITAGE</p>
                    <h2>
                        Guided by integrity.
                        <br />
                        Strengthened by unity.
                    </h2>
                </div>
                <div data-reveal>
                    <p>
                        As part of Sumathi Universal, Sumathi Ventures draws on a business heritage
                        grounded in unity, honesty and integrity. These values shape how we work
                        with our partners and approach long-term opportunities.
                    </p>
                    <AnimatedButton href="/about/">Learn about us</AnimatedButton>
                </div>
            </div>
        </section>
    );
}
