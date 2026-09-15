# P0 — Legal-Critical Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the site processing personal data without a lawful basis — gate every third-party tracker behind consent, gate the voice demo behind explicit activation, disclose ElevenLabs in the privacy policy, and close the email-injection and Next.js CVEs.

**Architecture:** Consent state is lifted into a single client context (`ConsentProvider`) that reads Cookiebot's runtime API and exposes a boolean per category. Third-party scripts become children of that context and render nothing until their category is granted. The voice demo gets a separate, narrower gate: a click-to-activate card that loads the ElevenLabs script only on an explicit user gesture, independent of the cookie banner. Privacy-policy copy lives in `messages/{hr,en}.json` exactly as today — new processors and data categories are added as new array entries, so the rendering components need no changes.

**Tech Stack:** Next.js 16 (App Router, RSC), next-intl v4, React 19, TypeScript, Tailwind v4, Playwright, Cookiebot (Usercentrics), ElevenLabs ConvAI, Chatbase, Resend.

**Spec:** `docs/superpowers/specs/2026-09-15-security-gdpr-audit.md`

## Global Constraints

- **Croatian is the source language.** Every user-facing string added to `messages/hr.json` MUST have a matching key in `messages/en.json`. The key sets are currently identical and MUST stay identical — `tests/i18n-english.spec.ts` and the audit both rely on this.
- **Legal entity in copy:** `Modelity d.o.o.`, OIB `33666234446`, Trg dr. Žarka Dolinara 18, Koprivnica. Privacy contact: `alen@aiva.hr`. These live in `lib/constants.ts` (`COMPANY`) and MUST NOT be duplicated as literals in message catalogs.
- **Never invent legal-register facts.** MBS number, commercial court, share capital and board members are NOT known. Do not write them into any file. They are handled in the P2 plan behind an explicit input gate.
- **Next.js version floor:** `16.3.5` (fixes the critical request-smuggling advisory). Do not downgrade.
- **No new runtime dependencies** in this phase.
- **Do not modify** `app/api/contact/route.ts` rate-limiting logic in this phase — it is not exploitable as deployed (spec E6) and is handled in P1.
- Run `npx prettier --write` on every file touched before committing; the repo has `prettier-plugin-tailwindcss` and CI-style formatting expectations.

---

### Task 1: Remove the dead `nodemailer` dependency

Closes a HIGH advisory (SMTP command injection) with zero behaviour change, because the package is imported nowhere. Doing it first shrinks the tree before the Next upgrade in Task 2.

**Files:**
- Modify: `package.json` (dependencies, devDependencies)
- Modify: `package-lock.json` (regenerated)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing. No source file imports `nodemailer`; verified by grep across `app/ components/ lib/ i18n/ sanity/`.

- [ ] **Step 1: Prove the dependency is unused**

```bash
grep -rn "nodemailer" app components lib i18n sanity tests
```

Expected: no output (exit code 1). If ANY line is returned, STOP — the dependency is live and this task must be abandoned, not forced.

- [ ] **Step 2: Confirm the advisory exists before removal**

```bash
npm audit --omit=dev --json | python3 -c "import json,sys; v=json.load(sys.stdin)['vulnerabilities']; print(v.get('nodemailer',{}).get('severity','ABSENT'))"
```

Expected: `high`

- [ ] **Step 3: Remove both packages**

```bash
npm rm nodemailer @types/nodemailer
```

- [ ] **Step 4: Verify the advisory is gone and the build still works**

```bash
npm audit --omit=dev --json | python3 -c "import json,sys; v=json.load(sys.stdin)['vulnerabilities']; print('nodemailer present:', 'nodemailer' in v)"
npm run build
```

Expected: `nodemailer present: False`, and the build completes without error.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): drop unused nodemailer

nodemailer and @types/nodemailer were declared but imported nowhere in
the source tree. The package carries a HIGH advisory for SMTP command
injection via CRLF in the transport name and envelope.size. Contact mail
goes through Resend; removing the dead dependency closes the advisory
without any behaviour change."
```

---

### Task 2: Upgrade Next.js to 16.3.5

Closes the only CRITICAL advisory affecting first-party code: HTTP request smuggling in rewrites. `16.1.6 → 16.3.5` is a minor bump, not semver-major.

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (regenerated)

**Interfaces:**
- Consumes: nothing.
- Produces: a build on `next@16.3.5`. Later tasks assume App Router APIs unchanged across this range.

- [ ] **Step 1: Record the current failing state**

```bash
npm audit --omit=dev --json | python3 -c "
import json,sys; v=json.load(sys.stdin)['vulnerabilities']['next']
print('severity:', v['severity']); print('fix:', v['fixAvailable'])"
```

Expected: `severity: critical`, fix naming version `16.3.5`.

- [ ] **Step 2: Upgrade Next and its eslint config together**

They are version-locked in this repo; upgrading one without the other produces a lint config mismatch.

```bash
npm i next@16.3.5 eslint-config-next@16.3.5
```

- [ ] **Step 3: Verify the advisory cleared**

```bash
npm audit --omit=dev --json | python3 -c "
import json,sys; v=json.load(sys.stdin)['vulnerabilities']
n=v.get('next'); print('next advisory:', n['severity'] if n else 'CLEARED')"
```

Expected: `next advisory: CLEARED`

- [ ] **Step 4: Full build and test run**

```bash
npm run build && npx playwright test --project=chromium
```

Expected: build succeeds; the existing suite (`smoke`, `i18n-routing`, `i18n-english`, `locale-toggle`) passes. If a test fails, read the failure before changing anything — a genuine Next 16.3 behaviour change must be understood, not patched around.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix(security): upgrade Next.js to 16.3.5

16.1.6 is affected by a critical HTTP request smuggling advisory in
rewrites, plus unbounded next/image disk cache growth. 16.3.5 is the
patched minor; no application code changes were required."
```

---

### Task 3: Fix the Cookiebot tag so auto-blocking can actually run

The tag currently carries `async`, which lets other scripts execute before Cookiebot installs its interceptors — directly contradicting the adjacent code comment. This does not fix the missing banner (a dashboard issue, Task 9) or gate Chatbase/ElevenLabs (not in Cookiebot's tracker DB, Tasks 4-6), but it is a precondition for auto-blocking working on anything at all.

**Files:**
- Modify: `app/[locale]/layout.tsx:82-92`

**Interfaces:**
- Consumes: `process.env.NEXT_PUBLIC_COOKIEBOT_ID`.
- Produces: `window.Cookiebot` available earlier in the page lifecycle. Task 4's `ConsentProvider` depends on this global existing.

- [ ] **Step 1: Remove `async` from the Cookiebot script tag**

In `app/[locale]/layout.tsx`, replace the existing Cookiebot block with:

```tsx
{/* Cookiebot must be the first script in <head> and must NOT be async:
    auto-blocking works by installing interceptors before any other
    script runs, and async forfeits that ordering guarantee. */}
{cookiebotId && (
  <script
    id="Cookiebot"
    src="https://consent.cookiebot.com/uc.js"
    data-cbid={cookiebotId}
    data-blockingmode="auto"
    data-culture={locale.toUpperCase()}
    type="text/javascript"
  />
)}
```

- [ ] **Step 2: Verify the JSON-LD blocks still follow it**

The two `application/ld+json` blocks must remain *after* the Cookiebot tag in `<head>`. Confirm by reading `app/[locale]/layout.tsx` — Cookiebot first, then both schema blocks.

- [ ] **Step 3: Build and confirm the tag renders without async**

```bash
npm run build && npm run start &
sleep 8
curl -s http://localhost:3000/ | grep -o '<script id="Cookiebot"[^>]*>'
kill %1
```

Expected: the tag is present and the output contains NO `async` attribute.

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/layout.tsx"
git commit -m "fix(privacy): stop Cookiebot loading async

data-blockingmode=auto works by installing script interceptors before
any other script executes. The async attribute forfeited that ordering,
so auto-blocking could lose the race against the trackers it is meant to
gate — contradicting the comment directly above it."
```

---

### Task 4: Build the consent context

A single client-side source of truth for Cookiebot consent, so no component talks to `window.Cookiebot` directly. Cookiebot fires `CookiebotOnAccept` / `CookiebotOnDecline` / `CookiebotOnLoad` on `window`; the provider subscribes and re-reads. It must degrade safely: if Cookiebot never loads (blocked by an extension, or `NEXT_PUBLIC_COOKIEBOT_ID` unset), every category stays `false` — fail closed.

**Files:**
- Create: `components/privacy/consent-provider.tsx`
- Create: `tests/consent-gating.spec.ts`

**Interfaces:**
- Consumes: `window.Cookiebot` (may be absent).
- Produces:
  - `<ConsentProvider>{children}</ConsentProvider>` — client component, no props beyond children.
  - `useConsent(): { necessary: boolean; preferences: boolean; statistics: boolean; marketing: boolean; hasResponded: boolean }` — Tasks 5 and 6 consume this hook by exactly this name and shape.

- [ ] **Step 1: Write the failing test**

Create `tests/consent-gating.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("Consent gating", () => {
  test("no third-party tracker loads before consent is given", async ({ page }) => {
    const thirdParty: string[] = [];
    page.on("request", (r) => {
      const url = r.url();
      if (/chatbase\.co|unpkg\.com|elevenlabs\.io/.test(url)) thirdParty.push(url);
    });

    await page.goto("/ai-recepcija");
    await page.waitForLoadState("networkidle");

    expect(
      thirdParty,
      `These third parties loaded with no consent:\n${thirdParty.join("\n")}`
    ).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx playwright test tests/consent-gating.spec.ts --project=chromium
```

Expected: FAIL, listing `unpkg.com/@elevenlabs/convai-widget-embed` and `chatbase.co/embed.min.js`. This failure is the audit finding E1 reproduced as a test — confirm it names both before continuing.

- [ ] **Step 3: Implement the provider**

Create `components/privacy/consent-provider.tsx`:

```tsx
"use client";

import * as React from "react";

/**
 * Cookiebot's consent categories, mirrored into React state.
 *
 * Every field defaults to false and stays false unless Cookiebot tells us
 * otherwise, so a visitor whose Cookiebot request is blocked — by an ad
 * blocker, a privacy extension, or an unset NEXT_PUBLIC_COOKIEBOT_ID — is
 * treated as having consented to nothing. Failing closed is the only safe
 * default: the cost of a wrong `false` is a missing widget, the cost of a
 * wrong `true` is processing personal data with no lawful basis.
 */
export type Consent = {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  hasResponded: boolean;
};

const DENIED: Consent = {
  necessary: false,
  preferences: false,
  statistics: false,
  marketing: false,
  hasResponded: false,
};

const ConsentContext = React.createContext<Consent>(DENIED);

export function useConsent(): Consent {
  return React.useContext(ConsentContext);
}

function read(): Consent {
  const cb = (window as unknown as { Cookiebot?: {
    consent?: Record<string, boolean>;
    hasResponse?: boolean;
  } }).Cookiebot;
  if (!cb?.consent) return DENIED;
  return {
    necessary: !!cb.consent.necessary,
    preferences: !!cb.consent.preferences,
    statistics: !!cb.consent.statistics,
    marketing: !!cb.consent.marketing,
    hasResponded: !!cb.hasResponse,
  };
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<Consent>(DENIED);

  React.useEffect(() => {
    const sync = () => setConsent(read());

    // Cookiebot may have loaded and fired before this effect ran, so read
    // once eagerly rather than waiting for an event that already passed.
    sync();

    const events = ["CookiebotOnAccept", "CookiebotOnDecline", "CookiebotOnLoad"];
    events.forEach((e) => window.addEventListener(e, sync));
    return () => events.forEach((e) => window.removeEventListener(e, sync));
  }, []);

  return (
    <ConsentContext.Provider value={consent}>{children}</ConsentContext.Provider>
  );
}
```

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. The test still fails at this point — nothing consumes the provider yet. That is correct.

- [ ] **Step 5: Commit**

```bash
git add components/privacy/consent-provider.tsx tests/consent-gating.spec.ts
git commit -m "feat(privacy): add consent context backed by Cookiebot

A single client-side source of truth for consent categories, so no
component reads window.Cookiebot directly. Every category fails closed:
if Cookiebot is blocked or unconfigured, nothing is treated as consented.

Adds the failing gating test that reproduces audit finding E1."
```

---

### Task 5: Gate Chatbase behind marketing consent

Chatbase is not in Cookiebot's tracker database, so `data-blockingmode="auto"` will never gate it. It must be gated in our own code. Moving it out of the layout into a dedicated component also removes an inline `dangerouslySetInnerHTML` from the document shell, which matters for the CSP work in P1.

**Files:**
- Create: `components/privacy/chatbase-widget.tsx`
- Modify: `app/[locale]/layout.tsx` (remove the inline Chatbase `<Script>`, wrap the tree in `ConsentProvider`, render `<ChatbaseWidget />`)

**Interfaces:**
- Consumes: `useConsent()` from `components/privacy/consent-provider.tsx` (Task 4).
- Produces: `<ChatbaseWidget />` — no props. Renders `null` until `marketing` consent is granted.

- [ ] **Step 1: Create the gated widget**

Create `components/privacy/chatbase-widget.tsx`:

```tsx
"use client";

import Script from "next/script";
import { useConsent } from "./consent-provider";

const CHATBASE_ID = "EbGKmwn46Oc5zd54aPaAF";

/**
 * Chatbase chat assistant, gated behind marketing consent.
 *
 * Chatbase is absent from Cookiebot's tracker database, so auto-blocking
 * cannot gate it no matter how the tag is configured — the gate has to live
 * here. Rendering null (rather than loading and hiding) is what makes this a
 * gate: no script element, no network request, no cookie, until consent.
 */
export function ChatbaseWidget() {
  const { marketing } = useConsent();
  if (!marketing) return null;

  return (
    <Script id="chatbase-widget" strategy="afterInteractive">
      {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="${CHATBASE_ID}";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
    </Script>
  );
}
```

- [ ] **Step 2: Rewire the layout**

In `app/[locale]/layout.tsx`: delete the entire inline `<Script id="chatbase-widget" …>` block, add the two imports, and wrap the body content. The `<body>` becomes:

```tsx
<body className={`${syne.variable} ${inter.variable}`}>
  <ConsentProvider>
    {plausibleDomain && (
      <Script
        defer
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    )}
    <ChatbaseWidget />
    <NextIntlClientProvider messages={messages}>
      <SiteShell>{children}</SiteShell>
    </NextIntlClientProvider>
  </ConsentProvider>
</body>
```

with these imports added at the top of the file:

```tsx
import { ConsentProvider } from "@/components/privacy/consent-provider";
import { ChatbaseWidget } from "@/components/privacy/chatbase-widget";
```

Plausible stays ungated: it is cookieless, does not profile individuals, and is EU-hosted — the policy's own `s8Groups` describes it that way. It is also not currently enabled in production.

- [ ] **Step 3: Verify Chatbase no longer loads**

```bash
npm run build && npm run start &
sleep 8
curl -s http://localhost:3000/ | grep -c "chatbase" || echo "0 — chatbase absent from initial HTML"
kill %1
```

Expected: `0 — chatbase absent from initial HTML`. The inline bootstrap must be gone from the server-rendered document.

- [ ] **Step 4: Commit**

```bash
npx prettier --write "app/[locale]/layout.tsx" components/privacy/chatbase-widget.tsx
git add "app/[locale]/layout.tsx" components/privacy/chatbase-widget.tsx
git commit -m "fix(privacy): gate Chatbase behind marketing consent

Chatbase is not in Cookiebot's tracker database, so data-blockingmode=auto
never gated it — in production it loaded and called chatbase.co before the
visitor answered the banner. The gate has to be ours. Rendering null until
consent means no script, no request and no cookie, rather than loading and
hiding.

Also lifts the inline bootstrap out of the document shell, removing one
dangerouslySetInnerHTML ahead of the CSP work."
```

---

### Task 6: Replace the auto-loading voice widget with click-to-activate

The chosen pattern (see spec, Decisions). The ElevenLabs script must not load until the visitor presses a button having been told what happens. Because `TalkButton` is mounted twice on the page (hero at `:134`, demo section at `:221`) while `ElevenLabsWidget` mounts once at `:436`, activation state must be lifted to a context shared by all three.

**Files:**
- Create: `components/voice-agent/voice-demo-provider.tsx`
- Create: `components/voice-agent/activate-demo-card.tsx`
- Modify: `components/voice-agent/elevenlabs-widget.tsx`
- Modify: `components/voice-agent/talk-button.tsx`
- Modify: `app/[locale]/ai-recepcija/page.tsx`
- Modify: `messages/hr.json`, `messages/en.json`

**Interfaces:**
- Consumes: nothing from Tasks 4-5. This gate is deliberately independent of the cookie banner, so the demo survives a visitor who declines cookies.
- Produces:
  - `<VoiceDemoProvider>` — wraps the page.
  - `useVoiceDemo(): { activated: boolean; activate: () => void }`
  - `<ActivateDemoCard />` — the placeholder; calls `activate()`.
  - `ElevenLabsWidget` keeps its existing props `{ agentId: string; language: string }` but renders nothing until `activated`.

- [ ] **Step 1: Add the copy to both catalogs**

In `messages/hr.json`, inside `voiceAgent.demo`, add:

```json
"activateTitle": "Pokrenite demo razgovor",
"activateBody": "Demo koristi ElevenLabs (SAD) i traži pristup vašem mikrofonu. Pokretanjem prihvaćate da se sadržaj razgovora obradi u svrhu demonstracije.",
"activateCta": "Pokreni demo",
"activatePrivacy": "Više u Politici privatnosti"
```

In `messages/en.json`, inside `voiceAgent.demo`, add:

```json
"activateTitle": "Start the demo call",
"activateBody": "The demo uses ElevenLabs (USA) and asks for microphone access. Starting it means you agree to your speech being processed for the purpose of this demonstration.",
"activateCta": "Start demo",
"activatePrivacy": "More in our Privacy Policy"
```

- [ ] **Step 2: Verify the key sets still match**

```bash
python3 -c "
import json
hr=json.load(open('messages/hr.json'))['voiceAgent']['demo']
en=json.load(open('messages/en.json'))['voiceAgent']['demo']
assert set(hr)==set(en), set(hr)^set(en)
print('demo keys aligned:', sorted(set(hr)))"
```

Expected: an assertion pass listing all keys including the four new ones.

- [ ] **Step 3: Create the activation context**

Create `components/voice-agent/voice-demo-provider.tsx`:

```tsx
"use client";

import * as React from "react";

/**
 * Whether the visitor has explicitly started the voice demo.
 *
 * This gate is deliberately separate from the cookie banner. Loading the
 * ElevenLabs embed transmits the visitor's IP to a US processor and opens a
 * microphone prompt, which needs consent that is specific to that purpose —
 * not a blanket "accept all" click. Keeping it separate also means a visitor
 * who declines cookies can still try the demo, which is the point of the page.
 *
 * Activation is intentionally one-way for the life of the page: once the
 * embed has loaded there is nothing to un-load, so offering a "stop" that
 * cannot honour its promise would be worse than not offering one.
 */
type VoiceDemo = { activated: boolean; activate: () => void };

const VoiceDemoContext = React.createContext<VoiceDemo>({
  activated: false,
  activate: () => {},
});

export function useVoiceDemo(): VoiceDemo {
  return React.useContext(VoiceDemoContext);
}

export function VoiceDemoProvider({ children }: { children: React.ReactNode }) {
  const [activated, setActivated] = React.useState(false);
  const activate = React.useCallback(() => setActivated(true), []);
  const value = React.useMemo(() => ({ activated, activate }), [activated, activate]);

  return (
    <VoiceDemoContext.Provider value={value}>{children}</VoiceDemoContext.Provider>
  );
}
```

- [ ] **Step 4: Make the widget respect activation**

Replace the body of `components/voice-agent/elevenlabs-widget.tsx` with:

```tsx
"use client";

import * as React from "react";
import Script from "next/script";
import { useVoiceDemo } from "./voice-demo-provider";

/**
 * ElevenLabs ConvAI embed, loaded only after the visitor explicitly starts
 * the demo.
 *
 * Returning null before activation is what makes this a gate rather than a
 * cosmetic one: no custom element, no embed script, no request to unpkg or
 * to api.us.elevenlabs.io, and no microphone prompt until the visitor has
 * read what the demo does and pressed the button.
 *
 * The site-wide Chatbase bubble claims the same bottom-right corner at a
 * near-maximum z-index, so this component hides it for as long as it is
 * mounted: on the page about the voice agent, the voice agent is the demo.
 */
export function ElevenLabsWidget({
  agentId,
  language,
}: {
  agentId: string;
  language: string;
}) {
  const { activated } = useVoiceDemo();

  React.useEffect(() => {
    if (!activated) return;
    const root = document.documentElement;
    root.classList.add("voice-widget-active");
    return () => root.classList.remove("voice-widget-active");
  }, [activated]);

  if (!activated) return null;

  return (
    <>
      {/* `language` follows the page locale. It only takes effect for
          languages enabled on the agent in the ElevenLabs dashboard; with a
          single-language agent the widget keeps that language regardless. */}
      <elevenlabs-convai agent-id={agentId} language={language} />
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
    </>
  );
}
```

- [ ] **Step 5: Create the activation card**

Create `components/voice-agent/activate-demo-card.tsx`:

```tsx
"use client";

import { Mic, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useVoiceDemo } from "./voice-demo-provider";

/**
 * The pre-activation state of the demo: says what starting it will do, then
 * starts it. This is the consent moment for voice processing, so the notice
 * has to be readable before the click, not linked from after it.
 */
export function ActivateDemoCard({ className }: { className?: string }) {
  const t = useTranslations("voiceAgent.demo");
  const { activate } = useVoiceDemo();

  return (
    <div
      className={`border-border bg-bg-elevated mx-auto max-w-md rounded-2xl border p-6 text-center ${className ?? ""}`}
    >
      <Mic className="text-accent mx-auto mb-3 h-6 w-6" aria-hidden="true" />
      <p className="text-fg mb-2 text-base font-semibold">{t("activateTitle")}</p>
      <p className="text-fg-secondary text-small mb-5 leading-relaxed">
        {t("activateBody")}
      </p>
      <Button type="button" size="lg" variant="primary" onClick={activate}>
        <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 truncate">{t("activateCta")}</span>
      </Button>
      <Link
        href="/privatnost"
        className="text-fg-muted hover:text-accent mt-4 block text-xs underline"
      >
        {t("activatePrivacy")}
      </Link>
    </div>
  );
}
```

- [ ] **Step 6: Make `TalkButton` defer to the card before activation**

In `components/voice-agent/talk-button.tsx`, add the import:

```tsx
import { useVoiceDemo } from "./voice-demo-provider";
import { ActivateDemoCard } from "./activate-demo-card";
```

and insert this as the first statement inside the `TalkButton` component body, before `const t = useTranslations(...)` is used for anything else — it must come after the hooks so hook order stays stable:

```tsx
export function TalkButton({
  className,
  whenUnavailable = "hide",
}: {
  className?: string;
  whenUnavailable?: "hide" | "explain";
}) {
  const t = useTranslations("voiceAgent.demo");
  const { activated } = useVoiceDemo();
  const state = useWidgetState();

  // Before activation there is no widget to drive, so the button is replaced
  // by the notice that starts it. The hero already carries its own CTA, so
  // only the demo section renders the card; the hero renders nothing.
  if (!activated) {
    return whenUnavailable === "explain" ? <ActivateDemoCard /> : null;
  }

  if (state === "unavailable") {
    // …existing unavailable branch unchanged…
```

Leave the rest of the component exactly as it is. `useWidgetState()` must still be called unconditionally above the early return so React's hook order never changes between renders.

- [ ] **Step 7: Wrap the page and render the card**

In `app/[locale]/ai-recepcija/page.tsx`, add the import:

```tsx
import { VoiceDemoProvider } from "@/components/voice-agent/voice-demo-provider";
```

then wrap the existing returned fragment. The component currently returns `<>…</>`; change the outermost wrapper to:

```tsx
<VoiceDemoProvider>
  {/* …entire existing page body, unchanged… */}
  <ElevenLabsWidget agentId={CONVAI_AGENT_ID} language={locale} />
</VoiceDemoProvider>
```

No other line in the page changes — the hero `TalkButton` at `:134` and the demo `TalkButton` at `:221` now resolve activation through context.

- [ ] **Step 8: Run the gating test — it must now pass**

```bash
npm run build && npx playwright test tests/consent-gating.spec.ts --project=chromium
```

Expected: PASS. No request to `unpkg.com`, `elevenlabs.io` or `chatbase.co` on load.

- [ ] **Step 9: Add the activation test**

Append to `tests/consent-gating.spec.ts`:

```ts
test("voice demo loads ElevenLabs only after explicit activation", async ({ page }) => {
  const elevenlabs: string[] = [];
  page.on("request", (r) => {
    if (/unpkg\.com|elevenlabs\.io/.test(r.url())) elevenlabs.push(r.url());
  });

  await page.goto("/ai-recepcija");
  await page.waitForLoadState("networkidle");
  expect(elevenlabs, "ElevenLabs loaded before activation").toEqual([]);

  await page.getByRole("button", { name: /Pokreni demo/i }).click();
  await page.waitForRequest(/unpkg\.com|elevenlabs\.io/, { timeout: 15_000 });

  expect(elevenlabs.length).toBeGreaterThan(0);
});
```

- [ ] **Step 10: Run it**

```bash
npx playwright test tests/consent-gating.spec.ts --project=chromium
```

Expected: both tests PASS. If the click cannot find the button, check that the demo-section `TalkButton` is the one with `whenUnavailable="explain"` (`page.tsx:221`) — only that one renders the card.

- [ ] **Step 11: Commit**

```bash
npx prettier --write components/voice-agent "app/[locale]/ai-recepcija/page.tsx" messages
git add components/voice-agent "app/[locale]/ai-recepcija/page.tsx" messages tests/consent-gating.spec.ts
git commit -m "feat(privacy): require explicit activation before the voice demo loads

The ElevenLabs embed used to load on page view: it fetched an unpinned
bundle from unpkg, opened a connection to a US processor and armed a
microphone prompt before the visitor had agreed to any of it.

It now renders a card that says what starting the demo does — ElevenLabs,
USA, microphone — and loads nothing until the visitor presses the button.
Activation is lifted into context because TalkButton mounts twice (hero and
demo section) against a single widget instance.

This gate is deliberately independent of the cookie banner: consent for
voice processing should be specific to that purpose, and a visitor who
declines cookies can still try the demo."
```

---

### Task 7: Escape HTML in the contact notification email

Closes spec finding E3. `name`, `company` and `message` reach an HTML email body unescaped; an attacker controls how the operator's inbox renders.

**Files:**
- Modify: `app/api/contact/route.ts`
- Create: `tests/contact-escaping.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `escapeHtml(value: string): string` — module-local to the route; not exported for other tasks.

- [ ] **Step 1: Write the failing test**

This tests the escaping function through a route-level unit test rather than by sending mail, so the suite never hits Resend. Create `tests/contact-escaping.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

/**
 * The contact route builds an HTML email from free-text fields. Zod bounds
 * their length but not their content, so anything unescaped renders as
 * markup in the operator's inbox — a phishing link that appears to come from
 * the site's own form.
 */
test.describe("Contact form email escaping", () => {
  test("rejects a payload whose message contains markup, or escapes it", async ({
    request,
  }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: '<img src=x onerror="alert(1)">',
        email: "probe@example.com",
        message:
          'Ovo je dovoljno duga poruka za validaciju. <a href="https://evil.example">Klikni</a>',
      },
    });

    // Either outcome is acceptable: a 4xx rejection, or a 200 where the route
    // escaped the payload. What must never happen is a 500 — that means the
    // markup reached the mail builder and broke it.
    expect([200, 400, 429]).toContain(res.status());
  });
});
```

- [ ] **Step 2: Run it to see the current behaviour**

```bash
npx playwright test tests/contact-escaping.spec.ts --project=chromium
```

Note the status returned. This test is a guard, not a red test — the real verification is Step 4's assertion on the built HTML.

- [ ] **Step 3: Add the escaper and apply it**

In `app/api/contact/route.ts`, add above the schema:

```ts
/**
 * Escape a value for interpolation into the notification email's HTML body.
 *
 * Zod bounds these fields' length, never their content. Without escaping,
 * anything a stranger types renders as markup in our own inbox — the obvious
 * abuse being a link that looks like it came from our own form.
 */
function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}
```

Then replace the interpolations in the `html` template. Every `${data.X}` inside the template becomes `${escapeHtml(data.X)}`:

```ts
subject: `Nova poruka od ${data.name}${data.company ? ` (${data.company})` : ""}`,
html: `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
    <h2 style="color: #6366f1;">Nova poruka putem obrasca za kontakt</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #666; width: 120px;">Ime</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${encodeURIComponent(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      ${data.company ? `<tr><td style="padding: 8px 0; color: #666;">Tvrtka</td><td style="padding: 8px 0;">${escapeHtml(data.company)}</td></tr>` : ""}
    </table>
    <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px; border-left: 3px solid #6366f1;">
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
    </div>
    <p style="margin-top: 24px; color: #999; font-size: 12px;">Poslano putem aiva.agency obrasca &middot; IP: ${escapeHtml(ip)}</p>
  </div>
`,
```

The `subject` line needs no HTML escaping (it is not HTML) but must not be left as the only place raw input appears — Resend sends it as a header, and the zod `max(100)` bound plus the absence of newlines in a parsed JSON string keeps it safe.

- [ ] **Step 4: Verify the escaping directly**

```bash
npx tsc --noEmit
node -e '
const esc = (v) => v.replace(/[&<>"\x27]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","\x27":"&#39;"}[c]));
const payload = `<a href="https://evil.example">Klikni</a>`;
const out = esc(payload);
console.log(out);
if (out.includes("<a") || out.includes("\"")) { console.error("FAIL: markup survived"); process.exit(1); }
console.log("PASS: markup neutralised");
'
```

Expected: the escaped string, then `PASS: markup neutralised`.

- [ ] **Step 5: Commit**

```bash
npx prettier --write app/api/contact/route.ts
git add app/api/contact/route.ts tests/contact-escaping.spec.ts
git commit -m "fix(security): escape contact form input in the notification email

name, company and message reached the HTML mail body unescaped. Zod bounds
their length, not their content, so a stranger could choose how the message
rendered in our own inbox — the practical abuse being a link that appears to
come from our own contact form.

Every interpolation is now escaped, and the mailto: href is percent-encoded
rather than escaped, since it is a URL context rather than a text one."
```

---

### Task 8: Disclose ElevenLabs and voice processing in the privacy policy

Closes spec finding E2 — the Art. 13 gap. Pure data changes to both message catalogs; no component changes, because the policy page renders these arrays generically.

**Files:**
- Modify: `messages/hr.json` (`privacy.s2Groups`, `privacy.s3Rows`, `privacy.s4Rows`, `privacy.s5List`, `privacy.s8Groups`, `privacy.updated`)
- Modify: `messages/en.json` (same keys)

**Interfaces:**
- Consumes: the existing shapes declared in `app/[locale]/privatnost/page.tsx:29-33` — `DataGroup {name, desc, items[]}`, `PurposeRow {purpose, basis, detail}`, `RetentionRow {what, period}`, `Processor {name, role, location}`, `NamedItem {name, desc}`. New entries MUST match these exactly or the page will render `undefined`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the processor (both catalogs)**

Append to `privacy.s5List` in `messages/hr.json`:

```json
{
  "name": "ElevenLabs Inc.",
  "role": "Glasovni AI agent u demonstraciji na stranici (obrada govora)",
  "location": "SAD"
}
```

and to `messages/en.json`:

```json
{
  "name": "ElevenLabs Inc.",
  "role": "Voice AI agent in the on-site demo (speech processing)",
  "location": "USA"
}
```

- [ ] **Step 2: Add the data category (both catalogs)**

Append to `privacy.s2Groups` in `messages/hr.json`:

```json
{
  "name": "Podaci iz glasovne demonstracije",
  "desc": "Na stranici AI recepcija dostupna je glasovna demonstracija koja se pokreće isključivo vašom izričitom radnjom. Ako je pokrenete, vaš preglednik zatražit će pristup mikrofonu, a vaš govor i odgovori agenta obrađuju se kod pružatelja usluge ElevenLabs Inc. u Sjedinjenim Američkim Državama. Ako demonstraciju ne pokrenete, mikrofon se ne koristi i nikakvi glasovni podaci ne nastaju. Molimo vas da tijekom demonstracije ne izgovarate osjetljive osobne podatke niti povjerljive poslovne informacije.",
  "items": []
}
```

and to `messages/en.json`:

```json
{
  "name": "Voice demo data",
  "desc": "The AI recepcija page offers a voice demonstration that starts only on your explicit action. If you start it, your browser will ask for microphone access, and your speech together with the agent's replies is processed by ElevenLabs Inc. in the United States. If you do not start it, the microphone is never used and no voice data is created. Please do not speak sensitive personal data or confidential business information during the demonstration.",
  "items": []
}
```

- [ ] **Step 3: Add the legal basis (both catalogs)**

Append to `privacy.s3Rows` in `messages/hr.json`:

```json
{
  "purpose": "Glasovna demonstracija AI recepcije",
  "basis": "Privola (čl. 6. st. 1. t. a)",
  "detail": "Demonstraciju pokrećete izričitom radnjom, nakon obavijesti o tome da se koristi mikrofon i da se govor obrađuje kod pružatelja usluge u SAD-u. Privolu možete povući tako da prekinete razgovor i zatvorite stranicu; već obrađeni podaci brišu se u rokovima navedenima niže."
}
```

and to `messages/en.json`:

```json
{
  "purpose": "Voice demonstration of the AI receptionist",
  "basis": "Consent (Art. 6(1)(a))",
  "detail": "You start the demonstration by an explicit action, after being told that it uses your microphone and that your speech is processed by a provider in the USA. You can withdraw consent by ending the call and leaving the page; data already processed is deleted within the periods set out below."
}
```

- [ ] **Step 4: Add the retention row (both catalogs)**

Append to `privacy.s4Rows` in `messages/hr.json`:

```json
{
  "what": "Snimke i transkripti glasovne demonstracije",
  "period": "U skladu s postavkama i rokovima pružatelja usluge ElevenLabs, u pravilu do 30 dana"
}
```

and to `messages/en.json`:

```json
{
  "what": "Voice demo recordings and transcripts",
  "period": "In line with ElevenLabs' settings and retention periods, as a rule up to 30 days"
}
```

> **VERIFY BEFORE SHIPPING:** the 30-day figure must be checked against the actual retention configured in the ElevenLabs dashboard for agent `agent_8601m1k7w4cxe9ktwszx5d7471pb`. If it differs, use the real number. Do not ship a retention period that does not match the configuration — an inaccurate retention claim is its own Art. 13 problem.

- [ ] **Step 5: Correct the now-false Chatbase consent claim**

Task 5 made the chat assistant genuinely consent-gated, so `privacy.s3Rows`' existing chat entry becomes accurate — but its `detail` describes the wrong mechanism. In `messages/hr.json`, change the `detail` of the row whose `purpose` is `"Rad AI chat asistenta na stranici"` to:

```json
"detail": "Widget se učitava tek nakon što u traci za privole prihvatite kolačiće za tu namjenu. Ako privolu ne date, widget se ne učitava i nikakav sadržaj razgovora ne nastaje."
```

and in `messages/en.json`, the matching row's `detail` to:

```json
"detail": "The widget loads only after you accept cookies for that purpose in the consent banner. If you do not consent, the widget does not load and no conversation content is created."
```

- [ ] **Step 6: Bump the policy date in both catalogs**

Set `privacy.updated` in `messages/hr.json` to `"Zadnja izmjena: 15. rujna 2026."` and in `messages/en.json` to `"Last updated: 15 September 2026"` (match the existing EN format exactly — read the current value first and preserve its punctuation style).

- [ ] **Step 7: Verify structure and parity**

```bash
python3 -c "
import json
hr=json.load(open('messages/hr.json'))['privacy']
en=json.load(open('messages/en.json'))['privacy']
assert set(hr)==set(en), ('key drift', set(hr)^set(en))
for k,shape in [('s5List',{'name','role','location'}),('s2Groups',{'name','desc','items'}),
                ('s3Rows',{'purpose','basis','detail'}),('s4Rows',{'what','period'})]:
    assert len(hr[k])==len(en[k]), (k,'length drift',len(hr[k]),len(en[k]))
    for row in hr[k]+en[k]:
        assert set(row)==shape, (k,'bad shape',set(row))
    print(f'{k}: {len(hr[k])} rows, shape OK')
blob=json.dumps(hr,ensure_ascii=False).lower()
assert 'elevenlabs' in blob, 'ElevenLabs still missing from HR policy'
assert 'mikrofon' in blob, 'microphone still missing from HR policy'
print('ElevenLabs + microphone now disclosed')"
```

Expected: every line prints OK, ending with `ElevenLabs + microphone now disclosed`.

- [ ] **Step 8: Render both locales and read them**

```bash
npm run build && npm run start &
sleep 8
curl -s http://localhost:3000/privatnost   | grep -o "ElevenLabs" | head -1
curl -s http://localhost:3000/en/privatnost | grep -o "ElevenLabs" | head -1
kill %1
```

Expected: `ElevenLabs` printed for both locales.

- [ ] **Step 9: Commit**

```bash
npx prettier --write messages
git add messages
git commit -m "feat(legal): disclose ElevenLabs and voice processing in the privacy policy

The policy was written on 8 September and the live voice demo shipped on
14 September; the policy was never revised. It named seven processors and
five data categories, and matched none of what the demo actually does:
microphone capture, speech sent to a US processor, and a retention period
for the recordings.

Adds ElevenLabs as a processor, voice data as a category, consent as its
Art. 6 basis and a retention row, and corrects the chat assistant's stated
basis now that it is genuinely consent-gated."
```

---

### Task 9: Confirm the Cookiebot banner renders in production

**This task is not code.** The banner never renders in production (spec E1), and no source change can fix that — `hasResponse:false` with `dialogExists:false` means Cookiebot is serving no dialog for this domain. Until this is resolved, Tasks 4-5 leave Chatbase permanently disabled, which is the correct fail-closed behaviour but not the intended end state.

**Files:** none.

**Interfaces:**
- Consumes: the deployed output of Tasks 3-5.
- Produces: a working consent banner, which is what makes Task 5's gate openable.

- [ ] **Step 1: Check the domain registration**

In the Cookiebot dashboard for domain group `2e174c3d-e283-4ae0-b8c2-23b0ea988fbf`, confirm the domain list contains **`www.aiva.hr`**, not only `aiva.hr`. The site 307-redirects the apex to `www`, so a group registered only for the apex never matches the served origin. Add `www.aiva.hr` if missing and re-run the domain scan.

- [ ] **Step 2: Deploy Tasks 1-8 and re-verify in a browser**

Load `https://www.aiva.hr/ai-recepcija` in a clean profile and run in the console:

```js
({
  gdprApplies: Cookiebot?.regulations?.gdprApplies,
  hasResponse: Cookiebot?.hasResponse,
  dialogRendered: !!document.getElementById("CybotCookiebotDialog"),
  chatbaseLoaded: !!document.querySelector('script[src*="chatbase"]'),
  elevenlabsLoaded: !!document.querySelector('script[src*="unpkg"]'),
})
```

Expected after the fix: `dialogRendered: true`, `chatbaseLoaded: false`, `elevenlabsLoaded: false` before interacting with anything.

- [ ] **Step 3: Verify the gate opens**

Accept all categories in the banner, then re-run the snippet. Expected: `chatbaseLoaded: true`. If it stays `false`, the `CookiebotOnAccept` listener in `ConsentProvider` is not firing — check that the Cookiebot script is not being blocked by an extension in the test profile before changing code.

- [ ] **Step 4: Record the outcome**

Append the verified console output to `docs/superpowers/specs/2026-09-15-security-gdpr-audit.md` under a new `## Post-remediation verification` heading, with the date. The audit claims a specific broken state; the record should show the state it was left in.

---

### Task 10: Obtain the ElevenLabs DPA and voiceprint position

**This task is not code.** Art. 28 requires a data processing agreement with ElevenLabs regardless of the Art. 6 basis, and the Art. 9 question (spec, Legal analysis) cannot be answered from the code.

**Files:** none.

- [ ] **Step 1: Execute the DPA**

Request and sign ElevenLabs' Data Processing Addendum for the account hosting agent `agent_8601m1k7w4cxe9ktwszx5d7471pb`. Store the executed copy where Modelity keeps its Art. 30 records.

- [ ] **Step 2: Get the voiceprinting position in writing**

Ask ElevenLabs to confirm in writing whether audio from ConvAI agents is used for speaker identification or voiceprinting. If it is, voice data becomes Art. 9 special-category data and consent must be explicit and separately evidenced — escalate to counsel before the demo goes back up.

- [ ] **Step 3: Confirm the configured retention**

Read the actual retention setting for the agent and reconcile it with the figure written in Task 8 Step 4. Correct the policy if they differ.

---

## Definition of done for P0

- [ ] `npx playwright test --project=chromium` passes, including both new gating tests.
- [ ] `npm audit --omit=dev` reports no `critical` and no `next`/`nodemailer` advisory.
- [ ] A clean browser profile on `www.aiva.hr/ai-recepcija` shows the consent banner, and neither Chatbase nor ElevenLabs has loaded before interaction.
- [ ] `/privatnost` and `/en/privatnost` both name ElevenLabs, voice data, its basis and its retention.
- [ ] Sending a contact message containing `<a href>` produces an email where the markup is visible as text, not rendered.
- [ ] ElevenLabs DPA executed and retention figure reconciled.
