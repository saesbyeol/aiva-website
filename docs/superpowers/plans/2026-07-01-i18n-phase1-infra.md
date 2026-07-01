# i18n Phase 1: Infrastructure + Language Toggle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the site from the hand-rolled `t()` dictionary to `next-intl` with locale-prefixed routing (HR default, `/en` for English), translated slugs, and an in-header HR/EN toggle — while the visible site stays byte-for-byte Croatian.

**Architecture:** Introduce `next-intl` routing (`i18n/routing.ts` + `i18n/navigation.ts` + `i18n/request.ts` + `middleware.ts`), move all public routes under `app/[locale]/`, convert `messages/hr.json` from the existing `lib/i18n/hr.ts`, and replace every `t()`/`ta()` call site with next-intl equivalents (`useTranslations` in client components, `getTranslations`/`t.raw` in server components). English is reachable at `/en/*` but falls back to Croatian message values until Phase 2.

**Tech Stack:** Next.js 16.1.6 (App Router), React 19.2.3, TypeScript 5, `next-intl` (latest), Playwright (e2e), Sanity (untouched this phase).

## Global Constraints

- **Locales:** `['hr', 'en']`; `defaultLocale = 'hr'`; `localePrefix: 'as-needed'` (HR is prefix-free, EN prefixed `/en`). Copy these values verbatim.
- **Translated pathnames (public URL per locale):**
  - `/` → shared
  - `/usluge` (hr) ↔ `/en/services`
  - `/radovi` (hr) ↔ `/en/work`
  - `/radovi/[slug]` (hr) ↔ `/en/work/[slug]`
  - `/o-nama` (hr) ↔ `/en/about`
  - `/kontakt` (hr) ↔ `/en/contact`
  - `/privatnost` (hr) ↔ `/en/privacy`
- **Must stay OUT of locale routing / middleware matcher:** `/studio`, `/api`, `/_next`, `/_vercel`, and any path containing a `.` (static files).
- **No visible Croatian text may change.** `messages/hr.json` values are copied verbatim from `lib/i18n/hr.ts`.
- **Verification tooling:** `npm run build` (must pass), `npx tsc --noEmit` (must pass), `npm run lint`, `npm test` (Playwright).
- **Commit after every task.** End commit messages with the Co-Authored-By line already used in this repo.
- Confirm the exact `next-intl` App Router API against its current docs before coding Task 1 — method names below (`defineRouting`, `createNavigation`, `getRequestConfig`, `createMiddleware`, `createNextIntlPlugin`, `setRequestLocale`, `NextIntlClientProvider`, `getMessages`, `getTranslations`, `useTranslations`) are the v4 surface; adjust if the installed version differs.

---

## File Structure (created / moved this phase)

**Created:**
- `i18n/routing.ts` — locales, defaultLocale, localePrefix, translated pathnames.
- `i18n/navigation.ts` — locale-aware `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`.
- `i18n/request.ts` — per-request message loading.
- `middleware.ts` — locale detection + prefixing, with exclusion matcher.
- `messages/hr.json` — Croatian messages (converted from `lib/i18n/hr.ts`).
- `messages/en.json` — English messages **as a copy of HR for now** (Phase 2 replaces values).
- `components/layout/locale-toggle.tsx` — the HR/EN switch.
- `tests/i18n-routing.spec.ts`, `tests/locale-toggle.spec.ts` — Playwright e2e.

**Moved (into `app/[locale]/`):** `layout.tsx`, `page.tsx`, `usluge/`, `radovi/` (incl. `[slug]/`), `o-nama/`, `kontakt/`, `privatnost/`. **Unmoved:** `app/studio/`, `app/api/`, plus a slim root passthrough if next-intl requires it.

**Modified:** `next.config.ts`, `lib/constants.ts`, `components/layout/header.tsx`, `components/layout/mobile-nav.tsx`, and every component/page calling `t()`/`ta()` (enumerated in Task 6).

**Removed at the end:** `lib/i18n/index.ts` `t`/`ta` exports (Task 9), once no call sites remain.

---

## Task 1: Install next-intl and define routing

**Files:**
- Create: `i18n/routing.ts`, `i18n/navigation.ts`
- Modify: `package.json` (dependency), `next.config.ts`

**Interfaces:**
- Produces: `routing` (from `i18n/routing.ts`) with `locales`, `defaultLocale`, `localePrefix`, `pathnames`. `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` (from `i18n/navigation.ts`).

- [ ] **Step 1: Install next-intl**

Run: `npm install next-intl`
Expected: adds `next-intl` to `dependencies`, no peer-dep errors against Next 16 / React 19.

- [ ] **Step 2: Create `i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hr", "en"],
  defaultLocale: "hr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/usluge": { hr: "/usluge", en: "/services" },
    "/radovi": { hr: "/radovi", en: "/work" },
    "/radovi/[slug]": { hr: "/radovi/[slug]", en: "/work/[slug]" },
    "/o-nama": { hr: "/o-nama", en: "/about" },
    "/kontakt": { hr: "/kontakt", en: "/contact" },
    "/privatnost": { hr: "/privatnost", en: "/privacy" },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
```

Note: internal (physical) route keys stay Croatian; `pathnames` maps the public URL per locale.

- [ ] **Step 3: Create `i18n/navigation.ts`**

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 4: Wire the next-intl plugin in `next.config.ts`**

Wrap the existing exported config. Preserve all current config (image remotePatterns, etc.):

```ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// ...existing `const nextConfig = { ... }` unchanged...

export default withNextIntl(nextConfig);
```

(If `next.config.ts` currently `export default nextConfig`, change only that final line.)

- [ ] **Step 5: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (note: `i18n/request.ts` is referenced by the plugin but created in Task 2 — if the build complains about the missing file, proceed to Task 2 before running a full build; `tsc` alone should pass).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json i18n/routing.ts i18n/navigation.ts next.config.ts
git commit -m "feat(i18n): install next-intl, add routing + navigation config

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Convert HR dictionary to messages + request config

**Files:**
- Create: `messages/hr.json`, `messages/en.json`, `i18n/request.ts`
- Reference: `lib/i18n/hr.ts` (source of truth for values)

**Interfaces:**
- Produces: `messages/{locale}.json` loadable by key path (`nav.services`, etc.); `default` export from `i18n/request.ts` consumed by the plugin.

- [ ] **Step 1: Generate `messages/hr.json` from `lib/i18n/hr.ts`**

Convert the `hr` dictionary object in `lib/i18n/hr.ts` to JSON verbatim (same nested keys and string values, including arrays). Write it to `messages/hr.json`. Do not edit any Croatian text. Preserve nesting exactly so existing dot-path keys (`nav.services`, `form.budgetOptions.under10k`) resolve unchanged.

- [ ] **Step 2: Create `messages/en.json` as a copy of HR**

Copy `messages/hr.json` to `messages/en.json` unchanged. English values are authored in Phase 2; until then EN renders Croatian strings (acceptable per spec).

- [ ] **Step 3: Create `i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Verify messages parse**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/hr.json','utf8')); JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('ok')"`
Expected: prints `ok` (both files are valid JSON).

- [ ] **Step 5: Verify key parity with the old dictionary**

Spot-check that a sample of keys used in the app resolve. Run:
`node -e "const m=require('./messages/hr.json'); const g=(o,k)=>k.split('.').reduce((a,p)=>a&&a[p],o); ['nav.services','form.submit','hero.eyebrow','privacy.title'].forEach(k=>{const v=g(m,k); if(typeof v!=='string'){throw new Error('missing '+k)} }); console.log('keys ok')"`
Expected: prints `keys ok`. If any key throws, the JSON conversion dropped it — fix before continuing.

- [ ] **Step 6: Commit**

```bash
git add messages/hr.json messages/en.json i18n/request.ts
git commit -m "feat(i18n): add hr/en message catalogs and request config

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Middleware with exclusion matcher

**Files:**
- Create: `middleware.ts`

**Interfaces:**
- Consumes: `routing` from `i18n/routing.ts`.
- Produces: request-time locale detection; internal rewrite so HR stays prefix-free.

- [ ] **Step 1: Create `middleware.ts`**

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match everything except /studio, /api, Next internals, and files with a dot.
  matcher: ["/((?!studio|api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 2: Verify the matcher regex excludes Studio and API**

Run: `node -e "const re=new RegExp('^/((?!studio|api|_next|_vercel|.*\\\\..*).*)$'); const t=(p,exp)=>{const got=re.test(p); if(got!==exp)throw new Error(p+' expected '+exp+' got '+got)}; t('/',true); t('/usluge',true); t('/en/services',true); t('/studio',false); t('/studio/desk',false); t('/api/contact',false); t('/favicon.ico',false); t('/_next/static/x.js',false); console.log('matcher ok')"`
Expected: prints `matcher ok`.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(i18n): add locale middleware excluding studio/api/static

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Restructure routes under `app/[locale]/`

**Files:**
- Move: `app/layout.tsx`, `app/page.tsx`, `app/usluge/`, `app/radovi/` (incl. `[slug]/`), `app/o-nama/`, `app/kontakt/`, `app/privatnost/` → under `app/[locale]/`
- Keep in place: `app/studio/`, `app/api/`
- Modify: the moved `layout.tsx`

**Interfaces:**
- Consumes: `routing.locales`, `getMessages`, `setRequestLocale`, `NextIntlClientProvider`.
- Produces: per-locale layout that sets `<html lang>` and provides messages to client components.

- [ ] **Step 1: Move the route folders**

```bash
mkdir -p app/[locale]
git mv app/layout.tsx "app/[locale]/layout.tsx"
git mv app/page.tsx "app/[locale]/page.tsx"
git mv app/usluge "app/[locale]/usluge"
git mv app/radovi "app/[locale]/radovi"
git mv app/o-nama "app/[locale]/o-nama"
git mv app/kontakt "app/[locale]/kontakt"
git mv app/privatnost "app/[locale]/privatnost"
```

Leave `app/studio` and `app/api` where they are. Do not move `app/sitemap.ts`/`robots.ts` if present (Phase 5 handles locale sitemaps).

- [ ] **Step 2: Update the moved `app/[locale]/layout.tsx`**

Add the `locale` param, `generateStaticParams`, `setRequestLocale`, dynamic `<html lang>`, Cookiebot culture, and `NextIntlClientProvider`. Keep every existing element (fonts, Cookiebot/Plausible/Chatbase scripts, JSON-LD, `SiteShell`). Replace the signature and `<html>`:

```tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {cookiebotId && (
          <script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={cookiebotId}
            data-blockingmode="auto"
            data-culture={locale.toUpperCase()}
            type="text/javascript"
            async
          />
        )}
        {/* keep both existing JSON-LD <script> blocks unchanged */}
      </head>
      <body className={`${syne.variable} ${inter.variable}`}>
        {/* keep existing Plausible + Chatbase <Script> blocks unchanged */}
        <NextIntlClientProvider messages={messages}>
          <SiteShell>{children}</SiteShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Keep the existing `metadata`/`viewport` exports and font declarations in this file for now (Phase 5 localizes metadata). Keep the `constructMetadata()` call as-is.

- [ ] **Step 3: Add `dynamicParams` guard for non-listed locales**

Ensure `app/[locale]/layout.tsx` (or a shared config) exports:

```tsx
export const dynamicParams = false;
```

so only `hr`/`en` are valid `[locale]` values.

- [ ] **Step 4: Verify build compiles the new tree**

Run: `npm run build`
Expected: PASS. Routes appear as `/[locale]/...`; `/studio` and `/api/contact` still build. If build fails on `t()` imports inside pages, that is expected until Task 6 — if so, run only up to typecheck here and complete the build verification at the end of Task 6. (Prefer to sequence Task 6 immediately after.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(i18n): move public routes under app/[locale], per-locale layout

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Make `lib/constants.ts` locale-aware

**Files:**
- Modify: `lib/constants.ts`

**Interfaces:**
- Consumes: message keys via a passed `t` function; `AppPathnames` route keys.
- Produces: `getNavLinks(t)`, `getFooterLinks(t)` returning `{ label, href }[]` where `href` is a routing pathname key (`"/usluge"`), not a raw string. `SITE` stays a static export (name/urls/socials); `SITE.tagline`/`SITE.description` become message keys referenced at call sites.

- [ ] **Step 1: Replace module-scope `t()` calls with functions**

`NAV_LINKS`/`FOOTER_LINKS` currently call `t()` at import (impossible under per-request locale). Convert to factories that take a translator and return **pathname keys** as hrefs so the locale-aware `Link` resolves the translated slug:

```ts
import type { useTranslations } from "next-intl";

type T = ReturnType<typeof useTranslations>;

export const SITE = {
  name: "Aiva",
  // Keep tagline/description here for now — lib/seo.ts (constructMetadata,
  // organizationSchema, websiteSchema) still reads them. Phase 5 moves these
  // into per-locale messages. Do NOT remove them this phase.
  tagline: "AI sustavi koji se isporučuju.",
  description:
    "Pomažemo tvrtkama da uvedu AI u svakodnevno poslovanje kroz automatizaciju marketinga, sadržaja i prodajnih procesa.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aiva.agency",
  email: "automation.aiva@gmail.com",
  instagram: "https://www.instagram.com/aiva.hr",
  facebook: "https://web.facebook.com/people/Aiva/61586583368219/",
} as const;

export function getNavLinks(t: T) {
  return [
    { label: t("nav.services"), href: "/usluge" as const },
    { label: t("nav.work"), href: "/radovi" as const },
    { label: t("nav.about"), href: "/o-nama" as const },
    { label: t("nav.contact"), href: "/kontakt" as const },
  ];
}

export function getFooterLinks(t: T) {
  return {
    company: [
      { label: t("nav.about"), href: "/o-nama" as const },
      { label: t("nav.work"), href: "/radovi" as const },
      { label: t("nav.services"), href: "/usluge" as const },
      { label: t("nav.contact"), href: "/kontakt" as const },
    ],
    legal: [
      { label: t("privacy.title"), href: "/privatnost" as const },
      { label: t("footer.terms"), href: "/privatnost#terms" as const },
    ],
    social: [
      { label: "Instagram", href: SITE.instagram },
      { label: "Facebook", href: SITE.facebook },
    ],
  };
}
```

Add a `footer.terms` key to both message files with the existing Croatian value `"Uvjeti korištenja"` (it was a hardcoded string in the old `FOOTER_LINKS`). Leave `SITE.tagline`/`SITE.description` on the `SITE` object as shown — they are still consumed by `lib/seo.ts` and get localized in Phase 5.

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: errors only at the (not-yet-updated) call sites in `header.tsx`/`footer.tsx` that still import `NAV_LINKS`. Those are fixed in Task 6/7. No errors originating inside `constants.ts` itself.

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts messages/hr.json messages/en.json
git commit -m "refactor(i18n): make nav/footer links locale-aware factories

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Migrate all `t()`/`ta()` call sites to next-intl

**Files (each imports from `@/lib/i18n` today — replace in every one):**
- Layout: `components/layout/header.tsx`, `components/layout/footer.tsx`, `components/layout/mobile-nav.tsx`
- Sections: `components/sections/hero.tsx`, `services.tsx`, `capabilities.tsx`, `cta.tsx`, `faq.tsx`, `process.tsx`, `works-gallery.tsx`, `testimonials.tsx` (and any other file under `components/sections/` importing from `@/lib/i18n`)
- Pages: `app/[locale]/page.tsx`, `app/[locale]/usluge/page.tsx`, `app/[locale]/radovi/page.tsx`, `app/[locale]/radovi/[slug]/page.tsx`, `app/[locale]/o-nama/page.tsx`, `app/[locale]/kontakt/page.tsx`, `app/[locale]/privatnost/page.tsx`

**Interfaces:**
- Consumes: `useTranslations`/`getTranslations` (strings), `.raw(key)` (arrays), locale-aware `Link` from `@/i18n/navigation`, `getNavLinks`/`getFooterLinks` from `@/lib/constants`.
- Produces: a tree with zero imports from `@/lib/i18n`.

- [ ] **Step 1: Find every call site**

Run: `grep -rln "@/lib/i18n" app components lib`
Expected: the list above. Treat the grep output as the authoritative worklist; migrate each file using the patterns in Steps 2–5.

- [ ] **Step 2: Client components (`"use client"`) — swap `t`/`ta`**

Pattern (apply to `header.tsx`, `mobile-nav.tsx`, and any client section):

```tsx
// remove: import { t } from "@/lib/i18n";
import { useTranslations } from "next-intl";
// inside component body:
const t = useTranslations();
// t("nav.services") calls stay identical.
// array access: replace ta<Foo[]>("some.key") with:
const items = t.raw("some.key") as Foo[];
```

For internal links in client components, replace `import Link from "next/link"` with `import { Link } from "@/i18n/navigation"`. `href` values become pathname keys (`"/usluge"`), which the locale-aware `Link` resolves to the right slug.

- [ ] **Step 3: Server components — swap to async `getTranslations`**

Pattern (apply to server pages/sections that are not `"use client"`):

```tsx
// remove: import { t } from "@/lib/i18n";
import { getTranslations } from "next-intl/server";
// make the component async if it isn't:
export default async function Page() {
  const t = await getTranslations();
  // t("...") identical; arrays via t.raw("...")
}
```

Also add `setRequestLocale(locale)` at the top of each `app/[locale]/**/page.tsx` that reads `params.locale`, so static rendering works:

```tsx
import { setRequestLocale } from "next-intl/server";
// ...
const { locale } = await params;
setRequestLocale(locale);
```

- [ ] **Step 4: Update `header.tsx` / `footer.tsx` to use the link factories**

Replace `import { NAV_LINKS } from "@/lib/constants"` with `import { getNavLinks } from "@/lib/constants"` and build inside the component: `const navLinks = getNavLinks(t);`. Same for `getFooterLinks(t)` in the footer. Iterate `navLinks` exactly as `NAV_LINKS` was iterated. Use the locale-aware `Link` from `@/i18n/navigation` for these hrefs.

- [ ] **Step 5: Move the two hardcoded strings into messages**

- `components/sections/hero.tsx`: the services tagline `"AI chatbotovi • Automatizacija marketinga • AI sadržaj • AI izrada web stranica"` → add key `hero.servicesTagline` (verbatim value) to both message files; render `t("hero.servicesTagline")`.
- `components/sections/works-gallery.tsx`: the empty state `"Još nema sadržaja u ovoj kategoriji."` → add key `work.emptyCategory` (verbatim) to both message files; render `t("work.emptyCategory")`.

- [ ] **Step 6: Confirm no stale imports remain**

Run: `grep -rln "@/lib/i18n" app components lib`
Expected: **no output** (all migrated).

- [ ] **Step 7: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(i18n): migrate all t()/ta() call sites to next-intl

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Language toggle component

**Files:**
- Create: `components/layout/locale-toggle.tsx`
- Modify: `components/layout/header.tsx`, `components/layout/mobile-nav.tsx`

**Interfaces:**
- Consumes: `useLocale` (next-intl), `usePathname`/`useRouter` from `@/i18n/navigation`, `routing.locales`.
- Produces: `<LocaleToggle />` rendering an `HR | EN` switch that navigates to the current route in the other locale.

- [ ] **Step 1: Create the toggle**

```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

export function LocaleToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  function switchTo(next: string) {
    if (next === locale) return;
    // Preserve dynamic params (e.g. [slug]) when switching locale.
    router.replace(
      // @ts-expect-error -- pathname is a typed route; params supplies [slug] when present
      { pathname, params },
      { locale: next }
    );
  }

  return (
    <div className={cn("flex items-center gap-1 text-sm font-medium", className)}>
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="text-fg-muted mx-1">|</span>}
          <button
            onClick={() => switchTo(loc)}
            aria-current={loc === locale ? "true" : undefined}
            className={cn(
              "uppercase transition-colors",
              loc === locale
                ? "text-fg"
                : "text-fg-secondary hover:text-fg"
            )}
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Render it in the header**

In `components/layout/header.tsx`, import `LocaleToggle` and place it in the actions `<div>` immediately before the theme toggle button (around the `{/* Theme toggle */}` block), hidden on mobile to match siblings:

```tsx
import { LocaleToggle } from "./locale-toggle";
// ...inside the actions div, before the theme toggle:
<LocaleToggle className="hidden md:flex" />
```

- [ ] **Step 3: Render it in the mobile nav**

In `components/layout/mobile-nav.tsx`, import and render `<LocaleToggle />` near the existing theme toggle control so mobile users can switch too.

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS. If the `router.replace({pathname, params})` typing fights the compiler, fall back to `router.replace(pathname, { locale: next })` for routes without params and handle `[slug]` via `getPathname`; keep the `@ts-expect-error` only if it genuinely suppresses a known-safe mismatch.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(i18n): add HR/EN language toggle to header and mobile nav

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: End-to-end tests (routing + toggle)

**Files:**
- Create: `tests/i18n-routing.spec.ts`, `tests/locale-toggle.spec.ts`
- Reference: `playwright.config.ts`, `tests/smoke.spec.ts` (for baseURL / patterns)

**Interfaces:**
- Consumes: the running dev/preview server per `playwright.config.ts`.

- [ ] **Step 1: Write routing tests**

```ts
import { test, expect } from "@playwright/test";

test("Croatian home renders without a locale prefix", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "hr");
});

test("English home is served under /en", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("Croatian services slug works", async ({ page }) => {
  const res = await page.goto("/usluge");
  expect(res?.status()).toBeLessThan(400);
});

test("English services uses the translated slug", async ({ page }) => {
  const res = await page.goto("/en/services");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("Studio stays outside locale routing", async ({ page }) => {
  const res = await page.goto("/studio");
  expect(res?.status()).toBeLessThan(400);
  await expect(page).toHaveURL(/\/studio/);
});
```

- [ ] **Step 2: Run routing tests to verify they fail if infra is wrong / pass now**

Run: `npm test -- tests/i18n-routing.spec.ts`
Expected: PASS (all five). If `/en/services` 404s, the `pathnames` map or middleware matcher is wrong — fix before continuing.

- [ ] **Step 3: Write toggle tests**

```ts
import { test, expect } from "@playwright/test";

test("toggle switches HR home to EN", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^en$/i }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/\/en/);
});

test("toggle preserves the current page when switching", async ({ page }) => {
  await page.goto("/usluge");
  await page.getByRole("button", { name: /^en$/i }).click();
  await expect(page).toHaveURL(/\/en\/services/);
});
```

- [ ] **Step 4: Run toggle tests**

Run: `npm test -- tests/locale-toggle.spec.ts`
Expected: PASS. If the second test lands on `/en` instead of `/en/services`, the toggle isn't preserving the route — revisit Task 7 Step 1.

- [ ] **Step 5: Full suite regression**

Run: `npm test`
Expected: PASS, including the pre-existing `tests/smoke.spec.ts`.

- [ ] **Step 6: Commit**

```bash
git add tests/i18n-routing.spec.ts tests/locale-toggle.spec.ts
git commit -m "test(i18n): e2e coverage for locale routing and toggle

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Remove the dead `t()`/`ta()` helpers

**Files:**
- Modify/Delete: `lib/i18n/index.ts`; keep `lib/i18n/hr.ts` only if still imported elsewhere (else delete).

**Interfaces:**
- Produces: no runtime dependence on the old dictionary helpers.

- [ ] **Step 1: Confirm nothing imports the old helpers**

Run: `grep -rln "from \"@/lib/i18n\"\|from './hr'\|from \"./hr\"" app components lib`
Expected: no output for `@/lib/i18n`. If `lib/i18n/hr.ts` is still imported anywhere, leave the file; otherwise it can be removed.

- [ ] **Step 2: Delete the helper module**

```bash
git rm lib/i18n/index.ts
# only if unused per Step 1:
# git rm lib/i18n/hr.ts
```

- [ ] **Step 3: Typecheck + build + full test**

Run: `npx tsc --noEmit && npm run build && npm test`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(i18n): remove legacy t()/ta() dictionary helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase 1 Definition of Done

- `/`, `/usluge`, `/radovi`, `/o-nama`, `/kontakt`, `/privatnost` render Croatian, prefix-free, visually unchanged.
- `/en`, `/en/services`, `/en/work`, `/en/about`, `/en/contact`, `/en/privacy` resolve (Croatian fallback text for now).
- `/studio` and `/api/contact` unaffected.
- Header + mobile nav show a working HR/EN toggle that preserves the current page.
- `npx tsc --noEmit`, `npm run build`, and `npm test` all pass; no imports of `@/lib/i18n` remain.

## Follow-up phases (separate plans)

- **Phase 2:** author `messages/en.json` (real English). Note the contact-API string localization decision (`app/api/contact`) — resolve there.
- **Phase 3:** localize `content.ts` arrays. **Important:** `caseStudies`/`adShowcase` in `content.ts` are the *live Sanity fallback* (`sanity/lib/queries.ts:3,97-114`), not dead data — localize, don't delete.
- **Phase 4:** Sanity field-level i18n (`@sanity/internationalized-array`) + GROQ locale projection with HR fallback.
- **Phase 5:** per-locale metadata/`generateMetadata`, hreflang + x-default, canonical, localized sitemap, localized JSON-LD.
