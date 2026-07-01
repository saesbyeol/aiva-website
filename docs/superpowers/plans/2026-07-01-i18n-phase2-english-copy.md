# i18n Phase 2: English Copy (UI strings + static content) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make clicking the `EN` toggle show a fully English site — author real English for all UI strings (`messages/en.json`) and the rendered static content (`content.ts` arrays), and fix the privacy-page key structure that would otherwise leak Croatian labels.

**Architecture:** `messages/en.json` gets real English values (keys unchanged, `messages/hr.json` untouched). Static content becomes locale-aware via a new `lib/content.en.ts` (English data) selected through `getContent(locale)`; the seven rendering consumers switch from importing HR arrays directly to `getContent(locale)`. Case studies / video ads (Sanity + its `content.ts` fallback) stay Croatian — they are Phase 4. Before translating the privacy section, its label-stripping keys are restructured so no `.replace("<Croatian>")` remains.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, next-intl 4.13.1, Playwright.

## Global Constraints

- **`messages/hr.json` is FROZEN** — do not change any Croatian value or key. Only `messages/en.json` values change.
- **Keys are identical across locales.** Never rename, add, remove, or reorder keys in `en.json` relative to `hr.json` (except where Task 1 restructures keys in BOTH files identically).
- **Preserve every interpolation placeholder verbatim:** `{mode}`, `{name}`, `{url}`. If a Croatian value contains one, the English value must contain the same token, unchanged.
- **Do NOT translate:** the brand name `Aiva`; proper nouns / person names; tech/product names (`n8n`, `Make`, `Zapier`, `OpenAI GPT-4o`, `Anthropic Claude`, `Mistral`, `LangChain`, `Next.js`, `React`, `TypeScript`, `AWS`, `GCP`, `Vercel`, `Docker`, `PostgreSQL`, etc.); email addresses; URLs; social handles; image/asset paths; CSS color tokens; `id`/`slug` values.
- **Translation quality:** natural, professional marketing English for an AI-automation agency — not word-for-word. Croatian formal "vi/vaš" → professional English "you/your". Keep it concise and benefit-oriented; match the Croatian meaning and tone, don't embellish.
- **Locale-neutral fields are duplicated, not translated:** in `content.en.ts`, fields like `image`, `color`, `icon`, `slug`, `linkedin`, `avatar`, `logo`, numeric ids stay byte-identical to `content.ts`.
- **Out of scope (leave Croatian):** `caseStudies`, `adShowcase` (Phase 4 / Sanity), `packages` (unused — not rendered), any Sanity CMS content.
- **Verification tooling (this repo has no unit runner):** `npx tsc --noEmit`, `npm run build`, `npm test` (Playwright), and targeted `node`/`npx tsx` one-liners. Use these — do not add jest/vitest.
- **Commit after every task**, message ending exactly with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- The dev/prod site must remain fully working in Croatian throughout (HR is the default, prefix-free locale).

---

## File Structure

**Modified:**
- `messages/en.json` — real English (Task 2).
- `messages/hr.json` + `messages/en.json` — privacy key restructure only (Task 1, identical structural change in both).
- `app/[locale]/privatnost/page.tsx` — render restructured privacy keys without `.replace()` (Task 1).
- 7 content consumers → `getContent(locale)` (Task 4): `app/[locale]/usluge/page.tsx`, `app/[locale]/o-nama/page.tsx`, `components/sections/services.tsx`, `components/sections/process.tsx`, `components/sections/testimonials.tsx`, `components/sections/faq.tsx`, `components/sections/clients.tsx`.
- `tests/*` — English-render coverage (Task 5).

**Created:**
- `lib/content.en.ts` — English versions of `services, process, testimonials, faqs, teamMembers, toolingStack, clients`; re-exports `caseStudies, adShowcase, packages` from `./content` unchanged (Task 3).
- `lib/content-i18n.ts` — `getContent(locale)` selector (Task 3).
- `tests/i18n-english.spec.ts` — asserts `/en` renders English UI + content (Task 5).

**Frozen:** `lib/content.ts` (the HR source) is not edited except that Task 3 may add nothing to it — consumers stop importing from it directly where translated. `components/sections/work.tsx` (case studies → Phase 4) and `app/sitemap.ts` (uses only locale-neutral slugs) are NOT changed.

---

## Task 1: Restructure privacy label/body keys (fix the Phase-2 landmine)

**Files:**
- Modify: `messages/hr.json`, `messages/en.json` (identical structural change), `app/[locale]/privatnost/page.tsx`

**Interfaces:**
- Produces: new keys `privacy.s2FormLabel`/`privacy.s2FormBody`, `privacy.s2AnalyticsLabel`/`privacy.s2AnalyticsBody`, `privacy.s2CookiesLabel`/`privacy.s2CookiesBody`. Removes `privacy.s2Form`, `privacy.s2Analytics`, `privacy.s2Cookies`.

Context: `privatnost/page.tsx` currently does `t("privacy.s2Form").replace("Podaci obrasca za kontakt: ", "")` (and s2Analytics/"Analitika: ", s2Cookies/"Kolačići: "). Once `en.json` is English, those literal Croatian `.replace()` targets won't match and the label text leaks into the body. Fix by splitting each into a label key and a body key. (The `s1Body` `.split("{url}")` at line 25 is placeholder-based and stays as-is.)

- [ ] **Step 1: Read the current values and the render block**

Read `app/[locale]/privatnost/page.tsx` around lines 55–70 and the three `privacy.s2*` values in `messages/hr.json`. Each Croatian value has the shape `"<Label>: <body...>"` (e.g. `"Podaci obrasca za kontakt: <body>"`).

- [ ] **Step 2: Split the keys in `messages/hr.json`**

For each of the three, replace the single key with two keys, splitting the existing Croatian string at the first `": "`. Example (use the ACTUAL current body text from the file, not this placeholder body):

```json
"s2FormLabel": "Podaci obrasca za kontakt",
"s2FormBody": "<the exact Croatian text that followed 'Podaci obrasca za kontakt: '>",
"s2AnalyticsLabel": "Analitika",
"s2AnalyticsBody": "<exact Croatian text after 'Analitika: '>",
"s2CookiesLabel": "Kolačići",
"s2CookiesBody": "<exact Croatian text after 'Kolačići: '>",
```
Remove the old `s2Form`, `s2Analytics`, `s2Cookies` keys. Keep all other privacy keys untouched.

- [ ] **Step 3: Mirror the exact same keys in `messages/en.json`**

Apply the identical structural split in `en.json`. Since `en.json` is currently a Croatian copy, the values are the same Croatian strings — split them the same way. (English translation happens in Task 2; here only the STRUCTURE changes, in lock-step with hr.json.)

- [ ] **Step 4: Update `privatnost/page.tsx` to render label + body without `.replace()`**

Replace the three `.replace(...)` renders. Preserve the existing visual structure (label styling + body). For example, if the current markup renders the label in bold followed by body, produce:

```tsx
<p>
  <strong>{t("privacy.s2FormLabel")}:</strong> {t("privacy.s2FormBody")}
</p>
```
Do the same for Analytics and Cookies. Match the surrounding markup/classes already in the file — do not restyle. Leave the `s1Parts = t("privacy.s1Body").split("{url}")` logic unchanged.

- [ ] **Step 5: Verify HR privacy page is textually unchanged + typechecks/builds**

Run: `npx tsc --noEmit` → clean.
Run: `npm run build` → passes.
Start the dev server and confirm `/privatnost` renders the same visible text as before (label + body reading identically to the pre-change page). Command to spot-check the rendered section 2 text:
`curl -s http://localhost:3000/privatnost | grep -o 'Podaci obrasca za kontakt[^<]*' | head -1`
Expected: the label followed by its body, with no doubled/leaked prefix.

- [ ] **Step 6: Commit**

```bash
git add messages/hr.json messages/en.json "app/[locale]/privatnost/page.tsx"
git commit -m "refactor(i18n): split privacy label/body keys to remove literal .replace()

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Translate `messages/en.json` to English

**Files:**
- Modify: `messages/en.json` (values only)

**Interfaces:**
- Consumes: the key structure from Task 1 (the new `privacy.s2*Label`/`Body` keys must exist).
- Produces: English UI everywhere strings come from the message catalog.

- [ ] **Step 1: Confirm en.json key parity with hr.json before starting**

Run: `npx tsx -e "import hr from './messages/hr.json'; import en from './messages/en.json'; const keys=(o,p='')=>Object.entries(o).flatMap(([k,v])=>v&&typeof v==='object'&&!Array.isArray(v)?keys(v,p+k+'.'):[p+k]); const a=keys(hr).sort(), b=keys(en).sort(); console.log(JSON.stringify(a)===JSON.stringify(b)?'keys match':'KEY MISMATCH')"`
Expected: `keys match`. If not, reconcile en.json's key set to hr.json's before translating (do not translate against a divergent structure).

- [ ] **Step 2: Translate every value in `messages/en.json` to English**

Go section by section (`site`, `nav`, `footer`, `hero`, `services`, `contact`, `form`, `privacy`, `about`, `faq`, `cta`, `work`, `testimonials`, `capabilities`, `process`, `caseStudy`, `workPage`, `servicesPage`, `notFound`, `common`, `a11y`, etc.). For each string and each array element, write natural professional English per the Global Constraints. Preserve `{mode}`/`{name}`/`{url}` tokens exactly. Keep array lengths identical. Do not touch keys. Do not touch `messages/hr.json`.

Spot examples (illustrative — apply judgment across all keys):
- `nav.services` `"Usluge"` → `"Services"`; `nav.work` `"Radovi"` → `"Work"`; `nav.about` `"O nama"` → `"About"`; `nav.contact` `"Kontakt"` → `"Contact"`.
- `form.submit` `"Pošalji poruku"` → `"Send message"`.
- `footer.terms` `"Uvjeti korištenja"` → `"Terms of use"`.
- `notFound.title` `"Stranica nije pronađena"` → `"Page not found"`.
- `work.emptyCategory` `"Još nema sadržaja u ovoj kategoriji."` → `"No content in this category yet."`
- Keep proper/brand/tech terms as-is per constraints.

- [ ] **Step 3: Verify JSON validity, key parity, and placeholder preservation**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('valid json')"` → `valid json`.
Re-run the Step 1 key-parity check → `keys match`.
Run: `npx tsx -e "import hr from './messages/hr.json'; import en from './messages/en.json'; const ph=s=>[...String(s).matchAll(/\{[a-zA-Z0-9_]+\}/g)].map(m=>m[0]).sort().join(','); const walk=(a,b,p='')=>{for(const k in a){const va=a[k],vb=b[k]; if(va&&typeof va==='object'){walk(va,vb,p+k+'.')}else if(ph(va)!==ph(vb)){throw new Error('placeholder mismatch at '+p+k+': hr='+ph(va)+' en='+ph(vb))}}}; walk(hr,en); console.log('placeholders preserved')"` → `placeholders preserved`. Fix any mismatch before continuing.

- [ ] **Step 4: Confirm English actually renders on /en**

Run: `npx tsc --noEmit && npm run build`, start the server, then:
`curl -s http://localhost:3000/en | grep -oiE '>(Services|Work|About|Contact)<' | sort -u`
Expected: the English nav labels appear (not `Usluge`/`Radovi`/…).
`curl -s http://localhost:3000/ | grep -oiE '>(Usluge|Radovi)<' | head -1` → Croatian still on `/` (hr.json untouched).

- [ ] **Step 5: Commit**

```bash
git add messages/en.json
git commit -m "feat(i18n): author English UI strings in messages/en.json

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: English content module + `getContent(locale)` selector

**Files:**
- Create: `lib/content.en.ts`, `lib/content-i18n.ts`

**Interfaces:**
- Consumes: the shapes exported by `lib/content.ts`.
- Produces: `getContent(locale: string)` returning an object namespace with the SAME export names as `lib/content.ts` (`services, process, testimonials, faqs, teamMembers, toolingStack, clients, caseStudies, adShowcase, packages`), English data for the translated arrays when `locale === 'en'`, Croatian otherwise.

- [ ] **Step 1: Create `lib/content.en.ts` with English translations**

Mirror the exact TypeScript shape of each translated array in `lib/content.ts` (`services, process, testimonials, faqs, teamMembers, toolingStack, clients`), with English `title`/`shortDescription`/`description`/`outcomes`/`deliverables`/`timeline`/`quote`/`role`/`bio`/`question`/`answer`/`category`/`step`-title text. Keep locale-neutral fields (`id`, `icon`, `color`, `image`, `avatar`, `logo`, `linkedin`, numeric ids, `slug`) byte-identical to `content.ts`. Then re-export the out-of-scope arrays unchanged:

```ts
export { caseStudies, adShowcase, packages } from "./content";
```
Translate `toolingStack` category labels (e.g. `"Automatizacija"`→`"Automation"`, `"Infrastruktura"`→`"Infrastructure"`, `"Observabilnost"`→`"Observability"`); leave the tool `items` (product names) as-is. `clients` is company names + logo paths — copy unchanged (names are proper nouns).

- [ ] **Step 2: Create `lib/content-i18n.ts` selector**

```ts
import * as hr from "./content";
import * as en from "./content.en";

export function getContent(locale: string) {
  return locale === "en" ? en : hr;
}
```

- [ ] **Step 3: Verify parity + English values via tsx**

Run: `npx tsc --noEmit` → clean (this also proves `content.en.ts` matches the types used by `content.ts`).
Run: `npx tsx -e "import {getContent} from './lib/content-i18n'; const hr=getContent('hr'), en=getContent('en'); const shapeOk=hr.services.length===en.services.length && hr.faqs.length===en.faqs.length && hr.testimonials.length===en.testimonials.length; if(!shapeOk) throw new Error('array length mismatch'); if(en.services[0].title===hr.services[0].title) throw new Error('services[0] not translated'); if(en.faqs[0].question===hr.faqs[0].question) throw new Error('faqs[0] not translated'); if(en.services[0].image!==hr.services[0].image) throw new Error('neutral field image should be identical'); console.log('content selector ok')"`
Expected: `content selector ok`. (Confirms same lengths, translated text, and neutral fields preserved.)

- [ ] **Step 4: Commit**

```bash
git add lib/content.en.ts lib/content-i18n.ts
git commit -m "feat(i18n): add English content.en.ts and getContent(locale) selector

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Wire content consumers to `getContent(locale)`

**Files:**
- Modify: `app/[locale]/usluge/page.tsx`, `app/[locale]/o-nama/page.tsx`, `components/sections/services.tsx`, `components/sections/process.tsx`, `components/sections/testimonials.tsx`, `components/sections/faq.tsx`, `components/sections/clients.tsx`

**Interfaces:**
- Consumes: `getContent(locale)` from `@/lib/content-i18n`; `getLocale` from `next-intl/server` (server components); `useLocale` from `next-intl` (client components).

- [ ] **Step 1: Update the SERVER components/pages**

For `app/[locale]/usluge/page.tsx` (already has `const { locale } = await params`): replace `import { services } from "@/lib/content"` with `import { getContent } from "@/lib/content-i18n"` and, after resolving `locale`, `const { services } = getContent(locale);`.
For `app/[locale]/o-nama/page.tsx` (has `locale`): `const { teamMembers, toolingStack } = getContent(locale);` (drop the direct `@/lib/content` import).
For `components/sections/faq.tsx` and `components/sections/clients.tsx` (server section components without a `locale` prop): add `import { getLocale } from "next-intl/server";`, make the component `async` if it isn't, `const locale = await getLocale();`, then `const { faqs } = getContent(locale);` / `const { clients } = getContent(locale);`.

- [ ] **Step 2: Update the CLIENT components**

For `components/sections/services.tsx`, `process.tsx`, `testimonials.tsx` (each has `"use client"`): add `import { useLocale } from "next-intl";` and `import { getContent } from "@/lib/content-i18n";`, remove the direct `@/lib/content` import of the translated array, then inside the component: `const locale = useLocale(); const { services } = getContent(locale);` (respectively `process`, `testimonials`). Keep the local variable name the component already uses (e.g. `process.tsx` aliases to `processSteps` — preserve that: `const { process: processSteps } = getContent(locale);`).

- [ ] **Step 3: Verify HR unchanged, EN localized, build + suite green**

Run: `npx tsc --noEmit && npm run build` → both pass.
Start the server and check:
`curl -s http://localhost:3000/usluge | grep -c "Automatizacija"` → still Croatian on HR (>0).
`curl -s http://localhost:3000/en/services | grep -ci "automation"` → English on EN (>0), and `curl -s http://localhost:3000/en/services | grep -c "Automatizacija"` → `0` (no Croatian leaking on EN services page).
`curl -s http://localhost:3000/en | grep -ci "<one distinctive English FAQ or testimonial word you translated>"` → present.
Run: `npm test` → full suite green (35 passed / 1 skipped baseline; must not regress).

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/usluge/page.tsx" "app/[locale]/o-nama/page.tsx" components/sections/services.tsx components/sections/process.tsx components/sections/testimonials.tsx components/sections/faq.tsx components/sections/clients.tsx
git commit -m "feat(i18n): render locale-aware static content via getContent(locale)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: E2E coverage for English rendering

**Files:**
- Create: `tests/i18n-english.spec.ts`
- Reference: `playwright.config.ts`, existing `tests/i18n-routing.spec.ts`

**Interfaces:**
- Consumes: the running server per `playwright.config.ts`.

- [ ] **Step 1: Write English-render tests**

```ts
import { test, expect } from "@playwright/test";

test("EN homepage shows English navigation", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("header")).toContainText("Services");
  await expect(page.locator("header")).toContainText("Contact");
});

test("EN services page shows English service content, no Croatian leak", async ({ page }) => {
  await page.goto("/en/services");
  const body = page.locator("body");
  await expect(body).toContainText(/automation/i);
  await expect(body).not.toContainText("Automatizacija");
});

test("HR services page stays Croatian", async ({ page }) => {
  await page.goto("/usluge");
  await expect(page.locator("body")).toContainText("Automatizacija");
});

test("EN 404 shows English heading", async ({ page }) => {
  await page.goto("/en/this-does-not-exist");
  await expect(page.locator("h1")).toContainText(/not found/i);
});
```
Note: if `not-found.tsx` renders with the default locale (Croatian) for unmatched `/en/*` paths, adjust the last test to assert the actual rendered heading — verify by loading the route first and matching what the app really renders (do not assert a string the app doesn't produce).

- [ ] **Step 2: Run the new tests**

Run: `npm test -- tests/i18n-english.spec.ts`
Expected: PASS on all projects. If "no Croatian leak" fails, a consumer was missed in Task 4 — fix it before continuing (do not weaken the assertion).

- [ ] **Step 3: Full regression**

Run: `npm test`
Expected: green (previous 35 passed / 1 skipped + the new tests; 0 failures).

- [ ] **Step 4: Commit**

```bash
git add tests/i18n-english.spec.ts
git commit -m "test(i18n): assert English UI + content render on /en

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Definition of Done

- Clicking `EN` (or visiting `/en...`) shows a fully English site: nav, hero, forms, FAQ, privacy, services, process, testimonials, team, tooling categories.
- `/` and all HR routes render identical Croatian to before (hr.json + content.ts frozen).
- No Croatian leaks on translated EN pages; placeholders `{mode}`/`{name}`/`{url}` intact; key parity holds.
- Privacy page renders label+body correctly with no `.replace("<Croatian>")` calls left.
- `npx tsc --noEmit`, `npm run build`, and `npm test` all green.

## Explicitly deferred (later phases)
- Case studies / video ads text (`caseStudies`, `adShowcase`, Sanity) → **Phase 4**.
- hreflang / canonical / per-locale metadata & sitemap → **Phase 5**.
- `works-gallery.tsx` unlocalized `next/link` + hardcoded Croatian section copy → tracked (Phase 3/works pass).
- `packages` array is unused; not translated.
