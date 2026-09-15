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

| Header | State |
|---|---|
| `content-security-policy` | **MISSING** |
| `cross-origin-opener-policy` | **MISSING** |
| `strict-transport-security` | present, `max-age=63072000`, no `includeSubDomains`, no `preload` |
| `x-xss-protection` | `1; mode=block` — deprecated, OWASP advises `0` |
| `set-cookie` | `NEXT_LOCALE=hr; Path=/; SameSite=lax` — no `Secure`, undisclosed in cookie inventory |
| `x-vercel-id` | `fra1::iad1::…` — **function executes in US-East**, edge in Frankfurt |

### E6 — Rate limiter: pattern dangerous, exploit NOT confirmed

`route.ts:37-38` keys on `x-forwarded-for.split(",")[0]` — client-controlled by inspection. **Probed against production with four forged IPs while rate-limited: all returned 429.** Vercel overwrites the header. Not exploitable as deployed.

Real weaknesses that remain: in-memory `Map` is per-instance (concurrency multiplies the effective limit; cold starts reset it) and never evicts entries (unbounded growth).

### E7 — Other confirmed findings

- `route.ts:98` returns `detail: msg` — raw SDK error text to any caller.
- `unpkg.com/@elevenlabs/convai-widget-embed` — unversioned, no SRI. unpkg serves *latest*; a malicious publish executes arbitrary JS on the origin, including on the contact form.
- `agent_8601m1k7w4cxe9ktwszx5d7471pb` hardcoded and public — embeddable by third parties, billed to the account, unless domain-allowlisted in the ElevenLabs dashboard.
- `GET /studio` → 200, publicly reachable, ships `visionTool` (arbitrary GROQ console). Data access still requires Sanity auth.
- Visitor IP embedded in every notification email (`route.ts:88`). **Disclosed** in `privacy.s2Ip` — to the site's credit.
- Contact form links to the privacy policy at point of collection (`contact-form.tsx:233-237`) — Art. 13 satisfied there.
- `next/font` self-hosts Google Fonts at build time — avoids the Google Fonts transfer problem. Correctly disclosed in `privacy.s5Fonts`.

---

## Legal analysis

### GDPR / ePrivacy
- **Art. 5(3) ePrivacy** (Croatian *Zakon o elektroničkim komunikacijama*): storage/access on terminal equipment without prior consent. Violated by E1.
- **Art. 6**: no valid basis for the Chatbase and ElevenLabs processing as deployed. The policy asserts consent as the basis for the chat assistant; the script loads on page load. That assertion is currently false.
- **Art. 13**: voice processing wholly undisclosed (E2).
- **Art. 28**: DPA required with ElevenLabs. Status unknown — must be confirmed.
- **Art. 44/46**: undisclosed third-country transfer of voice data; contact-form processing additionally executes in the US (E5).
- **Art. 9 (open question):** voice recordings become special-category data if used for speaker identification. Requires written confirmation from ElevenLabs that no voiceprinting occurs. **Escalate to counsel.**

### EU AI Act
Article 50 (transparency for AI systems interacting with natural persons, and marking of synthetic audio) became applicable **2 August 2026**. In force as of this audit.
- *Website demo:* likely satisfied by context ("AI recepcija"), but disclosure should be explicit at call start rather than implied by a heading.
- *The product sold:* an AI receptionist answering real end-customer calls places obligations on Modelity and on its clients. Allocation between provider and deployer is a contractual question. **Escalate to counsel.**

### Croatian company law
**ZTD čl. 21** requires a d.o.o. to state on its website: full legal name, seat, the commercial court of registration and MBS number, share capital and whether paid in full. Currently `Modelity d.o.o.`, address and OIB appear **only inside the privacy policy**; MBS, court and share capital appear nowhere. The footer shows brand, email and copyright only.

### Minor legal items
- `NEXT_LOCALE` cookie absent from the cookie inventory; lacks `Secure`.
- Policy describes Plausible analytics; `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is unset in production, so it does not run.
- Privacy policy served `noIndex: true` — a transparency notice should be findable.

---

## Remediation phases

| Phase | Theme | Plan |
|---|---|---|
| **P0** | Stop the legal bleeding | `2026-09-15-p0-legal-critical.md` |
| **P1** | Security hardening | `2026-09-15-p1-hardening.md` |
| **P2** | Legal completeness | `2026-09-15-p2-legal-completeness.md` |

## Decisions taken

1. **Voice demo gating:** click-to-activate placeholder (two-click embed pattern), not Cookiebot-only gating. Preserves the demo for visitors who decline cookies and yields purpose-specific consent for voice processing.
2. **Scope:** all three phases planned.

## Facts required from the client (blockers, must not be invented)

- MBS number and registering commercial court for Modelity d.o.o.
- Share capital amount and whether paid in full.
- Board member name(s) as registered.
- Whether an ElevenLabs DPA is signed, and ElevenLabs' written position on voiceprinting.
- Whether the Cookiebot domain group includes `www.aiva.hr`.
