'use client';

import {
  useEffect,
  useState,
  type CSSProperties,
} from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  ArrowUpRight,
  ChevronDown,
  Mail,
  Menu,
  Phone,
  X,
} from 'lucide-react';

import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';

import { imageAssets } from '@/assets/imageAssets';

const investmentLinks = [
  {
    number:'01',
    label:'Industry & Sustainability',
    href:'/investment-focus/industry-sustainability',
  },
  {
    number:'02',
    label:'Printing',
    href:'/investment-focus/printing',
  },
  {
    number:'03',
    label:'Business',
    href:'/investment-focus/business',
  },
  {
    number:'04',
    label:'Entertainment',
    href:'/investment-focus/entertainment',
  },
  {
    number:'05',
    label:'Technology',
    href:'/investment-focus/technology',
  },
  {
    number:'06',
    label:'Engineering',
    href:'/investment-focus/engineering',
  },
] as const;

const socialLinks = [
  {
    label:'Facebook',
    href:'https://www.facebook.com/share/1FoY3Jj9cF/?mibextid=wwXIfr',
    icon:FaFacebookF,
  },
  {
    label:'X',
    href:'#',
    icon:FaXTwitter,
  },
  {
    label:'LinkedIn',
    href:'http://lk.linkedin.com/company/sumathi-ventures',
    icon:FaLinkedinIn,
  },
] as const;

export function Navbar() {
  const pathname = usePathname();

  const [hydrated,setHydrated] = useState(false);
  const [open,setOpen] = useState(false);
  const [investmentOpen,setInvestmentOpen] = useState(false);
  const [isScrolled,setIsScrolled] = useState(false);

  useEffect(() => {
    setHydrated(true);
  },[]);

  useEffect(() => {
    setOpen(false);
    setInvestmentOpen(false);
  },[pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive:true },
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      );
    };
  },[]);

  const isActive = (href:string) => {
    if(!hydrated || !pathname) return false;

    if(href === '/') {
      return pathname === '/';
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const investmentActive =
    hydrated &&
    !!pathname &&
    (
      pathname === '/investment-focus' ||
      pathname.startsWith('/investment-focus/')
    );

  return (
    <header
      className={`sv-navbar ${
        isScrolled
          ? 'is-scrolled'
          : 'is-top'
      }`}
    >
      <div className="sv-navbar__shell">

        {/* LOGO */}
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

        {/* DESKTOP NAVIGATION */}
        <nav
          className="sv-navbar__desktop"
          aria-label="Main navigation"
        >

          {/* HOME */}
          <Link
            href="/"
            className={
              isActive('/')
                ? 'is-active'
                : ''
            }
          >
            Home

            <span
              className="sv-navbar__active-line"
              aria-hidden="true"
            />
          </Link>

          {/* ABOUT */}
          <Link
            href="/about"
            className={
              isActive('/about')
                ? 'is-active'
                : ''
            }
          >
            About Us

            <span
              className="sv-navbar__active-line"
              aria-hidden="true"
            />
          </Link>

          {/* INVESTMENT FOCUS */}
          <div
            className={`sv-navbar__investment ${
              investmentActive
                ? 'is-active'
                : ''
            }`}
          >
            <Link
              href="/investment-focus"
              className="sv-navbar__investment-trigger"
              aria-current={
                pathname === '/investment-focus'
                  ? 'page'
                  : undefined
              }
            >
              <span>
                Investment Focus
              </span>

              <ChevronDown
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span
                className="sv-navbar__active-line"
                aria-hidden="true"
              />
            </Link>

            {/* DESKTOP MEGA MENU */}
            <div className="sv-navbar__investment-menu">
              <div className="sv-navbar__investment-menu-inner">

                <div className="sv-navbar__investment-intro">
                  <span>
                    INVESTMENT FOCUS
                  </span>

                  <h3>
                    Where We
                    <br />
                    Invest.
                  </h3>

                  <Link href="/investment-focus">
                    View Overview

                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>

                <div className="sv-navbar__investment-links">
                  {investmentLinks.map((item) => {
                    const active =
                      pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={
                          active
                            ? 'is-active'
                            : ''
                        }
                        aria-current={
                          active
                            ? 'page'
                            : undefined
                        }
                      >
                        <span className="sv-navbar__investment-number">
                          {item.number}
                        </span>

                        <span className="sv-navbar__investment-label">
                          {item.label}
                        </span>

                        <ArrowUpRight
                          className="sv-navbar__investment-arrow"
                          size={17}
                          strokeWidth={1.7}
                        />
                      </Link>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>

          {/* INSIGHTS */}
          <Link
            href="/insights"
            className={
              isActive('/insights')
                ? 'is-active'
                : ''
            }
          >
            Insights

            <span
              className="sv-navbar__active-line"
              aria-hidden="true"
            />
          </Link>

          {/* CONTACT */}
          <Link
            href="/contact"
            className={
              isActive('/contact')
                ? 'is-active'
                : ''
            }
          >
            Contact Us

            <span
              className="sv-navbar__active-line"
              aria-hidden="true"
            />
          </Link>

        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="sv-navbar__actions">

          {/* EMAIL */}
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

          {/* PHONE */}
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

          {/* SOCIAL ICONS — SCROLL MODE */}
          <div
            className="sv-navbar__socials"
            aria-label="Social media"
          >
            {socialLinks.map((item,index) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sv-navbar__social"
                  aria-label={item.label}
                  style={{
                    '--social-index':index,
                  } as CSSProperties}
                >
                  <Icon />
                </a>
              );
            })}
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            className="sv-navbar__menu"
            aria-label={
              open
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={open}
            onClick={() => {
              setOpen((current) => !current);

              if(open) {
                setInvestmentOpen(false);
              }
            }}
          >
            {open ? (
              <X
                size={22}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={22}
                strokeWidth={1.8}
              />
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          className={`sv-navbar__mobile ${
            open
              ? 'is-open'
              : ''
          }`}
        >
          <nav aria-label="Mobile navigation">

            {/* HOME */}
            <Link
              href="/"
              className={
                isActive('/')
                  ? 'is-active'
                  : ''
              }
            >
              <span className="sv-navbar__mobile-number">
                01
              </span>

              <span>
                Home
              </span>
            </Link>

            {/* ABOUT */}
            <Link
              href="/about"
              className={
                isActive('/about')
                  ? 'is-active'
                  : ''
              }
            >
              <span className="sv-navbar__mobile-number">
                02
              </span>

              <span>
                About Us
              </span>
            </Link>

            {/* INVESTMENT MOBILE TRIGGER */}
            <button
              type="button"
              className={`sv-navbar__mobile-investment-trigger ${
                investmentActive
                  ? 'is-active'
                  : ''
              }`}
              aria-expanded={investmentOpen}
              onClick={() =>
                setInvestmentOpen(
                  (current) => !current,
                )
              }
            >
              <span className="sv-navbar__mobile-number">
                03
              </span>

              <span>
                Investment Focus
              </span>

              <ChevronDown
                size={17}
                strokeWidth={1.8}
              />
            </button>

            {/* MOBILE INVESTMENT SUBMENU */}
            <div
              className={`sv-navbar__mobile-investment ${
                investmentOpen
                  ? 'is-open'
                  : ''
              }`}
            >
              <Link
                href="/investment-focus"
                className={
                  pathname === '/investment-focus'
                    ? 'is-active'
                    : ''
                }
              >
                <span>00</span>
                Overview
              </Link>

              {investmentLinks.map((item) => {
                const active =
                  pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? 'is-active'
                        : ''
                    }
                    aria-current={
                      active
                        ? 'page'
                        : undefined
                    }
                  >
                    <span>
                      {item.number}
                    </span>

                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* INSIGHTS */}
            <Link
              href="/insights"
              className={
                isActive('/insights')
                  ? 'is-active'
                  : ''
              }
            >
              <span className="sv-navbar__mobile-number">
                04
              </span>

              <span>
                Insights
              </span>
            </Link>

            {/* CONTACT */}
            <Link
              href="/contact"
              className={
                isActive('/contact')
                  ? 'is-active'
                  : ''
              }
            >
              <span className="sv-navbar__mobile-number">
                05
              </span>

              <span>
                Contact Us
              </span>
            </Link>

            {/* MOBILE EMAIL */}
            <a
              href="mailto:info@sumathiventures.com"
              className="sv-navbar__mobile-utility"
            >
              <Mail
                size={17}
                strokeWidth={1.8}
              />

              <span>
                info@sumathiventures.com
              </span>
            </a>

            {/* MOBILE PHONE */}
            <a
              href="tel:+94112697106"
              className="sv-navbar__mobile-utility"
            >
              <Phone
                size={17}
                strokeWidth={1.8}
              />

              <span>
                (+94) 112 697 106
              </span>
            </a>

            {/* MOBILE CONTACT CTA */}
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