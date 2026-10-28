import type { ReactNode } from 'react';
export function InnerHero({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: ReactNode;
}) {
    return (
        <section className="sv-inner-hero">
            <div className="container">
                <p className="sv-overline">{eyebrow}</p>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </section>
    );
}
