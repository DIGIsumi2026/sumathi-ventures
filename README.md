# Sumathi Ventures — Next.js & PHPMailer starter

This is a **working starter architecture**, not a pixel-perfect or production-approved copy of the commercial Finzo theme. It implements a demo-inspired visual direction, sticky nav, pill CTA hover, scroll reveals, Anime.js word entrance, dark sector cards and GSAP slow-start/fast-finish back-to-top.

## Prerequisites

- Node.js 20.9+ (Node 22 LTS recommended)
- npm
- For contact form: PHP 8.2+ and Composer on your Hostinger server (or locally to test)
- Approved logo, photos, published projects and typography verification before launch

## Start development

```bash
npm install
cp .env.example .env.local           # Windows: copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The pages and animations can be reviewed without PHP, but **contact submission only works after the PHP endpoint and SMTP settings are configured**.

## Test PHP locally (optional)

```bash
cd server/private
composer install
cp smtp-config.example.php smtp-config.php   # supply real SMTP credentials privately
cd ../public_html
php -S localhost:8000
```

In `.env.local`, set `NEXT_PUBLIC_CONTACT_ENDPOINT=http://localhost:8000/api/contact.php`. The PHP configuration already allows `http://localhost:3000` for dev. Restart `npm run dev` after changing `.env.local`.

## Build & deploy to PHP Hostinger

```bash
npm run typecheck
npm run build
```

`out/` is the generated frontend. Upload its **contents** to the website's `public_html/` directory. Upload `server/public_html/api/contact.php` to `public_html/api/contact.php`. Upload the **contents** of `server/private/` to the sibling `private/` directory **outside public_html**.

On Hostinger SSH, from the `private/` directory run `composer install --no-dev --optimize-autoloader` (or `composer require phpmailer/phpmailer`), then copy `smtp-config.example.php` to `smtp-config.php` and fill provider-specific SMTP details. Check permissions and protect secrets. **Never commit or upload the real smtp-config.php under public_html.**

With Next static export and trailingSlash, routes are emitted as `out/about/index.html`, etc. Do not delete the PHP `/api/` directory when updating the static frontend. In Hostinger, make sure your `.htaccess` does not rewrite `/api/contact.php` into a frontend route. You should keep a backup and plan redirects from original `index.php`/sector URLs.

## Form routing & forwarding

The React form POSTs JSON to `NEXT_PUBLIC_CONTACT_ENDPOINT` (default `/api/contact.php`). PHP validates fields, handles rate limiting and sends the email through PHPMailer using the configured SMTP account. Use a verified From address; the visitor's email goes in Reply-To. Forwarding is configured in the **receiving mailbox provider**, not in the React or PHP code.

Previously used Gmail-first flow: `ContactForm.tsx → api/contact.php → SMTP → Gmail inbox → Gmail forwarding/filter → company mailbox`. Configure Gmail forwarding in Gmail settings. Alternatively, use `to_email` as a Hostinger mailbox and configure Hostinger Email forwarding to a destination mailbox in hPanel. Do **not** configure both directions (mail loop).

To preserve only enquiries in forwarding, filter on the stable subject prefix `[Sumathi Ventures]` at the forwarding provider.

For production, add CAPTCHA/Turnstile or another robust bot barrier, server-side logs and monitoring, proper mailbox authentication (SPF/DKIM/DMARC), consent/privacy content, and review rate limiting across multiple PHP instances. No uploaded files in this starter: for proposal attachments, add private storage and virus scanning before emailing anything.

## Architecture notes

- `src/app/**/page.tsx`: required Next.js App Router thin route files.
- `src/screens/*.tsx`: page content in separate TSX files (do not use `src/pages`, which Next also interprets as routing).
- `src/sections/`: individual page sections, especially Home.
- `src/components/common/`: shared Navbar, Footer, AnimatedButton, PageTransition, and BackToTop.
- `src/styles/home`, `src/styles/about`, `src/styles/investment-focus`, `src/styles/approach`, `src/styles/ventures`, `src/styles/insights`, `src/styles/contact`: separate CSS folders by page. Shared patterns live in `src/styles/common`.
- `src/assets/imageAssets.ts`/`videoAssets.ts`: central approved asset references. Place actual images/video inside `public/images` and `public/videos`.
- `server/`: separate Hostinger PHP backend. SMTP config and Composer vendor MUST remain outside public web root.

## Animation responsibility

| Motion | Tool | Implementation |
| --- | --- | --- |
| Hero word stagger | Anime.js v4 | `TextIntro.tsx` |
| Scroll reveal | GSAP + ScrollTrigger | `ScrollReveals.tsx` |
| Sector cards enter | Motion | `FocusCards.tsx` |
| Page transitions | Motion | `PageTransition.tsx` |
| Native FAQ accordion | HTML/CSS | `Faq.tsx` |
| Sector card hover | CSS transition | `home.css` |
| Button dot transforms to arrow | CSS transition | `buttons.css` |
| Sticky shrinking navbar + mega-menu | React + CSS | `Navbar.tsx` |
| Off-canvas slide | CSS transition | `navigation.css` |
| Scroll-to-top slowly then accelerates | GSAP ScrollToPlugin, `power3.in` | `BackToTop.tsx` |

Important: A screen recording cannot confirm original easing values or font-family declarations. The chosen Manrope font is provisional. Inspect the live reference in browser developer tools (Computed → font-family) and capture hover timings to match them exactly. Original theme license may constrain reuse of assets and source code.

## Pending business approval

- Replace wordmark mockup with official Sumathi Ventures logo.
- Replace graphical hero with approved photography and responsive images.
- Obtain actual project portfolio, leadership and case-study details.
- Confirm proposed vision/mission copy and legal/compliance claims.
- Verify contact email and phone number.
