import '@/styles/about/about.css';
import { InnerHero } from '@/components/common/InnerHero';
import { AnimatedButton } from '@/components/common/AnimatedButton';
export function AboutScreen() {
    return (
        <>
            <InnerHero
                eyebrow="ABOUT SUMATHI VENTURES"
                title="Our heritage. Our values. Our vision for the future."
                description="Building sustainable business opportunities through strategic collaboration and responsible commercial practices."
            />
            <section className="sv-section container sv-content-grid">
                <div data-reveal>
                    <p className="sv-overline sv-overline--green">WHO WE ARE</p>
                    <h2>A foundation built on trust.</h2>
                </div>
                <div data-reveal>
                    <p>
                        Sumathi Ventures was incorporated on 30 October 2020 as a wholly owned
                        subsidiary of Sumathi Universal Management and Investment (Pvt) Limited.
                    </p>
                    <p>
                        Our business approach seeks to bring together the strengths of our partners
                        with financial resources, market understanding and business relationships.
                    </p>
                    <AnimatedButton dark href="/contact/">
                        Start a conversation
                    </AnimatedButton>
                </div>
            </section>
            <section className="sv-section sv-tint">
                <div className="container sv-two-col">
                    <div className="sv-page-feature" data-reveal>
                        <h2>Our vision</h2>
                        <p>
                            To be a trusted partner in building sustainable and commercially
                            resilient ventures, recognised for integrity, collaboration and
                            long-term value creation.
                        </p>
                    </div>
                    <div className="sv-page-feature" data-reveal>
                        <h2>Our mission</h2>
                        <p>
                            To identify, structure and develop opportunities by combining strategic
                            partnerships, technology capabilities, financial resources and
                            responsible business practices.
                        </p>
                    </div>
                </div>
                <div className="container sv-editorial-note">
                    Proposed vision and mission wording requires management approval before
                    publication.
                </div>
            </section>
        </>
    );
}
