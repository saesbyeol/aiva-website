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
 * through.
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
  const overrideNames = existingOverrides
    ? existingOverrides.split(",").map((name) => name.trim())
    : [];
  if (!overrideNames.includes("x-nonce")) overrideNames.push("x-nonce");
  response.headers.set("x-middleware-override-headers", overrideNames.join(","));
  response.headers.set("x-middleware-request-x-nonce", nonce);

  // Report-only for now: read the violations before enforcing, because a CSP
  // that breaks the consent banner is worse than no CSP at all.
  response.headers.set("Content-Security-Policy-Report-Only", buildCsp(nonce));
  return response;
}

export const config = {
  // Match everything except /studio, /api, Next internals, and files with a dot.
  matcher: ["/((?!studio|api|_next|_vercel|.*\\..*).*)"],
};
