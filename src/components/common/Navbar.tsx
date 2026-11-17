'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { imageAssets } from '@/assets/imageAssets';

const navLinks = [
  {
    label:'Home',
    href:'/',
  },
  {
    label:'About Us',
    href:'/about',
  },
  {
    label:'Investment Focus',
    href:'/investment-focus',
  },
  {
    label:'Insights',
    href:'/insights',
  },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open,setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  },[pathname]);

  const isActive = (href:string) => {
    if(href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sv-navbar">
      <div className="sv-navbar__shell">
        <Link
          href="/"
          className="sv-navbar__logo"
          aria-label="Sumathi Ventures home"
        >
          <img
            src={imageAssets.brand.logo}
            alt="Sumathi Ventures"
            draggable={false}
          />
        </Link>

        <nav
          className="sv-navbar__desktop"
          aria-label="Main navigation"
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'is-active' : ''}
            >
              {item.label}

              <span
                className="sv-navbar__active-line"
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        <div className="sv-navbar__actions">
          <Link
            href="/contact"
            className="sv-navbar__contact"
          >
            <span>Contact Us</span>

            <span className="sv-navbar__contact-icon">
              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
              />
            </span>
          </Link>

          <button
            type="button"
            className="sv-navbar__menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <X size={22} strokeWidth={1.8} />
            ) : (
              <Menu size={22} strokeWidth={1.8} />
            )}
          </button>
        </div>

        <div
          className={`sv-navbar__mobile ${open ? 'is-open' : ''}`}
        >
          <nav aria-label="Mobile navigation">
            {navLinks.map((item,index) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? 'is-active' : ''}
              >
                <span className="sv-navbar__mobile-number">
                  {String(index + 1).padStart(2,'0')}
                </span>

                <span>{item.label}</span>
              </Link>
            ))}

            <Link
              href="/contact"
              className="sv-navbar__mobile-contact"
            >
              Contact Us

              <ArrowUpRight
                size={17}
                strokeWidth={1.8}
              />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}