'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  Mail,
  Menu,
  Phone,
  X,
} from 'lucide-react';

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
  const [isScrolled,setIsScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  },[pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    handleScroll();

    window.addEventListener('scroll',handleScroll,{ passive:true });

    return () => {
      window.removeEventListener('scroll',handleScroll);
    };
  },[]);

  const isActive = (href:string) => {
    if(href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sv-navbar ${isScrolled ? 'is-scrolled' : 'is-top'}`}
    >
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
          <a
            href="mailto:info@sumathiventures.com"
            className="sv-navbar__utility sv-navbar__utility--mail"
            aria-label="Email Sumathi Ventures"
          >
            <span className="sv-navbar__utility-icon">
              <Mail
                size={18}
                strokeWidth={1.8}
              />
            </span>

            <span className="sv-navbar__utility-label">
              info@sumathiventures.com
            </span>
          </a>

          <a
            href="tel:+94112697106"
            className="sv-navbar__utility sv-navbar__utility--phone"
            aria-label="Call Sumathi Ventures"
          >
            <span className="sv-navbar__utility-icon">
              <Phone
                size={18}
                strokeWidth={1.8}
              />
            </span>

            <span className="sv-navbar__utility-label">
              (+94) 112 697 106
            </span>
          </a>

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

            <a
              href="mailto:info@sumathiventures.com"
              className="sv-navbar__mobile-utility"
            >
              <Mail size={17} strokeWidth={1.8} />

              <span>info@sumathiventures.com</span>
            </a>

            <a
              href="tel:+94112697106"
              className="sv-navbar__mobile-utility"
            >
              <Phone size={17} strokeWidth={1.8} />

              <span>(+94) 112 697 106</span>
            </a>

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