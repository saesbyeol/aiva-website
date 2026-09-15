"use client";

import Script from "next/script";
import { useConsent } from "./consent-provider";

/**
 * Plausible analytics, gated behind statistics consent.
 *
 * The privacy policy states consent (Art. 6(1)(a)) as the lawful basis for
 * analytics cookies and says they are "set only with your consent" — that is
 * the more conservative legal position and it is already written, so the
 * code has to make it true rather than the other way around. The domain is
 * read from the env var in the server layout and passed in as a prop; this
 * component only decides whether to render.
 *
 * `nonce` is the per-request CSP nonce from `middleware.ts`, threaded down
 * from the root layout. Next.js does not apply it to `next/script`
 * automatically, so it has to be passed explicitly or this script is
 * blocked once the CSP is enforced.
 */
export function PlausibleAnalytics({
  domain,
  nonce,
}: {
  domain: string;
  nonce?: string;
}) {
  const { statistics } = useConsent();
  if (!statistics) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  );
}
