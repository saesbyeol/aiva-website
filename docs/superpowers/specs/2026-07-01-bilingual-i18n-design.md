# Design: Bilingual (Croatian / English) aiva.agency

**Date:** 2026-07-01
**Status:** Approved (pending spec review)
**Author:** brainstormed with Leo

## Goal

Make the Aiva marketing site fully bilingual — Croatian (existing) and English (new) —
with an in-header language toggle, locale-prefixed URLs, translated slugs, localized
CMS content, and correct SEO (hreflang, canonical, per-locale metadata & sitemap).

## Decisions (locked)

| Decision | Choice |
|---|---|
| URL strategy | Locale in URL. `hr` is the default and stays **prefix-free** (`/usluge`); English is prefixed (`/en/services`). |
| i18n library | **`next-intl`** — replaces the current hand-rolled `t()` dictionary. |
| Slugs | **Translated** per locale (`usluge` ↔ `services`, `radovi` ↔ `work`, `o-nama` ↔ `about`, `kontakt` ↔ `contact`, `privatnost` ↔ `privacy`). |
| Translation source | Claude drafts English; Leo reviews wording before launch. |
| CMS | **Localize Sanity** — add field-level i18n to case studies & video ads. |
| Default language | Croatian (`hr`). |

## Why next-intl (not hand-rolled)

The current `lib/i18n` reads a **single dictionary fixed at module import**, and
`NAV_LINKS`/`SITE`/`content.ts` are computed once at load. That model cannot do
per-request locale switching, translated slugs, or hreflang/canonical without
substantial custom middleware. `next-intl` provides all of it (locale routing with
`localePrefix: 'as-needed'`, translated `pathnames`, locale-aware `Link`/`redirect`/
`usePathname`, and SEO helpers) as a maintained library. The existing dot-path key
structure (`nav.services`, `form.submit`) maps 1:1 onto next-intl messages, so the
migration is largely mechanical.

---

## Architecture

### Locale configuration

- `src`-less project; add `i18n/routing.ts` defining:
  - `locales = ['hr', 'en']`, `defaultLocale = 'hr'`.
  - `localePrefix: 'as-needed'` (default locale has no prefix).
  - `pathnames` map for translated slugs (see table above). The home route `/` is shared.
- `i18n/request.ts` — next-intl request config that loads `messages/{locale}.json`.
- `middleware.ts` — next-intl middleware for locale detection (cookie → `Accept-Language`
  → default) and prefixing/rewrites.
  - **Matcher must exclude**: `/studio` (Sanity Studio), `/api`, `/_next`, `/_vercel`,
    and static files (anything with a dot). Studio and API routes stay locale-agnostic.

### Routing / file moves

Move all public routes under `app/[locale]/`:

```
app/
  [locale]/
    layout.tsx        # was app/layout.tsx — lang, providers, metadata now per-locale
    page.tsx          # home
    usluge/…          # served at /usluge (hr) and /en/services (en) via pathnames
    radovi/…          # /radovi ↔ /en/work
    radovi/[slug]/…
    o-nama/…          # /o-nama ↔ /en/about
    kontakt/…         # /kontakt ↔ /en/contact
    privatnost/…      # /privatnost ↔ /en/privacy
  studio/[[...tool]]/ # UNCHANGED — not under [locale]
  api/contact/        # UNCHANGED — not under [locale]
```

Internal navigation swaps `next/link` for next-intl's locale-aware `Link` (from
`i18n/routing.ts`), so hrefs resolve to the correct translated slug for the active locale.
Physical route folder names can stay Croatian; `pathnames` maps the public URL per locale.

### Layout & `<html lang>`

- `app/[locale]/layout.tsx` sets `<html lang={locale}>` dynamically (currently hardcoded
  `"hr"`).
- Cookiebot `data-culture` becomes `locale.toUpperCase()` (`HR`/`EN`).
- Wrap the tree in `NextIntlClientProvider` so client components can call `useTranslations`.
- A minimal root `app/layout.tsx` may remain for `<html>`-less passthrough if required by
  next-intl's setup; final shape follows next-intl's App Router guidance.

### The `t()` → next-intl migration

- `messages/hr.json` — generated from `lib/i18n/hr.ts` (same nested shape, JSON).
- `messages/en.json` — English draft.
- Replace `import { t } from "@/lib/i18n"`:
  - **Server components:** `const t = await getTranslations()` (or scoped namespace).
  - **Client components:** `const t = useTranslations()`.
- `ta()` (array access) → next-intl `t.raw('key')` returns arrays/objects.
- `lib/i18n/*` and its `t`/`ta` helpers are removed once all call sites are migrated.
  Every component listed in the "Touch surface" section below is updated.

### Static content (`lib/content.ts`)

`content.ts` holds large HR data arrays (`services`, `process`, `faqs`, `testimonials`,
`teamMembers`, `packages`, `toolingStack`, `adShowcase`, `clients`, and a hardcoded
`caseStudies` array). Approach:

- Text-bearing arrays become **locale-selectable**. Preferred: move the strings into
  next-intl messages (`messages/{locale}.json`) and keep non-text data (icons, colors,
  image paths, hrefs, timelines that are locale-neutral) in `content.ts`, joined by `id`.
  Where an array is almost entirely prose (services, faqs, testimonials, process), move it
  wholesale into messages via `t.raw`.
- **Audit for dead data first**: confirm which arrays are actually rendered. `caseStudies`
  in `content.ts` overlaps with Sanity — if the live portfolio reads from Sanity, the
  hardcoded array is removed rather than translated. `clients`/`packages` usage to be
  verified during Phase 3 and only translated if live.

### `NAV_LINKS` / `FOOTER_LINKS` / `SITE`

These currently call `t()` at module load. They become **functions of locale** (e.g.
`getNavLinks(t)` or built inline in the header/footer from message keys + routing
`pathnames`), so labels and hrefs are correct per locale. `SITE.tagline`/`description`
become message keys; `SITE.name`, URLs, emails, socials stay static.

### SEO

- `lib/seo.ts` `constructMetadata`, `organizationSchema`, `websiteSchema` take a `locale`
  param; move metadata into per-route `generateMetadata` using localized title/description.
- **hreflang**: each page emits `alternates.languages` linking the HR and EN URLs (+
  `x-default` → HR). next-intl provides the URL resolution.
- **canonical**: self-referential per locale.
- **sitemap**: `app/sitemap.ts` emits both locales' URLs with `alternates`.
- JSON-LD localized where it contains prose.

### Sanity localization

- Schemas `sanity/schemaTypes/caseStudy.ts` and `videoAd.ts`: convert text fields
  (title, excerpt/description, problem, approach, results, body, category, tags-as-labels)
  to **field-level internationalized arrays** via `@sanity/internationalized-array`
  (one document, per-language field values). Non-text fields (images, slug, year, featured,
  order) stay single. Slug: keep one canonical slug, or add a per-locale slug field —
  **decision: single shared slug** for v1 to avoid dynamic-route slug divergence
  (portfolio detail URL differs only by `/en` prefix, not the `[slug]`).
- Install & register `@sanity/internationalized-array` in `sanity.config.ts` with
  `languages: [{id:'hr',title:'Croatian'},{id:'en',title:'English'}]`.
- GROQ queries in `sanity/lib/queries.ts` project the active-locale value with HR fallback
  (`coalesce(field[_key=="en"].value, field[_key=="hr"].value)`), parameterized by locale.
- Leo re-enters English content in the Studio after schema ships (content entry is a Leo
  task, not code).

### Language toggle (UX)

- A HR/EN control beside the theme toggle in `components/layout/header.tsx`, and in
  `components/layout/mobile-nav.tsx`.
- Uses next-intl `usePathname`/`useRouter` to switch to **the same page in the other
  locale** (preserving the current route + params), not a blanket redirect home.
- Selected locale persisted via next-intl's `NEXT_LOCALE` cookie (handled by middleware).
- Presentation: compact `HR | EN` text switch (matches the existing minimalist toggle
  styling); shows the current locale as active. Exact visual finalized during Phase 1
  against the existing header design system.

---

## Touch surface (components calling `t`/`ta` or `NAV_LINKS`)

Header, footer, mobile-nav; sections: hero, services, capabilities, cta, faq, process,
works-gallery (+ hardcoded empty-state string), testimonials; pages: home, usluge, radovi,
radovi/[slug], o-nama, kontakt, privatnost; `lib/constants.ts`, `lib/seo.ts`,
`lib/content.ts`. Two known hardcoded strings move into messages: hero services tagline
(`hero.tsx`) and works-gallery empty state.

---

## Phasing

Each phase is independently shippable. The site stays live in Croatian throughout; English
becomes reachable only once Phase 2 lands (before that, `/en` can be soft-disabled or show
HR fallback).

1. **Infra + toggle** — install next-intl; add routing/request/middleware; move routes under
   `app/[locale]/`; translated `pathnames`; migrate all `t()` call sites to next-intl;
   generate `messages/hr.json` from `hr.ts`; add the header/mobile toggle; dynamic `<html
   lang>` + Cookiebot culture. Outcome: identical HR site, now bilingual-capable, `/en`
   renders HR-fallback strings.
2. **English UI strings** — author `messages/en.json` (Claude draft → Leo review).
3. **English static content** — localize `content.ts` arrays (services, faqs, testimonials,
   process, team, tooling, packages/clients if live); audit & drop dead arrays.
4. **Sanity localization** — schema i18n fields, config registration, GROQ locale
   projection, portfolio wiring; Leo enters EN CMS content.
5. **SEO polish** — per-locale metadata/`generateMetadata`, hreflang + x-default, canonical,
   localized sitemap, localized JSON-LD.

## Non-goals (v1)

- Auto-translating on the fly / machine-translation at runtime (all copy is authored).
- Per-locale distinct Sanity slugs (single shared slug in v1).
- Locale-specific pricing/currency logic beyond text.
- RTL languages (both locales are LTR).

## Risks / watch-items

- **Middleware matcher** must exclude `/studio` and `/api` or the CMS/API breaks.
- **Contact API** (`app/api/contact`) validation/response strings: decide whether errors are
  localized (client passes locale) or kept neutral — resolve in Phase 1/2.
- **Third-party widgets**: Chatbase and Cookiebot are HR-configured; confirm acceptable EN
  behavior (Cookiebot culture is switched; Chatbase language config to verify).
- **content.ts dead-data audit** must happen before translating to avoid translating unused
  arrays (notably the hardcoded `caseStudies` vs Sanity).
- Large mechanical migration (many `t()` call sites) — do it in one pass per Phase 1 to
  avoid a half-migrated tree.
