# P2 — Legal Completeness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the site into line with Croatian company-law disclosure (ZTD čl. 21), EU AI Act Art. 50 transparency, and the remaining accuracy gaps in the cookie inventory and privacy policy.

**Architecture:** All registry facts live in `lib/constants.ts` under `COMPANY`, extending the existing pattern, so they render identically in both locales and can never drift between HR and EN. A new `LegalInfo` component renders them in the footer. AI Act disclosure is copy, added to the existing message catalogs. Nothing here changes data flows — this phase makes the site say accurately what it already does.

**Tech Stack:** Next.js 16.3.5, next-intl v4, TypeScript, Tailwind v4, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-15-security-gdpr-audit.md`

## Global Constraints

- **Task 1 is a hard blocker for Task 2.** The MBS number, registering commercial court, share capital and board members are NOT known to anyone who has read this repository. They must come from the client or from the *sudski registar*. **Do not invent, infer, guess, or "use a plausible placeholder" for any of them.** A wrong MBS on a public page is a worse outcome than a missing one, and unlike a missing one it looks deliberate.
- **Croatian is the source language.** Every key added to `messages/hr.json` needs a matching key in `messages/en.json`.
- Registry facts belong in `lib/constants.ts` (`COMPANY`), never as literals in message catalogs — only *labels* are translated.
- P0 must be merged first: Task 4 edits `privacy.s8Groups`, which P0 Task 8 also touches.

---

### Task 1: Collect the company registry facts

**This task is not code.** It gathers the inputs Task 2 needs. Task 2 cannot start until every field below has a real value.

**Files:** none.

**Interfaces:**
- Produces: the values consumed by `COMPANY` in Task 2 — `mbs`, `court`, `shareCapital`, `shareCapitalPaid`, `boardMembers`.

- [ ] **Step 1: Look the company up in the court register**

Search `https://sudreg.pravosudje.hr` for OIB `33666234446` (MODELITY d.o.o.). Record verbatim:

| Field | Value |
|---|---|
| MBS (matični broj subjekta) | |
| Registering commercial court (Trgovački sud u …) | |
| Share capital (temeljni kapital) incl. currency | |
| Paid in full? (uplaćen u cijelosti) | |
| Board member(s) as registered (član/članovi uprave) | |

- [ ] **Step 2: Confirm the values with the client**

Have the values confirmed by someone at Modelity before they are published. The register is authoritative, but a transcription error published on the site is still a published error.

- [ ] **Step 3: Confirm the VAT position**

Establish whether Modelity is in the VAT system, and if so record the VAT number (`HR` + OIB). If it is not VAT-registered, record that explicitly — the footer should then say nothing about VAT rather than omitting it ambiguously.

- [ ] **Step 4: Gate**

Do not proceed to Task 2 until every row above has a value. If any field cannot be established, stop and raise it rather than shipping a partial block — a legally-mandated disclosure that is half present reads as carelessness rather than as a work in progress.

---

### Task 2: Add the legal-entity disclosure to the footer

ZTD čl. 21 requires a d.o.o. to state its full legal name, seat, registering court and MBS, and share capital with whether it is paid in full. Today `Modelity d.o.o.`, the address and the OIB appear only inside the privacy policy; MBS, court and capital appear nowhere.

**Files:**
- Modify: `lib/constants.ts`
- Create: `components/layout/legal-info.tsx`
- Modify: `components/layout/footer.tsx`
- Modify: `messages/hr.json`, `messages/en.json`
- Create: `tests/legal-disclosure.spec.ts`

**Interfaces:**
- Consumes: the values gathered in Task 1.
- Produces: `<LegalInfo />` — no props, rendered inside the footer.

- [ ] **Step 1: Write the failing test**

Create `tests/legal-disclosure.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

/**
 * ZTD čl. 21 requires a d.o.o. to state its legal name, seat, registering
 * court, MBS and share capital where it presents itself publicly. The footer
 * is the only element on every page, so that is where it belongs.
 */
test.describe("Legal entity disclosure", () => {
  for (const path of ["/", "/en"]) {
    test(`footer names the legal entity on ${path}`, async ({ page }) => {
      await page.goto(path);
      const footer = page.locator("footer");
      await expect(footer).toContainText("Modelity");
      await expect(footer).toContainText("33666234446"); // OIB
      await expect(footer).toContainText("Koprivnica");
    });
  }
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx playwright test tests/legal-disclosure.spec.ts --project=chromium
```

Expected: FAIL — the footer currently carries only the brand, an email and a copyright line.

- [ ] **Step 3: Extend `COMPANY` with the registry facts**

In `lib/constants.ts`, add to the `COMPANY` object, substituting the real values from Task 1:

```ts
  // Court-register facts, required on public-facing pages by ZTD čl. 21.
  // Sourced from sudreg.pravosudje.hr and confirmed with the client — see
  // docs/superpowers/plans/2026-09-15-p2-legal-completeness.md, Task 1.
  mbs: "<MBS from Task 1>",
  court: "<e.g. Trgovački sud u Varaždinu>",
  shareCapital: "<e.g. 2.500,00 EUR>",
  shareCapitalPaid: true,
  boardMembers: ["<name as registered>"],
```

If any value is still a placeholder at this point, **stop** — Task 1's gate was not met.

- [ ] **Step 4: Add the labels to both catalogs**

In `messages/hr.json`, add a `footer.legalInfo` object:

```json
"legalInfo": {
  "heading": "Podaci o tvrtki",
  "seat": "Sjedište",
  "oib": "OIB",
  "mbs": "MBS",
  "court": "Registarski sud",
  "capital": "Temeljni kapital",
  "capitalPaid": "uplaćen u cijelosti",
  "board": "Uprava"
}
```

and in `messages/en.json`:

```json
"legalInfo": {
  "heading": "Company details",
  "seat": "Registered office",
  "oib": "OIB (tax number)",
  "mbs": "Registration number (MBS)",
  "court": "Registry court",
  "capital": "Share capital",
  "capitalPaid": "paid in full",
  "board": "Management"
}
```

- [ ] **Step 5: Create the component**

Create `components/layout/legal-info.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { COMPANY } from "@/lib/constants";

/**
 * Company-register disclosure required of a d.o.o. by ZTD čl. 21.
 *
 * The values come from lib/constants rather than the message catalogs
 * because they are matters of public record, not copy: only the labels are
 * translated, so the OIB and MBS can never drift between HR and EN.
 */
export function LegalInfo() {
  const t = useTranslations("footer.legalInfo");

  const rows: Array<[string, string]> = [
    [t("seat"), `${COMPANY.street}, ${COMPANY.city}`],
    [t("oib"), COMPANY.oib],
    [t("mbs"), COMPANY.mbs],
    [t("court"), COMPANY.court],
    [
      t("capital"),
      COMPANY.shareCapitalPaid
        ? `${COMPANY.shareCapital} (${t("capitalPaid")})`
        : COMPANY.shareCapital,
    ],
    [t("board"), COMPANY.boardMembers.join(", ")],
  ];

  return (
    <div className="border-border mt-12 border-t pt-8">
      <p className="text-label text-fg-muted mb-3">{t("heading")}</p>
      <p className="text-fg-secondary mb-2 text-xs font-semibold">
        {COMPANY.legalName}
      </p>
      <dl className="text-fg-muted grid grid-cols-1 gap-x-8 gap-y-1 text-xs sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <dt className="shrink-0">{label}:</dt>
            <dd className="break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

- [ ] **Step 6: Render it in the footer**

In `components/layout/footer.tsx`, add the import:

```tsx
import { LegalInfo } from "./legal-info";
```

and render `<LegalInfo />` inside the `container-wide` div, immediately before the closing element that holds the copyright line, so it sits above `© {year} {SITE.name}`.

- [ ] **Step 7: Run the test**

```bash
npm run build && npx playwright test tests/legal-disclosure.spec.ts --project=chromium
```

Expected: both locales PASS.

- [ ] **Step 8: Commit**

```bash
npx prettier --write lib/constants.ts components/layout messages
git add lib/constants.ts components/layout/legal-info.tsx components/layout/footer.tsx messages tests/legal-disclosure.spec.ts
git commit -m "feat(legal): disclose the company register details in the footer

ZTD čl. 21 requires a d.o.o. to state its legal name, seat, registering
court, MBS and share capital where it presents itself publicly. Until now
the legal entity appeared only inside the privacy policy, and the MBS,
court and capital appeared nowhere at all.

Values live in lib/constants with the rest of the public-record facts, so
only the labels are translated and the numbers cannot drift between locales."
```

---

### Task 3: Add EU AI Act Art. 50 transparency to the voice demo

Article 50 became applicable on 2 August 2026 and requires that people be informed they are interacting with an AI system. The page heading implies it; the demo should state it at the moment the call starts.

**Files:**
- Modify: `messages/hr.json`, `messages/en.json`
- Modify: `components/voice-agent/activate-demo-card.tsx`

**Interfaces:**
- Consumes: `ActivateDemoCard` from P0 Task 6.
- Produces: nothing.

- [ ] **Step 1: Add the disclosure copy**

In `messages/hr.json`, inside `voiceAgent.demo`, add:

```json
"aiDisclosure": "Razgovarate s umjetnom inteligencijom, a ne s osobom. Glas agenta je sintetiziran."
```

In `messages/en.json`:

```json
"aiDisclosure": "You are speaking with an artificial intelligence, not a person. The agent's voice is synthetic."
```

- [ ] **Step 2: Render it on the activation card**

In `components/voice-agent/activate-demo-card.tsx`, add the disclosure directly above the CTA button, so it is read before the click rather than after:

```tsx
<p className="text-fg-muted mb-4 text-xs leading-relaxed">
  {t("aiDisclosure")}
</p>
```

- [ ] **Step 3: Verify parity and render**

```bash
python3 -c "
import json
hr=json.load(open('messages/hr.json'))['voiceAgent']['demo']
en=json.load(open('messages/en.json'))['voiceAgent']['demo']
assert set(hr)==set(en), set(hr)^set(en)
assert 'aiDisclosure' in hr
print('aiDisclosure present in both locales')"
npm run build
```

- [ ] **Step 4: Commit**

```bash
npx prettier --write components/voice-agent/activate-demo-card.tsx messages
git add components/voice-agent/activate-demo-card.tsx messages
git commit -m "feat(legal): state plainly that the demo is an AI

EU AI Act Art. 50 has applied since 2 August 2026 and requires people to be
told they are interacting with an AI system, and that synthetic audio is
marked as such. The page heading implied it; the activation card now says
it, before the click rather than after."
```

---

### Task 4: Complete the cookie inventory and fix stale policy claims

Three accuracy gaps: `NEXT_LOCALE` is set on every visit but absent from the cookie inventory, the policy describes Plausible analytics that is not deployed, and the policy is served `noIndex`.

**Files:**
- Modify: `messages/hr.json`, `messages/en.json` (`privacy.s8Groups`)
- Modify: `app/[locale]/privatnost/page.tsx:19`
- Modify: `i18n/routing.ts`

- [ ] **Step 1: Add the locale cookie to the inventory**

Append to `privacy.s8Groups` in `messages/hr.json`:

```json
{
  "name": "Kolačić za odabir jezika",
  "desc": "Kolačić NEXT_LOCALE pamti jeste li stranicu otvorili na hrvatskom ili engleskom, kako vas pri sljedećem posjetu ne bismo vratili na pogrešnu jezičnu verziju. Sadrži isključivo oznaku jezika, ne sadrži identifikatore i ne koristi se za praćenje."
}
```

and to `messages/en.json`:

```json
{
  "name": "Language preference cookie",
  "desc": "The NEXT_LOCALE cookie remembers whether you opened the site in Croatian or English, so a later visit does not send you to the wrong language version. It holds only a language code, contains no identifiers and is not used for tracking."
}
```

- [ ] **Step 2: Decide the Plausible question and act on it**

`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is unset in production, so the analytics the policy describes does not run. Pick one and do it, rather than leaving the mismatch:

- **If analytics is wanted:** set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aiva.hr` in the Vercel project. The existing policy text already covers it accurately.
- **If it is not:** remove the Plausible `<Script>` from `app/[locale]/layout.tsx`, remove `Plausible Insights OÜ` from `privacy.s5List` in both catalogs, and reword the analytics row in `privacy.s3Rows` to say that no analytics is currently in use.

- [ ] **Step 3: Set `Secure` on the locale cookie**

The cookie is set on every visit over HTTPS but carries no `Secure` flag, so a browser would also send it over plain HTTP. It holds nothing sensitive, but there is no reason to let it travel unencrypted.

In `i18n/routing.ts`, add a `localeCookie` option to the `defineRouting` call:

```ts
localeCookie: {
  name: "NEXT_LOCALE",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
},
```

`secure` is conditional because local development runs on plain HTTP, where a `Secure` cookie would simply never be set and the locale toggle would appear broken.

Verify against the deployed origin, since this header is only correct under HTTPS:

```bash
curl -sSI -L https://www.aiva.hr | grep -i "^set-cookie"
```

Expected: `NEXT_LOCALE=hr; Path=/; SameSite=lax; Secure`.

- [ ] **Step 4: Make the privacy policy indexable**

In `app/[locale]/privatnost/page.tsx`, change `noIndex: true` to `noIndex: false` in the `constructMetadata` call.

A transparency notice that search engines are told to hide is working against its own purpose; people look for these pages, and regulators expect them to be findable.

- [ ] **Step 5: Verify**

```bash
python3 -c "
import json
hr=json.load(open('messages/hr.json'))['privacy']
en=json.load(open('messages/en.json'))['privacy']
assert set(hr)==set(en)
assert len(hr['s8Groups'])==len(en['s8Groups'])
assert any('NEXT_LOCALE' in g['desc'] for g in hr['s8Groups']), 'locale cookie not documented'
print('cookie inventory complete:', len(hr['s8Groups']), 'groups')"
npm run build && npm run start &
sleep 8
curl -s http://localhost:3000/privatnost | grep -c "noindex" || echo "0 — policy is indexable"
kill %1
```

Expected: the inventory assertion passes and `0 — policy is indexable`.

- [ ] **Step 6: Commit**

```bash
npx prettier --write messages "app/[locale]/privatnost/page.tsx" i18n/routing.ts
git add messages "app/[locale]/privatnost/page.tsx" i18n/routing.ts
git commit -m "fix(legal): complete the cookie inventory and make the policy findable

NEXT_LOCALE is set on every visit but was missing from the cookie section,
so the inventory did not match what the site actually sets. The policy was
also served noindex, which works against the purpose of a transparency
notice — people and regulators look these pages up."
```

---

### Task 5: Reconcile the IP-in-email practice

The visitor's IP is written into every contact notification (`route.ts:88`) and, to the site's credit, this is disclosed in `privacy.s2Ip`. The remaining question is whether it is still needed once P1 Task 6 moves rate limiting to Redis.

**Files:**
- Modify: `app/api/contact/route.ts` (only if the decision is to remove)

- [ ] **Step 1: Make the call**

With Redis-backed rate limiting, the IP in the email body serves only manual abuse triage. Decide whether that is worth retaining a piece of personal data in an inbox that is also a sales inbox.

- [ ] **Step 2a: If removing**

Delete `&middot; IP: ${escapeHtml(ip)}` from the email footer line in `route.ts`, and remove the second sentence of `privacy.s2Ip` in both catalogs (the clause stating the IP appears in the internal notification). Keep the first sentence — the IP is still processed for rate limiting.

- [ ] **Step 2b: If keeping**

No code change. Add the retention of those emails to `privacy.s4Rows` if it is not already covered by the existing "Upiti iz obrasca za kontakt" row — it is, at 12 months, so most likely no change is needed. Record the decision in the commit message of whatever task follows.

- [ ] **Step 3: If changed, verify and commit**

```bash
npm run build
git add app/api/contact/route.ts messages
git commit -m "fix(privacy): stop recording sender IPs in contact notifications

With rate limiting moved to Redis the IP in the mail body only served
manual abuse triage, which does not justify keeping personal data in what
is also a sales inbox. The policy's IP clause is narrowed to match."
```

---

### Task 6: Update the audit record

**Files:**
- Modify: `docs/superpowers/specs/2026-09-15-security-gdpr-audit.md`

- [ ] **Step 1: Record the closed findings**

Under the `## Post-remediation verification` heading created in P0 Task 9, add a table mapping each spec finding (E1-E7, and each legal item) to its resolution: the commit that closed it, or the reason it was accepted as-is.

- [ ] **Step 2: Re-run the live probes from the audit**

```bash
curl -sSI -L https://www.aiva.hr | grep -iE "content-security|strict-transport|x-xss|cross-origin"
npm audit --omit=dev --json | python3 -c "import json,sys; print(json.load(sys.stdin)['metadata']['vulnerabilities'])"
```

Paste both outputs into the record with the date. The audit asserted a specific broken state; the record should show, with evidence, the state it was left in.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-09-15-security-gdpr-audit.md
git commit -m "docs(security): record post-remediation state of the audit findings"
```

---

## Definition of done for P2

- [ ] The footer names Modelity d.o.o. with seat, OIB, MBS, registry court and share capital, in both locales, with values verified against the court register.
- [ ] The voice demo states it is an AI with a synthetic voice, before activation.
- [ ] The cookie inventory names every cookie the site actually sets, `NEXT_LOCALE` included.
- [ ] The Plausible mismatch is resolved in one direction or the other.
- [ ] `/privatnost` is indexable.
- [ ] `NEXT_LOCALE` is set with the `Secure` flag in production.
- [ ] Every finding in the audit spec is marked closed or explicitly accepted, with evidence.

## Still open after P2 — for counsel, not for code

These cannot be closed by changing this repository:

1. **AI Act Art. 50 allocation for the product you sell.** An AI receptionist answering real end-customer calls creates obligations for Modelity as provider and for each client as deployer. The split belongs in the client contract and in the product's own call-opening disclosure — neither lives in this codebase.
2. **Art. 9 status of voice data**, pending ElevenLabs' written position on voiceprinting (P0 Task 10).
3. **Art. 30 records of processing.** Not a website artifact, but the processor list now assembled in `privacy.s5List` is most of the raw material for one.
