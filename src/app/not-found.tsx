import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import '@/styles/not-found.css';

export default function NotFound() {
  return (
    <section className="sv-not-found" aria-labelledby="sv-not-found-title">
      <span className="sv-not-found__background-number" aria-hidden="true">404</span>

      <div className="sv-not-found__content">
        <h1 id="sv-not-found-title">This Opportunity Couldn’t Be Found</h1>

        <p>
          The page you are looking for may have been moved, removed or is currently
          unavailable. Explore our investment focus or return to the homepage
        </p>

        <div className="sv-not-found__actions">
          <Link className="sv-not-found__primary" href="/">
            <ArrowLeft size={18} aria-hidden="true" />
            Return Home
          </Link>
          <Link className="sv-not-found__secondary" href="/investment-focus">
            Explore Investment Focus
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <Link className="sv-not-found__contact" href="/contact">
          Contact Us
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
