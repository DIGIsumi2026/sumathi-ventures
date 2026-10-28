import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { site, sectors } from '@/lib/site';
export function Footer() {
    return (
        <footer className="sv-footer">
            <div className="sv-footer__grid container">
                <div className="sv-footer__brand">
                    <Link className="sv-footer__logo" href="/">
                        ↗ Sumathi Ventures
                    </Link>
                    <p>Strategic investments & venture development in Sri Lanka.</p>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                    <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                </div>
                <div>
                    <h3>Explore</h3>
                    {site.links.slice(1).map((x) => (
                        <Link key={x.href} href={x.href}>
                            {x.label}
                        </Link>
                    ))}
                </div>
                <div>
                    <h3>Investment Focus</h3>
                    {sectors.map((x) => (
                        <Link key={x.slug} href={`/investment-focus/${x.slug}/`}>
                            {x.title}
                        </Link>
                    ))}
                </div>
                <div className="sv-footer__contact">
                    <h3>Let's connect</h3>
                    <p>{site.location}</p>
                    <Link className="sv-footer__cta" href="/contact/">
                        Start a conversation <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
            <div className="container sv-footer__bottom">
                <span>
                    © {new Date().getFullYear()} Sumathi Ventures (Pvt) Ltd. All rights reserved.
                </span>
                <span>Strategic partnerships. Responsible growth.</span>
            </div>
        </footer>
    );
}
