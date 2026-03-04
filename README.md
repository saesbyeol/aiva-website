# Aiva — AI Systems Agency Website

A production-grade marketing website for Aiva, built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS variables |
| Animation | Framer Motion |
| Smooth scroll | Lenis |
| Icons | lucide-react |
| Forms | React Hook Form + Zod |
| Email | Resend (fallback: logs to console) |
| Analytics | Plausible (optional, env-gated) |
| Testing | Playwright |
| Lint/format | ESLint + Prettier |
| Deploy target | Vercel |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=hello@aiva.agency
NEXT_PUBLIC_SITE_URL=https://aiva.agency
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aiva.agency
```

### 3. Run development server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Build for production

```bash
npm run build && npm run start
```

---

## Project Structure

```
aiva/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Homepage
│   ├── not-found.tsx           # 404 page
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── about/page.tsx
│   ├── contact/
│   │   ├── page.tsx
│   │   └── contact-form.tsx    # Client-side form
│   ├── services/page.tsx
│   ├── work/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── privacy/page.tsx
│   └── api/contact/route.ts
├── components/
│   ├── ui/                     # Button, Card, Badge, Accordion, etc.
│   ├── layout/                 # Header, Footer, MobileNav
│   ├── sections/               # Homepage sections
│   └── motion/                 # Reveal, LenisProvider, ProgressBar
├── lib/
│   ├── constants.ts            # Nav, site config
│   ├── content.ts              # All site copy (data-driven)
│   ├── seo.ts                  # Metadata + JSON-LD
│   └── utils.ts
├── styles/globals.css          # Tailwind v4 @theme + base styles
├── tests/smoke.spec.ts         # Playwright tests
└── public/
    └── og-image.png            # Replace with real 1200x630 image
```

---

## Available Scripts

```bash
npm run dev           # Dev server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # ESLint
npm run format        # Prettier write
npm run format:check  # Prettier check
npm run test          # Playwright smoke tests
npm run test:ui       # Playwright UI mode
npm run test:headed   # Playwright headed
```

---

## Deployment to Vercel

```bash
npm i -g vercel
vercel
```

Set environment variables in the Vercel dashboard:

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Optional | Email delivery |
| `CONTACT_EMAIL` | Optional | Receives form submissions |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL + OG |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Analytics |

Without `RESEND_API_KEY`, form submissions are logged to console (no email sent). The form still shows success to users.

---

## Content

All site content is in `/lib/content.ts`:
- Services, case studies, testimonials, FAQs
- Team members, tooling stack, packages

No CMS required. Edit the file and redeploy.

---

## Animation Notes

### Reduced motion support
- CSS keyframe animations (marquee, float) disabled via `@media (prefers-reduced-motion: reduce)`
- Lenis smooth scroll automatically disabled when reduced motion is preferred
- Graceful fallback to native scroll

### Framer Motion patterns used
- `useInView` for scroll-triggered reveals (fires once)
- Stagger containers with variable delays
- `useScroll` + `useTransform` for parallax and scroll-driven effects
- `whileHover` for microinteractions

---

## Lighthouse Checklist

### Before going live
- [ ] Replace `/public/og-image.png` with real 1200×630px image
- [ ] Add real favicons (favicon.ico, apple-touch-icon.png)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Verify all case study images added to `/public/images/`
- [ ] Check color contrast with Deque axe DevTools
- [ ] Validate heading hierarchy (no h1→h3 jumps)
- [ ] Test keyboard navigation end-to-end

### Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+
