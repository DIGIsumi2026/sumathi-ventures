
# Sumathi Ventures — Next.js & PHPMailer Starter

<p align="center">
  <strong>Building Partnerships. Creating Lasting Value.</strong><br />
  A modern corporate website for Sumathi Ventures, focused on strategic investments, venture development and business partnerships.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-149ECA?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-0E100F?style=for-the-badge&logo=gsap&logoColor=88CE02" />
  <img alt="Anime.js" src="https://img.shields.io/badge/Anime.js-EA4175?style=for-the-badge" />
  <img alt="Motion" src="https://img.shields.io/badge/Motion-191919?style=for-the-badge" />
  <img alt="PHP" src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img alt="PHPMailer" src="https://img.shields.io/badge/PHPMailer-SMTP-4479A1?style=for-the-badge" />
  <img alt="Hostinger" src="https://img.shields.io/badge/Hostinger-673DE6?style=for-the-badge&logo=hostinger&logoColor=white" />
</p>

## About the Project

**Sumathi Ventures** is being redesigned as a professional, responsive corporate investment and venture-development website. The experience presents the company's business interests in **Industry, Commerce and Technology**, while giving prospective partners a clear way to explore the business and submit enquiries.

This repository is a **development starter architecture**, not a production-approved or pixel-perfect reproduction of the commercial Finzo reference theme. The demo-inspired interface includes a sticky navbar, pill-shaped CTA animations, scroll reveals, Anime.js text entrances, expandable sector cards and a GSAP-powered scroll-to-top control that starts slowly and accelerates.

## Key Features

- Responsive, investment-focused interface with a **sticky, shrinking navigation bar**.
- Animated pill buttons, mega-menu and off-canvas navigation.
- Scroll-triggered headings, page transitions and interactive sector cards.
- GSAP **slow-start / fast-finish** scroll-to-top animation.
- Dedicated pages for company information, investment focus, strategic approach, ventures, insights and contact.
- SEO-friendly Next.js App Router pages with a static-export deployment option.
- Contact form with **React Hook Form, Zod and PHP/PHPMailer** integration.
- SMTP email delivery with optional **Gmail or Hostinger mailbox forwarding**.
- Separate page styles, reusable TSX components and centralised media references.

## Technologies

| Area | Technologies |
| --- | --- |
| Frontend | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS v4, modular page-level CSS |
| UI and icons | shadcn/ui, Lucide React |
| Animation | GSAP, ScrollTrigger, ScrollToPlugin, Anime.js v4, Motion |
| Forms | React Hook Form, Zod |
| Carousel (if needed) | Embla Carousel |
| Backend | PHP 8.2+, PHPMailer, SMTP |
| Hosting | Hostinger (Next.js static export + PHP endpoint) |

> Some libraries and page features are part of the planned stack and may require implementation or configuration beyond the initial starter. Confirm installed dependencies in `package.json` and `composer.json`.

## Prerequisites

- **Node.js 20.9+** (a supported Node.js LTS version is recommended).
- **npm**.
- For contact-form testing or deployment: **PHP 8.2+** and **Composer**.
- Approved company logo, photographs, project details and final typography before production launch.

## Start Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows Command Prompt, replace `cp` with:

```bat
copy .env.example .env.local
```

Open **http://localhost:3000**.

The pages and animations can be reviewed without PHP. **Contact submissions require the PHP endpoint and valid SMTP settings.**

## Test PHP Locally (Optional)

In a separate terminal:

```bash
cd server/private
composer install
cp smtp-config.example.php smtp-config.php
cd ../public_html
php -S localhost:8000
```

On Windows Command Prompt, use `copy smtp-config.example.php smtp-config.php` instead of `cp`.

Add your private SMTP settings to `smtp-config.php`, then set the following value in `.env.local`:

```env
NEXT_PUBLIC_CONTACT_ENDPOINT=http://localhost:8000/api/contact.php
```

The starter PHP endpoint is configured for the local frontend origin `http://localhost:3000`. Restart `npm run dev` after updating `.env.local`. If your PHP server cannot find the private configuration at runtime, check the relative include paths in `contact.php`.

## Build & Deploy to Hostinger

```bash
npm run typecheck
npm run build
```

The build generates the static frontend in `out/`. Deploy as follows:

1. Upload the **contents of `out/`** into the domain's `public_html/` directory.
2. Upload `server/public_html/api/contact.php` to `public_html/api/contact.php`.
3. Upload the **contents of `server/private/`** to a sibling `private/` directory **outside `public_html/`**.
4. Connect through Hostinger SSH, change into the private directory, and install PHP dependencies:

   ```bash
   composer install --no-dev --optimize-autoloader
   ```

5. Create `smtp-config.php` from `smtp-config.example.php` and enter the SMTP credentials securely.
6. Verify the endpoint's private-file paths, server permissions, SMTP connection and delivery before going live.

With Next.js static export and `trailingSlash`, routes can be emitted as `out/about/index.html` and equivalent route directories. Preserve `/api/contact.php` during frontend deployments, and ensure `.htaccess` does not rewrite PHP API requests into frontend routes. Plan redirects from the previous `index.php` and sector URLs.

**Never commit SMTP credentials or place private config files inside the public web root.**

## Contact Form & Email Forwarding

The form sends JSON to `NEXT_PUBLIC_CONTACT_ENDPOINT` (default: `/api/contact.php`). The PHP endpoint validates requests and uses PHPMailer to deliver messages over SMTP.

**Preferred email flow:**

```text
ContactForm.tsx
    → /api/contact.php
    → PHPMailer / SMTP
    → Gmail receiving inbox
    → Gmail forwarding or filter
    → Company mailbox
```

Configure forwarding in the **receiving email provider** rather than React or PHP. An alternative is to receive messages in a Hostinger mailbox and configure forwarding from Hostinger hPanel. **Do not forward in both directions**, which may create a mail loop.

Use a verified sender address and place the visitor's address in `Reply-To`. If forwarding only project enquiries, create a rule based on a consistent subject prefix such as `[Sumathi Ventures]`.

For production, add CAPTCHA/Turnstile or equivalent bot protection, SPF/DKIM/DMARC, appropriate privacy/consent language, server-side monitoring and robust abuse prevention. Do not email user-uploaded proposal attachments without secure private storage and malware scanning.

## Architecture Notes

- `src/app/**/page.tsx` — Next.js App Router route wrappers.
- `src/screens/*.tsx` — full page components in separate TSX files.
- `src/sections/` — individual page sections.
- `src/components/common/` — shared navbar, footer, animated buttons and navigation utilities.
- `src/styles/` — separate page and common CSS folders.
- `src/assets/imageAssets.ts` and `videoAssets.ts` — centralised asset references; media files live under `public/`.
- `src/data/heroSlides.ts` — existing hero copy, CTA destinations, image alt text, portrait presentation and per-slide focal positions.
- `server/` — Hostinger-compatible PHP backend. SMTP configuration and Composer dependencies remain outside the public web root.

> Use `src/screens/` for your main page components instead of `src/pages/`, because Next.js also treats `src/pages/` as a routing directory.

## Animation Responsibilities

| Effect | Technology | Component / style |
| --- | --- | --- |
| Hero crossfade, autoplay and progress | Swiper | `Hero.tsx` |
| Hero stationary masked line reveal | GSAP | `Hero.tsx` |
| Hero image pop, label and CTA entrance | CSS keyframes | `hero.css` |
| Reusable word stagger | Anime.js v4 | `TextIntro.tsx` |
| Scroll reveal | GSAP + ScrollTrigger | `ScrollReveals.tsx` |
| Sector card entrance | Motion | `FocusCards.tsx` |
| Page transitions | Motion | `PageTransition.tsx` |
| FAQ accordion | HTML / CSS | `Faq.tsx` |
| Sector card hover | CSS transitions | `home.css` |
| Button dot-to-arrow transition | CSS transitions | `buttons.css` |
| Sticky navbar and mega-menu | React + CSS | `Navbar.tsx` |
| Off-canvas navigation | CSS transitions | `navigation.css` |
| Accelerating scroll-to-top | GSAP ScrollToPlugin (`power3.in`) | `BackToTop.tsx` |

A screen recording alone cannot verify the reference website's exact font-family and easing values. **Manrope is provisional** until the original site's computed typography is checked. Reuse of original commercial theme assets or code may require a licence.

## Hero Validation

Run `npm run build`, then `npm run test:hero`. The Playwright checks serve the production export on port 3100 and cover all five slides at the 13 specified desktop, tablet and mobile sizes, plus stationary text reveal, rapid navigation, autoplay pause/resume, keyboard pagination, responsive line changes and touch swipes. Windows uses installed Microsoft Edge; set `PLAYWRIGHT_CHANNEL` to choose another installed browser channel. Other platforms use Playwright Chromium (`npx playwright install chromium`). Screenshots and failure traces are saved under the ignored `test-results/` directory.

The hero uses a 1100ms crossfade, a 6500ms autoplay delay and a 10-second image pop/settle/zoom. GSAP reveals stationary quote lines with a 1.28-second delay, 3.25-second duration and 0.45-second stagger. Progress is driven by Swiper's remaining autoplay time. Autoplay continues on hover. Keyboard focus, hidden pages and an offscreen hero pause autoplay; reduced motion disables autoplay and entrance effects. Portrait screens use the original group photos as contained foregrounds over static blurred copies to preserve all subjects.

## Pending Business Approval

- Replace placeholder branding with the official **Sumathi Ventures** logo.
- Add approved hero imagery and optimised responsive media.
- Verify venture/project details, leadership information and any case studies.
- Approve proposed vision, mission and investment-related statements.
- Confirm contact information, privacy notices and final company disclosures.

---

<p align="center">
  <strong>Sumathi Ventures</strong><br />
  Building Partnerships. Creating Lasting Value.
</p>
