"use client";

import * as React from "react";
import Script from "next/script";
import { useVoiceDemo } from "./voice-demo-provider";

/**
 * ElevenLabs ConvAI embed, loaded only after the visitor explicitly starts
 * the demo.
 *
 * Returning null before activation is what makes this a gate rather than a
 * cosmetic one: no custom element, no embed script, no request to
 * /vendor/convai-widget-embed.js or to api.us.elevenlabs.io, and no
 * microphone prompt until the visitor has read what the demo does and
 * pressed the button.
 *
 * The site-wide Chatbase bubble claims the same bottom-right corner at a
 * near-maximum z-index, so this component hides it for as long as it is
 * mounted: on the page about the voice agent, the voice agent is the demo.
 */
export function ElevenLabsWidget({
  agentId,
  language,
  nonce,
}: {
  agentId: string;
  language: string;
  nonce?: string;
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
      {/* Served from our own origin, pinned to the version recorded in
          docs/vendor-bundles.md. unpkg's bare package URL resolves to whatever
          is newest at request time with no integrity check, which would let a
          malicious publish run arbitrary JavaScript on this origin — the same
          origin as the contact form.

          `nonce` is the per-request CSP nonce, threaded down from the page.
          Next.js does not apply it to next/script automatically; without it
          this script is blocked once the CSP is enforced. `script-src 'self'`
          already covers this origin, but the nonce is required too once
          'strict-dynamic' is present — strict-dynamic makes the host
          allowlist (including 'self') irrelevant for script-src. */}
      <Script
        src="/vendor/convai-widget-embed.js"
        strategy="afterInteractive"
        nonce={nonce}
      />
    </>
  );
}
