# Security & GDPR Audit — aiva.hr (Modelity d.o.o.)

**Date:** 2026-09-15
**Scope:** Full application — source, production deployment, browser runtime, dependency tree, legal text.
**Auditor method:** static read of all server entrypoints and config; live header and API probing against `www.aiva.hr`; browser runtime inspection of consent state and network activity; `npm audit` on the production dependency tree; line-by-line review of the GDPR policy against the code's actual data flows.

---

## Executive summary

The legal writing is stronger than the engineering that backs it. The privacy policy is a genuine, well-structured GDPR document (controller identity with OIB, per-purpose Art. 6 bases, retention schedule, named processors, Art. 46 transfer basis, AZOP complaint route). The defect is that **it describes a more compliant site than the one actually deployed**, and two of those gaps are provable.

The single largest exposure is that a paid consent-management platform is installed, correctly configured on the page, and **completely inert in production** — creating the appearance of compliance while providing none.

---

## Evidence

### E1 — Consent layer inert (browser runtime, `www.aiva.hr/ai-recepcija`)

```
Cookiebot.regulations.gdprApplies : true
Cookiebot.consentLevel            : "strict"
Cookiebot.hasResponse             : false     ← visitor consented to nothing
document#CybotCookiebotDialog     : absent    ← banner NEVER rendered
scripts[type="text/plain"]        : []        ← zero scripts deferred
```

Simultaneously loaded and executing, with no consent:

- `https://www.chatbase.co/embed.min.js`
- `https://unpkg.com/@elevenlabs/convai-widget-embed` (widget upgraded, `shadowRoot` present)

Confirmed live network call: `OPTIONS https://www.chatbase.co/api/get-chatbot-styles/EbGKmwn46Oc5zd54aPaAF` → 204.

Three independent causes:

1. Banner never renders. Leading hypothesis (unproven): the Cookiebot domain group is registered for `aiva.hr`, but the site serves from `www.aiva.hr` (apex 307-redirects to www).
2. `async` on the Cookiebot tag (`app/[locale]/layout.tsx:90`) defeats pre-execution interception. The adjacent code comment states the script "must be first script so it can block others before they run" — the `async` contradicts it.
3. Auto-blocking only defers domains in Cookiebot's tracker database; `chatbase.co` and `unpkg.com` are not in it, so auto-blocking cannot gate them under any configuration.

### E2 — Voice agent legally invisible

```
messages/hr.json privacy.*  → elevenlabs:False  microphone:False  voice:False
messages/en.json privacy.*  → elevenlabs:False  microphone:False  voice:False
```

Commit timeline:

- `075032a` 2026-09-08 — GDPR policy lands
- `d577e91` 2026-09-08 — AI recepcija product page
- `4ef29b2` 2026-09-14 — "rebuild the AI recepcija page around a **live demo**"
- privacy copy changed since `075032a`: **0 lines**

The site captures visitor microphone audio and transmits it to a US processor. The policy discloses: no ElevenLabs processor, no voice/audio data category, no retention period for it, no Art. 46 basis for the transfer, no mention of microphone access.

### E3 — HTML injection into operator inbox

`app/api/contact/route.ts:77-90` interpolates unescaped attacker-controlled strings into an HTML email body:

```ts
<td ...>${data.name}</td>
<p  ...>${data.message}</p>   // up to 2000 chars, no escaping
```

Zod validates length, not content. `email` is constrained by zod's validator; `name`, `company`, `message` are free-form.

### E4 — Dependency vulnerabilities (production tree)

`npm audit --omit=dev`: 44 total — 2 critical, 21 high.

- **`next@16.1.6` (direct) — CRITICAL: HTTP request smuggling in rewrites.** Fix: `16.3.5`, non-breaking minor.
- `nodemailer` (direct) — HIGH SMTP command injection. **Imported nowhere in source: dead dependency.**
- Remainder largely transitive via `sanity`/`@sanity/vision` studio toolchain.

### E5 — Live response headers (`https://www.aiva.hr`)

| Header                       | State                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| `content-security-policy`    | **MISSING**                                                                           |
| `cross-origin-opener-policy` | **MISSING**                                                                           |
| `strict-transport-security`  | present, `max-age=63072000`, no `includeSubDomains`, no `preload`                     |
| `x-xss-protection`           | `1; mode=block` — deprecated, OWASP advises `0`                                       |
| `set-cookie`                 | `NEXT_LOCALE=hr; Path=/; SameSite=lax` — no `Secure`, undisclosed in cookie inventory |
| `x-vercel-id`                | `fra1::iad1::…` — **function executes in US-East**, edge in Frankfurt                 |

### E6 — Rate limiter: pattern dangerous, exploit NOT confirmed

`route.ts:37-38` keys on `x-forwarded-for.split(",")[0]` — client-controlled by inspection. **Probed against production with four forged IPs while rate-limited: all returned 429.** Vercel overwrites the header. Not exploitable as deployed.

Real weaknesses that remain: in-memory `Map` is per-instance (concurrency multiplies the effective limit; cold starts reset it) and never evicts entries (unbounded growth).

### E7 — Other confirmed findings

- `route.ts:98` returns `detail: msg` — raw SDK error text to any caller.
- `unpkg.com/@elevenlabs/convai-widget-embed` — unversioned, no SRI. unpkg serves _latest_; a malicious publish executes arbitrary JS on the origin, including on the contact form.
- `agent_8601m1k7w4cxe9ktwszx5d7471pb` hardcoded and public — embeddable by third parties, billed to the account, unless domain-allowlisted in the ElevenLabs dashboard.
- `GET /studio` → 200, publicly reachable, ships `visionTool` (arbitrary GROQ console). Data access still requires Sanity auth.
- Visitor IP embedded in every notification email (`route.ts:88`). **Disclosed** in `privacy.s2Ip` — to the site's credit.
- Contact form links to the privacy policy at point of collection (`contact-form.tsx:233-237`) — Art. 13 satisfied there.
- `next/font` self-hosts Google Fonts at build time — avoids the Google Fonts transfer problem. Correctly disclosed in `privacy.s5Fonts`.

---

## Legal analysis

### GDPR / ePrivacy

- **Art. 5(3) ePrivacy** (Croatian _Zakon o elektroničkim komunikacijama_): storage/access on terminal equipment without prior consent. Violated by E1.
- **Art. 6**: no valid basis for the Chatbase and ElevenLabs processing as deployed. The policy asserts consent as the basis for the chat assistant; the script loads on page load. That assertion is currently false.
- **Art. 13**: voice processing wholly undisclosed (E2).
- **Art. 28**: DPA required with ElevenLabs. Status unknown — must be confirmed.
- **Art. 44/46**: undisclosed third-country transfer of voice data; contact-form processing additionally executes in the US (E5).
- **Art. 9 (open question):** voice recordings become special-category data if used for speaker identification. Requires written confirmation from ElevenLabs that no voiceprinting occurs. **Escalate to counsel.**

### EU AI Act

Article 50 (transparency for AI systems interacting with natural persons, and marking of synthetic audio) became applicable **2 August 2026**. In force as of this audit.

- _Website demo:_ likely satisfied by context ("AI recepcija"), but disclosure should be explicit at call start rather than implied by a heading.
- _The product sold:_ an AI receptionist answering real end-customer calls places obligations on Modelity and on its clients. Allocation between provider and deployer is a contractual question. **Escalate to counsel.**

### Croatian company law

**ZTD čl. 21** requires a d.o.o. to state on its website: full legal name, seat, the commercial court of registration and MBS number, share capital and whether paid in full. Currently `Modelity d.o.o.`, address and OIB appear **only inside the privacy policy**; MBS, court and share capital appear nowhere. The footer shows brand, email and copyright only.

### Minor legal items

- `NEXT_LOCALE` cookie absent from the cookie inventory; lacks `Secure`.
- Policy describes Plausible analytics; `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is unset in production, so it does not run.
- Privacy policy served `noIndex: true` — a transparency notice should be findable.

---

## Remediation phases

| Phase  | Theme                   | Plan                                  |
| ------ | ----------------------- | ------------------------------------- |
| **P0** | Stop the legal bleeding | `2026-09-15-p0-legal-critical.md`     |
| **P1** | Security hardening      | `2026-09-15-p1-hardening.md`          |
| **P2** | Legal completeness      | `2026-09-15-p2-legal-completeness.md` |

## Decisions taken

1. **Voice demo gating:** click-to-activate placeholder (two-click embed pattern), not Cookiebot-only gating. Preserves the demo for visitors who decline cookies and yields purpose-specific consent for voice processing.
2. **Scope:** all three phases planned.

## Facts required from the client (blockers, must not be invented)

- MBS number and registering commercial court for Modelity d.o.o.
- Share capital amount and whether paid in full.
- Board member name(s) as registered.
- Whether an ElevenLabs DPA is signed, and ElevenLabs' written position on voiceprinting.
- Whether the Cookiebot domain group includes `www.aiva.hr`.

---

## Post-remediation verification — 2026-09-15

Branch `fix/security-gdpr-p0`, 12 commits, `e29900e..44936bf`.

**Verified state at HEAD** (cold run, port 3000 confirmed free beforehand):

```
Playwright:  75 passed, 1 skipped   (26s, both projects)   — baseline was 22
tsc:         clean
npm audit:   {'low': 2, 'moderate': 19, 'high': 19, 'critical': 1, 'total': 41}
                                                            — baseline was 44 total, 2 critical, 21 high
```

### Finding status

| Finding                                   | Status                     | Evidence                                                                                                                                                                                                                                                                                          |
| ----------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **E1** consent layer inert                | **Partially closed**       | Cause 2 (`async`) fixed. Cause 3 (auto-blocking cannot gate chatbase/unpkg) fixed in React for both. **Cause 1 — the banner never renders — is untouched and is a dashboard action (Task 9).** Trackers no longer execute without consent; the consent _interface_ is still absent in production. |
| **E2** voice agent legally invisible      | **Closed in code**         | ElevenLabs disclosed as processor, voice data as a category, consent as Art. 6 basis, retention row — both locales, verified rendered. Two caveats below.                                                                                                                                         |
| **E3** HTML injection into operator inbox | **Closed**                 | All five interpolations escaped via `lib/escape-html.ts`; the adjacent CRLF header-injection path found during review was closed too. Tests are exact-string and were mutation-verified.                                                                                                          |
| **E4** dependency vulnerabilities         | **Partially closed**       | `next@16.3.5` exact-pinned, `nodemailer` removed. **1 critical remains** (`tar@7.5.11` via `@sanity/vision`). The P0 definition of done says "no critical" — that bullet is NOT met.                                                                                                              |
| E5, E6, E7                                | Out of P0 scope, untouched | —                                                                                                                                                                                                                                                                                                 |

### Open items that cannot be closed in this repository

1. **Task 9 — Cookiebot domain group.** Until `www.aiva.hr` is registered, `useConsent()` never reports consent, so Chatbase is off site-wide while `privacy.s8Manage` tells visitors they can manage consent through a banner that does not render. **Task 9 belongs in the same deploy window as this merge, not later.**
2. **Task 10 — ElevenLabs DPA.** `privacy.s5Body` states that listed processors have Art. 28 agreements in place, and this branch adds ElevenLabs to that list. That sentence is false until the DPA is signed. **Deploy gate.**
3. **Art. 9 voiceprinting question** — unanswered; needs ElevenLabs' written position.
4. **The 30-day retention figure** is disclosed but unverified against the ElevenLabs dashboard.

### Known-and-accepted, with owners

- **Withdrawing marketing consent does not unload Chatbase.** The embed injects itself onto `document.body`; unmounting the React `<Script>` leaves the global, bubble and its storage alive. Correct remedy is a forced reload on withdrawal — a product decision with UX cost — or an accepted limitation. Moot until Task 9.
- **No test exercises the real Cookiebot.** A fake `window.Cookiebot` now proves the gate can open, but the live CMP path is untestable locally because the env var is unset.
- **`privacy.s2Groups[0].items` lists an "indicative budget" field the contact form does not collect.** Pre-existing, not introduced here. P2 candidate.
- **`middleware` file convention is deprecated in Next 16.3** in favour of `proxy`. P1 Task 3 rewrites that exact file and must decide deliberately.

### Carried into P1 with new information

- **P1 Task 2** — unpkg currently resolves `@elevenlabs/convai-widget-embed` to **0.18.2**. That is the version to vendor and hash. Note the script now loads on a click the site actively invites, so this should not slip.
- **P1 Task 8** — `@sanity/vision` is a _production_ dependency. Moving it to `devDependencies` drops `tar` out of the production tree and closes the last critical as a side effect, rather than needing a new task.

### Corrections to the plans themselves, found during execution

- P0 Task 8 Step 8's English URL was wrong (`/en/privatnost` 307s; the real path is `/en/privacy`).
- P0 Task 7's test asserted `expect([200,400,429]).toContain(status)`, which cannot fail. Replaced with a real unit spec.
- P0 Task 6 Step 6's prose contradicted its own code block on hook ordering.
- P0 Tasks 6 and 8 both claimed a repo test enforces message-catalogue key parity. **No such test exists.** A ~10-line parity test is a strong P2 candidate — next-intl renders the key path rather than throwing, so a missing English key would silently display `privacy.s2Groups.5.desc` on the legal page.
- **P2 Task 4** tells the operator to enable Plausible, asserting "the existing policy text already covers it accurately." It did not — the policy claims consent as the basis while the script was ungated. Fixed in this branch by gating the code; the P2 sentence should be corrected when that task runs.

---

## Correction to E1's root-cause hypothesis — 2026-09-15, post-deploy

The audit stated that the consent banner "never renders" and named as its
leading hypothesis a domain-group mismatch (`aiva.hr` registered while the
site serves `www.aiva.hr`). **Both parts need correcting.**

**What was actually true.** Two separate causes were conflated:

1. The committed `NEXT_PUBLIC_COOKIEBOT_ID` belonged to a Cookiebot account
   that had been retired. The script loaded and served nothing. This was the
   real configuration fault, and it is fixed — the current domain group is
   `1ee10f88-bd07-4af5-9648-e8c99eec697b`.
2. The observation that no banner rendered was **contaminated by the
   auditing browser**, which sends `navigator.globalPrivacyControl: true`
   and `doNotTrack: "1"`. Cookiebot honours GPC by auto-declining every
   optional category and suppressing the banner, since the visitor has
   already expressed a preference at the browser level. That is correct,
   compliant behaviour, not a defect — and it produces exactly the
   fingerprint the audit misread as a broken banner: `hasResponse: false`,
   no dialog in the DOM, every category false.

Verified after deploy, on `www.aiva.hr`:

- Cookiebot's config endpoint returns a full banner config for
  `www.aiva.hr`, and the explicit "domain is not authorized" error for
  `localhost` — so domain authorisation works and was never the fault.
- `Cookiebot.renew()` renders the dialog (2560x338) with all four
  categories and `www.aiva.hr` listed as scanned.
- The site owner confirms the banner appears normally in a browser without
  privacy extensions.

**The audit's substantive finding is unaffected, and was in fact understated.**
E1's core claim — that Chatbase and ElevenLabs executed before any consent —
was measured in a browser actively signalling Global Privacy Control. The
trackers loaded anyway. A visitor transmitting an explicit do-not-track
signal was tracked regardless, which is a worse fact than the one the audit
recorded.

**Lesson for future audits of consent behaviour:** the auditing browser's own
privacy signals are part of the measurement apparatus. Record
`navigator.globalPrivacyControl` and `navigator.doNotTrack` alongside any
consent-state observation, and confirm banner behaviour in a clean profile
before attributing absence to server-side misconfiguration.

## End-to-end verification of the consent gate — 2026-09-15, production

The path no test could exercise locally, confirmed on `www.aiva.hr`:

| State                                                        | Chatbase                              | Plausible                                          |
| ------------------------------------------------------------ | ------------------------------------- | -------------------------------------------------- |
| `hasResponse: false`, all categories denied                  | not loaded                            | not loaded                                         |
| `submitCustomConsent(true,true,true)` → `method: "explicit"` | **loaded**, `window.chatbase` present | not loaded (env var unset in production — correct) |

The gate closes and opens as designed.
