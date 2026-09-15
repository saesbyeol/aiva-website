import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const CSP_REPORT_URI = "/api/csp-report";
const CSP_REPORT_TO_GROUP = "csp-endpoint";

/**
 * Build the CSP for one request.
 *
 * Cookiebot is the fragile part: it injects its banner's scripts and styles
 * at runtime, so its three origins must be allowlisted or the consent banner
 * silently stops rendering — which is exactly the failure this site already
 * had once. 'unsafe-inline' stays on style-src because Cookiebot and the
 * inline SVG styles need it; script-src uses a nonce instead.
 *
 * 'strict-dynamic' means that in any browser that supports it, the host
 * entries below (consent.cookiebot.com, chatbase.co, plausible.io) are
 * IGNORED for script-src — only the nonced script tags, and scripts those
 * nonced scripts load dynamically, are trusted. The host entries are kept
 * only as a fallback for the (now rare) browsers that don't understand
 * 'strict-dynamic' and fall back to the host allowlist instead. This makes
 * nonce propagation to every first-party <Script> — not the host list — the
 * thing that actually keeps Cookiebot, Chatbase, Plausible and the ConvAI
 * widget working; see the widget components for where the nonce is threaded
 * through. 'blob:' is also allowed here because the ConvAI widget's
 * AudioWorklet is loaded from a blob: URL, not a normal script tag.
 */
function buildCsp(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' blob: https://consent.cookiebot.com https://consentcdn.cookiebot.com https://www.chatbase.co https://plausible.io`,
    // fonts.googleapis.com: the ConvAI bundle does
    // `@import "https://fonts.googleapis.com/css2?family=Inter..."` from its
    // own injected stylesheet, so the stylesheet host itself needs
    // allowlisting here (the actual font files are covered by font-src).
    `style-src 'self' 'unsafe-inline' https://consentcdn.cookiebot.com https://fonts.googleapis.com`,
    // storage.googleapis.com: the ConvAI widget's language selector loads
    // circle-flag images from the eleven-public-cdn bucket there.
    `img-src 'self' data: blob: https://cdn.sanity.io https://imgsct.cookiebot.com https://consentcdn.cookiebot.com https://storage.googleapis.com`,
    // fonts.gstatic.com: actual webfont files for the Google Fonts stylesheet
    // above. consentcdn.cookiebot.com: kept in case the Cookiebot banner's
    // own CSS references a webfont from the same CDN it already serves from.
    `font-src 'self' data: https://fonts.gstatic.com https://consentcdn.cookiebot.com`,
    // ElevenLabs hosts below were read directly out of the vendored bundle
    // (public/vendor/convai-widget-embed.js), not guessed — the microphone
    // path that reaches them was never exercised by the automated browser
    // that produced the original allowlist, since it never granted mic
    // permission. wss://livekit.rtc.elevenlabs.io is the actual realtime
    // call transport (LiveKit); the api.*.elevenlabs.io hosts (plus their
    // eu/in/us "residency" variants) are the config/session endpoints. If
    // the bundle is ever re-vendored at a new version, re-grep it for hosts
    // rather than trusting this list to still be complete.
    `connect-src 'self' https://consent.cookiebot.com https://consentcdn.cookiebot.com https://www.chatbase.co https://plausible.io https://api.elevenlabs.io https://api.us.elevenlabs.io https://api.eu.residency.elevenlabs.io https://api.in.residency.elevenlabs.io wss://api.elevenlabs.io wss://api.us.elevenlabs.io wss://api.eu.residency.elevenlabs.io wss://api.in.residency.elevenlabs.io wss://livekit.rtc.elevenlabs.io`,
    `media-src 'self' blob: https://cdn.sanity.io`,
    // 'self' is required here because components/sections/works-gallery.tsx
    // (the portfolio grid) and app/[locale]/radovi/[slug]/page.tsx (the case
    // study detail page) both render <iframe src={work.externalUrl}> live
    // previews of client sites, and frame-src being explicitly set means it
    // gets NO default-src fallback — without 'self' those iframes render
    // nothing. This directive cannot be completed with a static allowlist:
    // the framed origins are arbitrary client-site URLs stored as CMS
    // content (Sanity `externalUrl` fields), not known at build time.
    // Enforcing this directive for real requires either (a) generating
    // frame-src per request from the set of externalUrl hosts fetched from
    // Sanity for that page, or (b) replacing the live iframe previews with
    // static screenshots so frame-src can go back to a fixed allowlist.
    // That's a product/architecture call for the site owner, not something
    // to decide here.
    `frame-src 'self' https://consentcdn.cookiebot.com https://www.chatbase.co`,
    `frame-ancestors 'none'`,
    `base-uri 'none'`,
    `object-src 'none'`,
    `form-action 'self'`,
    // Falls back to default-src 'self' when absent, which would block the
    // ConvAI widget's AudioWorklet — it's instantiated from a blob: URL.
    `worker-src 'self' blob:`,
    `upgrade-insecure-requests`,
    // Report-only collector: without these, violations only ever reach each
    // visitor's own browser console and the observation window collects
    // nothing. report-uri is the legacy but still widely-supported
    // mechanism; report-to/Reporting-Endpoints is the current one. Browsers
    // that support both will send both, which is fine — the endpoint
    // de-dupes nothing but costs nothing either.
    `report-uri ${CSP_REPORT_URI}`,
    `report-to ${CSP_REPORT_TO_GROUP}`,
  ].join("; ");
}

export default function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  // Run next-intl's middleware on the *original* request. The brief's
  // original approach wrapped the request in `new Request(request, {
  // headers })` before handing it to next-intl — but a plain Request loses
  // NextRequest-only properties (`.nextUrl`, `.cookies`, geo, etc.) that
  // next-intl's routing relies on, which broke locale resolution entirely:
  // "/" started 404ing instead of serving the default (Croatian) locale.
  // Verified by reverting to the brief's version and re-testing — same
  // regression. So next-intl must see the real NextRequest.
  const response = intlMiddleware(request);

  // Hand the nonce to the render pass via a request header. This is the
  // same mechanism `NextResponse.next({ request: { headers } })` uses
  // internally (see Next.js's `handleMiddlewareField`) — since next-intl
  // already produced the response (a rewrite for the default-locale root,
  // a redirect, or a plain next), we attach the override headers to that
  // response directly rather than constructing a second, competing
  // NextResponse that would discard next-intl's rewrite/redirect target.
  const existingOverrides = response.headers.get("x-middleware-override-headers");
  // Next treats x-middleware-override-headers as the COMPLETE set of
  // request headers for the render pass — any header not named here gets
  // deleted, not just left alone. Today every path we hit already gets a
  // full list from next-intl, so falling back to [] has never mattered in
  // practice. But if some future path ever returns a response without one,
  // falling back to [] would mean the render receives x-nonce as its ONLY
  // request header — silently dropping cookie, host, accept-language and
  // RSC routing headers with no error. Seeding from the real incoming
  // request headers instead means an empty existing list degrades to "keep
  // everything we already had," not "keep nothing."
  const overrideNames = existingOverrides
    ? existingOverrides.split(",").map((name) => name.trim())
    : Array.from(request.headers.keys());
  if (!overrideNames.includes("x-nonce")) overrideNames.push("x-nonce");
  // Next reads the nonce for its own /_next/static/chunks/*.js tags from the
  // REQUEST header `content-security-policy-report-only`. Locally that
  // header exists only because Next's Node router-server happens to copy
  // middleware response headers back onto the request — an implementation
  // detail, not a documented contract. On Vercel the documented channel
  // from middleware to the origin request is x-middleware-request-*, and if
  // response headers aren't mirrored there, every chunk tag would render
  // with no nonce — a violation flood now, and (once 'strict-dynamic' voids
  // 'self') a dead site on enforcement. Overriding this header explicitly,
  // the same way x-nonce is, makes the render pass receive it
  // deterministically instead of by luck.
  if (!overrideNames.includes("content-security-policy-report-only")) {
    overrideNames.push("content-security-policy-report-only");
  }
  response.headers.set("x-middleware-override-headers", overrideNames.join(","));
  response.headers.set("x-middleware-request-x-nonce", nonce);
  response.headers.set("x-middleware-request-content-security-policy-report-only", csp);

  // Report-only for now: read the violations before enforcing, because a CSP
  // that breaks the consent banner is worse than no CSP at all.
  response.headers.set("Content-Security-Policy-Report-Only", csp);
  // Reporting API v1 endpoint group referenced by the `report-to` directive
  // above. Set alongside the CSP header so both reporting mechanisms point
  // at the same collector.
  response.headers.set(
    "Reporting-Endpoints",
    `${CSP_REPORT_TO_GROUP}="${CSP_REPORT_URI}"`
  );
  return response;
}

export const config = {
  // Match everything except /studio, /api, Next internals, and files with a dot.
  matcher: ["/((?!studio|api|_next|_vercel|.*\\..*).*)"],
};
