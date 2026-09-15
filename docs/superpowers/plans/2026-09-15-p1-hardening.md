# P1 — Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the containment and supply-chain gaps that survive P0 — no CSP, an unpinned third-party bundle, internal errors leaking to callers, EU data processed in US-East, a publicly embeddable voice agent, best-effort rate limiting, and a public Sanity Studio.

**Architecture:** Response headers stay in `vercel.json` (the existing convention) except the CSP, which needs a per-request nonce and therefore moves into `middleware.ts` alongside the next-intl middleware. The ElevenLabs bundle is pinned and self-hosted under `public/` so the site stops trusting unpkg's mutable `latest`. Rate limiting moves from a per-instance `Map` to Upstash Redis, provisioned through the Vercel Marketplace rather than hand-rolled.

**Tech Stack:** Next.js 16.3.5, Vercel (Fluid Compute), Upstash Redis via Vercel Marketplace, Sanity Studio, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-15-security-gdpr-audit.md`

## Global Constraints

- **P0 must be merged first.** Task 3 of this plan (CSP) assumes the inline Chatbase bootstrap has already been lifted out of `app/[locale]/layout.tsx` by P0 Task 5; writing a CSP against the old layout will produce a policy that has to be rewritten.
- **Next.js version floor:** `16.3.5`.
- **Do not break Cookiebot.** Cookiebot injects scripts and styles at runtime; any CSP must allowlist `consent.cookiebot.com`, `consentcdn.cookiebot.com` and `imgsct.cookiebot.com` or the banner silently stops rendering — reintroducing the exact failure P0 Task 9 fixed.
- **Report-only first.** Ship every CSP change as `Content-Security-Policy-Report-Only` for at least one deploy and read the violations before enforcing. A CSP that breaks the consent banner is worse than no CSP.
- **New runtime dependency permitted in this phase:** `@upstash/redis` and `@upstash/ratelimit` (Task 6 only).

---

### Task 1: Stop leaking internal error text to callers

**Files:**
- Modify: `app/api/contact/route.ts:94-101`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: Confirm the leak exists**

```bash
grep -n "detail: msg" app/api/contact/route.ts
```

Expected: one match at the Resend catch block.

- [ ] **Step 2: Remove `detail` from the response**

Replace the catch block with:

```ts
} catch (e) {
  // Log the real cause for us; return a generic message to the caller.
  // Resend's errors quote request context and configuration details that a
  // stranger submitting a contact form has no business reading.
  console.error("Resend error:", e instanceof Error ? e.message : String(e));
  return NextResponse.json({ error: t("form.errorSend") }, { status: 500 });
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && grep -c "detail: msg" app/api/contact/route.ts || echo "0 — leak removed"
```

Expected: `0 — leak removed`.

- [ ] **Step 4: Commit**

```bash
npx prettier --write app/api/contact/route.ts
git add app/api/contact/route.ts
git commit -m "fix(security): stop returning internal error text from the contact route

The Resend failure path returned the raw SDK error message to the caller.
Those messages quote request context and configuration details; the sender
of a contact form has no reason to see them. Logged server-side instead."
```

---

### Task 2: Pin and self-host the ElevenLabs widget bundle

`https://unpkg.com/@elevenlabs/convai-widget-embed` resolves to whatever version is newest at request time, with no integrity check. A compromised or malicious publish executes arbitrary JavaScript on `aiva.hr` — same origin as the contact form.

**Files:**
- Create: `public/vendor/convai-widget-embed.js`
- Modify: `components/voice-agent/elevenlabs-widget.tsx`
- Create: `docs/vendor-bundles.md`

**Interfaces:**
- Consumes: `useVoiceDemo()` (P0 Task 6) — unchanged.
- Produces: the widget served from same-origin `/vendor/convai-widget-embed.js`.

- [ ] **Step 1: Resolve and record the exact current version**

```bash
curl -sI https://unpkg.com/@elevenlabs/convai-widget-embed | grep -i "^location\|^x-final-url" || \
  curl -s "https://registry.npmjs.org/@elevenlabs/convai-widget-embed/latest" | python3 -c "import json,sys; print(json.load(sys.stdin)['version'])"
```

Record the version string. Every later step uses it; do not substitute `latest` anywhere.

- [ ] **Step 2: Download that exact version and record its hash**

Replace `X.Y.Z` with the version from Step 1:

```bash
mkdir -p public/vendor
curl -sfL "https://unpkg.com/@elevenlabs/convai-widget-embed@X.Y.Z" -o public/vendor/convai-widget-embed.js
shasum -a 384 public/vendor/convai-widget-embed.js
ls -l public/vendor/convai-widget-embed.js
```

Expected: a non-empty JavaScript file. If it is under 1 KB, inspect it — unpkg may have returned a redirect stub rather than the bundle.

- [ ] **Step 3: Point the component at the local copy**

In `components/voice-agent/elevenlabs-widget.tsx`, replace the `<Script>` element:

```tsx
{/* Served from our own origin, pinned to the version recorded in
    docs/vendor-bundles.md. unpkg's bare package URL resolves to whatever is
    newest at request time with no integrity check, which would let a
    malicious publish run arbitrary JavaScript on this origin — the same
    origin as the contact form. */}
<Script src="/vendor/convai-widget-embed.js" strategy="afterInteractive" />
```

- [ ] **Step 4: Record the provenance**

Create `docs/vendor-bundles.md`:

```markdown
# Vendored third-party bundles

Third-party JavaScript served from our own origin instead of a public CDN,
so that a compromised or malicious upstream publish cannot execute on
aiva.hr without us choosing to ship it.

| File | Package | Version | SHA-384 | Vendored |
|---|---|---|---|---|
| `public/vendor/convai-widget-embed.js` | `@elevenlabs/convai-widget-embed` | `X.Y.Z` | `<hash from Step 2>` | 2026-09-15 |

## Updating

1. Download the new exact version from `https://unpkg.com/<pkg>@<version>`.
2. Diff it against the current file and skim the diff. A vendored bundle you
   have not looked at provides provenance, not safety.
3. Update the version and hash in this table in the same commit as the file.
```

Fill in the real version and hash — do not leave `X.Y.Z` or the placeholder hash in the committed file.

- [ ] **Step 5: Verify the widget still works after activation**

```bash
npm run build && npx playwright test tests/consent-gating.spec.ts --project=chromium
```

The activation test asserts a request to `unpkg.com|elevenlabs.io` after clicking. That assertion is now wrong — update it in the same commit:

```ts
await page.getByRole("button", { name: /Pokreni demo/i }).click();
await page.waitForRequest(/vendor\/convai-widget-embed\.js|elevenlabs\.io/, {
  timeout: 15_000,
});
```

Re-run until both tests pass.

- [ ] **Step 6: Commit**

```bash
npx prettier --write components/voice-agent/elevenlabs-widget.tsx tests/consent-gating.spec.ts
git add public/vendor components/voice-agent/elevenlabs-widget.tsx docs/vendor-bundles.md tests/consent-gating.spec.ts
git commit -m "fix(security): pin and self-host the ConvAI widget bundle

The embed loaded from unpkg's bare package URL, which resolves to whatever
version is newest at request time with no integrity check. A malicious
publish would have executed arbitrary JavaScript on this origin — the same
origin that serves the contact form.

Now served from public/vendor at a recorded version and hash, so upgrading
is a reviewed commit rather than something that happens to us."
```

---

### Task 3: Add a Content-Security-Policy in report-only mode

There is no CSP at all (spec E5). Because the app renders JSON-LD inline, the policy needs a per-request nonce, which means generating it in middleware. This task ships it report-only; Task 4 enforces it.

**Files:**
- Modify: `middleware.ts`
- Modify: `app/[locale]/layout.tsx` (consume the nonce for the JSON-LD blocks)

**Interfaces:**
- Consumes: `routing` from `i18n/routing.ts` (existing).
- Produces: an `x-nonce` request header read by the layout, and a `Content-Security-Policy-Report-Only` response header.

- [ ] **Step 1: Rewrite the middleware to compose next-intl with a CSP**

Replace `middleware.ts` entirely:

```ts
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Build the CSP for one request.
 *
 * Cookiebot is the fragile part: it injects its banner's scripts and styles
 * at runtime, so its three origins must be allowlisted or the consent banner
 * silently stops rendering — which is exactly the failure this site already
 * had once. 'unsafe-inline' stays on style-src because Cookiebot and the
 * inline SVG styles need it; script-src uses a nonce instead.
 */
function buildCsp(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://consent.cookiebot.com https://consentcdn.cookiebot.com https://www.chatbase.co https://plausible.io`,
    `style-src 'self' 'unsafe-inline' https://consentcdn.cookiebot.com`,
    `img-src 'self' data: blob: https://cdn.sanity.io https://imgsct.cookiebot.com https://consentcdn.cookiebot.com`,
    `font-src 'self' data:`,
    `connect-src 'self' https://consent.cookiebot.com https://consentcdn.cookiebot.com https://www.chatbase.co https://plausible.io https://api.us.elevenlabs.io wss://api.us.elevenlabs.io`,
    `media-src 'self' blob: https://cdn.sanity.io`,
    `frame-src https://consentcdn.cookiebot.com https://www.chatbase.co`,
    `frame-ancestors 'none'`,
    `base-uri 'none'`,
    `object-src 'none'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ");
}

export default function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Hand the nonce to the render pass via a request header.
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);

  const response = intlMiddleware(
    new Request(request, { headers }) as unknown as NextRequest
  );

  // Report-only for now: read the violations before enforcing, because a CSP
  // that breaks the consent banner is worse than no CSP at all.
  response.headers.set("Content-Security-Policy-Report-Only", buildCsp(nonce));
  return response;
}

export const config = {
  // Match everything except /studio, /api, Next internals, and files with a dot.
  matcher: ["/((?!studio|api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 2: Apply the nonce to the inline JSON-LD blocks**

In `app/[locale]/layout.tsx`, add the import and read the header:

```tsx
import { headers } from "next/headers";
```

then inside `LocaleLayout`, after `const messages = await getMessages();`:

```tsx
const nonce = (await headers()).get("x-nonce") ?? undefined;
```

and add `nonce={nonce}` to both `application/ld+json` script tags and to the Cookiebot script tag.

- [ ] **Step 3: Build and read the header**

```bash
npm run build && npm run start &
sleep 8
curl -sI http://localhost:3000/ | grep -i "content-security-policy-report-only" | head -c 400
kill %1
```

Expected: the report-only header, containing a `nonce-` value.

- [ ] **Step 4: Verify nothing is enforced yet**

```bash
curl -sI http://localhost:3000/ | grep -ci "^content-security-policy:" || echo "0 — nothing enforced, correct for this task"
```

Expected: `0 — nothing enforced, correct for this task`.

- [ ] **Step 5: Run the full suite**

```bash
npx playwright test --project=chromium
```

Expected: all pass. Report-only must not change behaviour; if a test fails, the middleware composition is wrong, not the policy.

- [ ] **Step 6: Commit**

```bash
npx prettier --write middleware.ts "app/[locale]/layout.tsx"
git add middleware.ts "app/[locale]/layout.tsx"
git commit -m "feat(security): add a nonce-based CSP in report-only mode

The site shipped with no CSP while loading four third-party script origins
and rendering inline JSON-LD. This adds a per-request nonce in middleware
and emits the policy report-only, so violations can be read from real
traffic before anything is enforced.

Cookiebot's three origins are allowlisted deliberately: it injects its
banner at runtime, and a CSP that silently kills the consent banner would
recreate the compliance failure this work just fixed."
```

---

### Task 4: Enforce the CSP

**Do not start this task until the report-only policy from Task 3 has been deployed and observed for at least 48 hours of real traffic.**

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Collect violations from the deployed site**

In a browser on `https://www.aiva.hr`, open DevTools → Console and load the homepage, `/ai-recepcija`, `/kontakt`, and `/radovi`. Accept cookies, then start the voice demo. Record every `Content Security Policy` report-only warning.

- [ ] **Step 2: Widen the policy for each legitimate violation**

For each reported blocked origin that is genuinely needed, add it to the matching directive in `buildCsp`. Do not add `'unsafe-inline'` to `script-src` — if something needs it, nonce that script instead.

- [ ] **Step 3: Switch to enforcing**

In `middleware.ts`, change the header name:

```ts
response.headers.set("Content-Security-Policy", buildCsp(nonce));
```

- [ ] **Step 4: Verify the banner and demo still work**

```bash
npm run build && npx playwright test --project=chromium
```

Then in a clean browser profile on the deployed preview: confirm the Cookiebot banner renders, accepting it loads Chatbase, and starting the demo loads the widget. **If the banner does not render, revert to report-only immediately** — a missing banner is a compliance regression, not a cosmetic one.

- [ ] **Step 5: Commit**

```bash
git add middleware.ts
git commit -m "feat(security): enforce the CSP

Report-only ran against production traffic and the violations were either
allowlisted or fixed. Switching to enforcement."
```

---

### Task 5: Move contact-form processing into the EU

`x-vercel-id: fra1::iad1::` shows the function executing in US-East while the edge is in Frankfurt — every contact submission, including the visitor's IP, is processed in the United States for no reason.

**Files:**
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1: Pin the route's region**

Add near the top of `app/api/contact/route.ts`, after the imports:

```ts
// Keep contact submissions inside the EU. Without this the function runs in
// Washington while the edge sits in Frankfurt, making every message — and
// the sender's IP — a third-country transfer we never needed to make.
export const preferredRegion = ["fra1", "arn1"];
```

- [ ] **Step 2: Deploy and verify the execution region**

After deploying:

```bash
curl -sS -o /dev/null -D- -X POST https://www.aiva.hr/api/contact \
  -H "Content-Type: application/json" -d '{"bad":1}' | grep -i "^x-vercel-id"
```

Expected: `fra1::fra1::…` or `fra1::arn1::…`. The second segment is the function region and must no longer be `iad1`.

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "fix(privacy): run the contact route in the EU

The function executed in us-east-1 while the edge served from Frankfurt, so
every contact submission and the sender's IP were processed in the United
States. Pinned to fra1/arn1 — this removes a third-country transfer and
cuts a transatlantic round trip."
```

---

### Task 6: Replace in-memory rate limiting with Upstash Redis

The current limiter works (spec E6 — the header-spoof bypass was probed and does not work), but it is per-instance and its `Map` never evicts. Under concurrency the effective limit is a multiple of 3/minute, and the map grows unbounded for the life of an instance.

**Files:**
- Modify: `app/api/contact/route.ts`
- Modify: `package.json`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` from the Vercel integration.
- Produces: the same 429 response shape as today, so the client needs no change.

- [ ] **Step 1: Provision Upstash through the Marketplace**

Use the `vercel:marketplace` skill to discover and install the Upstash Redis integration for this project. It sets `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in the project environment automatically. Do not hand-roll a Redis client or hardcode credentials.

- [ ] **Step 2: Pull the new env vars locally**

```bash
vercel env pull .env.local
grep -c UPSTASH .env.local
```

Expected: `2`.

- [ ] **Step 3: Install the packages**

```bash
npm i @upstash/redis @upstash/ratelimit
```

- [ ] **Step 4: Replace the limiter**

In `app/api/contact/route.ts`, delete the `rateMap`, `RATE_LIMIT`, `RATE_WINDOW` and `checkRateLimit` block and replace it with:

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Shared, durable rate limiting.
 *
 * The previous limiter was an in-memory Map: correct in a single instance,
 * but serverless runs many, so the real ceiling was 3/minute *per instance*
 * and a cold start reset it. The Map also never evicted, so it grew for the
 * life of the instance. Redis makes the limit mean what it says.
 *
 * Falls back to allowing the request if Upstash is unreachable: a contact
 * form that silently stops accepting messages is a worse failure than one
 * that briefly accepts too many.
 */
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 m"),
        prefix: "contact",
        analytics: false,
      })
    : null;

async function checkRateLimit(ip: string): Promise<boolean> {
  if (!ratelimit) return true;
  try {
    const { success } = await ratelimit.limit(ip);
    return success;
  } catch (e) {
    console.error("Rate limit backend unreachable:", e);
    return true;
  }
}
```

Then change the call site to await it:

```ts
if (!(await checkRateLimit(ip))) {
```

- [ ] **Step 5: Verify locally**

```bash
npx tsc --noEmit && npm run build && npm run start &
sleep 8
for i in 1 2 3 4 5; do
  curl -s -o /dev/null -w "req $i → %{http_code}\n" -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" -d '{"bad":1}'
done
kill %1
```

Expected: the first three return 400, then 429.

- [ ] **Step 6: Document the new env vars**

Append to `.env.example`:

```bash
# ─── Rate limiting (Upstash Redis, via Vercel Marketplace) ────────────────────
# Set automatically by the Upstash integration. Without these the contact
# form falls back to allowing every request.
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 7: Commit**

```bash
npx prettier --write app/api/contact/route.ts
git add app/api/contact/route.ts package.json package-lock.json .env.example
git commit -m "fix(security): move contact rate limiting to Upstash Redis

The in-memory Map was per-instance, so the real ceiling was 3/minute per
running instance rather than per minute, and a cold start reset it. It also
never evicted entries, growing for the life of the instance.

Redis makes the limit mean what it says. It fails open if Upstash is
unreachable, because a contact form that silently stops accepting messages
is a worse outcome than one that briefly accepts too many."
```

---

### Task 7: Restrict the ElevenLabs agent to our own domains

**This task is not code.** `agent_8601m1k7w4cxe9ktwszx5d7471pb` is public in the page source; anyone can embed it on their own site and bill the conversations to this account.

- [ ] **Step 1: Add the domain allowlist**

In the ElevenLabs dashboard for that agent, set the allowed domains to exactly `www.aiva.hr` and `aiva.hr`, plus `localhost` if the demo is worked on locally.

- [ ] **Step 2: Verify enforcement**

Create a local HTML file embedding the agent and open it from `file://` or a different origin:

```html
<elevenlabs-convai agent-id="agent_8601m1k7w4cxe9ktwszx5d7471pb"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed"></script>
```

Expected: the widget refuses to start a call. If it works, the allowlist is not enforcing — check the dashboard before assuming it is fine.

- [ ] **Step 3: Confirm the real site still works**

Load `https://www.aiva.hr/ai-recepcija`, activate the demo, and confirm a call still connects.

---

### Task 8: Lock down the Sanity Studio

`GET /studio` returns 200 publicly and ships `visionTool`, an arbitrary GROQ console. Reading data still requires Sanity authentication, so this is surface reduction rather than a breach — but the Studio bundle is also where most of the dependency advisories live.

**Files:**
- Modify: `sanity.config.ts`

- [ ] **Step 1: Drop Vision from production builds**

In `sanity.config.ts`, replace the static `plugins` array:

```ts
plugins: [
  structureTool({
    structure: (S) =>
      S.list()
        .title("Sadržaj")
        .items([
          S.listItem()
            .title("📁 Projekti (Case Studies)")
            .child(S.documentTypeList("caseStudy").title("Projekti")),
          S.listItem()
            .title("🎬 Video oglasi")
            .child(S.documentTypeList("videoAd").title("Video oglasi")),
        ]),
  }),
  // Vision is an arbitrary GROQ console. It is genuinely useful while
  // building queries and has no place on a public production URL, so it
  // ships only in development.
  ...(process.env.NODE_ENV === "development" ? [visionTool()] : []),
],
```

- [ ] **Step 2: Verify Vision is gone from the production bundle**

```bash
npm run build && npm run start &
sleep 10
curl -s http://localhost:3000/studio | grep -ci "vision" || echo "0 — vision absent"
kill %1
```

Expected: `0 — vision absent`.

- [ ] **Step 3: Add Vercel Deployment Protection for the Studio path**

In the Vercel dashboard, enable Deployment Protection (Vercel Authentication or password) scoped to the `/studio` path. This is a dashboard action — record that it was done.

- [ ] **Step 4: Verify from an unauthenticated client**

```bash
curl -sS -o /dev/null -w "GET /studio → %{http_code}\n" -L https://www.aiva.hr/studio
```

Expected: `401` or a redirect to the Vercel auth page, not `200`.

- [ ] **Step 5: Commit**

```bash
npx prettier --write sanity.config.ts
git add sanity.config.ts
git commit -m "fix(security): keep Sanity Vision out of production

/studio is publicly reachable and shipped visionTool, an arbitrary GROQ
console, to that URL. Data access still required Sanity auth, so this is
surface reduction rather than a fix for a breach — but there is no reason
for a query console to exist on a public production route."
```

---

### Task 9: Correct the remaining response headers

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Replace the headers block**

In `vercel.json`, replace the `/(.*)` header set with:

```json
{
  "source": "/(.*)",
  "headers": [
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "X-Frame-Options", "value": "DENY" },
    { "key": "X-XSS-Protection", "value": "0" },
    { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
    { "key": "Permissions-Policy", "value": "camera=(), microphone=(self), geolocation=()" },
    { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains" },
    { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
  ]
}
```

`X-XSS-Protection: 0` is deliberate, not a removal: the legacy auditor it enables is deprecated and has itself been a source of vulnerabilities, so OWASP advises explicitly disabling it rather than leaving it on.

`includeSubDomains` is added without `preload` on purpose — preload is effectively irreversible, and should be a separate, deliberate decision.

- [ ] **Step 2: Deploy and verify against the real origin**

Platform-applied headers are invisible to a local run, so this must be checked against the deployed URL:

```bash
curl -sSI -L https://www.aiva.hr | grep -iE "strict-transport|x-xss|cross-origin-opener"
```

Expected: `max-age=63072000; includeSubDomains`, `x-xss-protection: 0`, `cross-origin-opener-policy: same-origin`.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "fix(security): correct HSTS, XSS auditor and COOP headers

Adds includeSubDomains to HSTS so a subdomain cannot be used to set cookies
for the parent, adds COOP to isolate the browsing context, and sets
X-XSS-Protection to 0 — the legacy auditor it enabled is deprecated and has
been a vulnerability source of its own, so it is disabled explicitly rather
than left on.

preload is deliberately not added: it is effectively irreversible and
deserves its own decision."
```

---

## Definition of done for P1

- [ ] `curl -sSI https://www.aiva.hr` shows an enforced `content-security-policy`, HSTS with `includeSubDomains`, COOP, and `x-xss-protection: 0`.
- [ ] The Cookiebot banner still renders and the voice demo still connects with the CSP enforced.
- [ ] `x-vercel-id` on `/api/contact` shows an EU function region.
- [ ] The ConvAI bundle loads from `/vendor/` and its version and hash are recorded in `docs/vendor-bundles.md`.
- [ ] Rate limiting survives a cold start (verify by waiting out an idle period and re-testing).
- [ ] The agent embedded on a foreign origin refuses to connect.
- [ ] `GET /studio` from an unauthenticated client does not return 200.
