"use client";

import * as React from "react";
import Script from "next/script";

/**
 * ElevenLabs ConvAI embed: a floating widget that lets a visitor hold a real
 * conversation with the agent this page describes.
 *
 * The custom element is rendered immediately but stays inert until the embed
 * script upgrades it, so nothing blocks first paint. `afterInteractive` keeps
 * the bundle off the critical path while still loading it without a user
 * gesture, because the point of the widget is that it is already there when
 * someone decides to try it.
 *
 * The site-wide Chatbase bubble claims the same bottom-right corner at a
 * near-maximum z-index, so this component hides it for as long as it is
 * mounted: on the page about the voice agent, the voice agent is the demo.
 * Suppressing it from here (rather than in the layout) means the rule cannot
 * outlive the widget, including across client-side navigation.
 */
export function ElevenLabsWidget({
  agentId,
  language,
}: {
  agentId: string;
  language: string;
}) {
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.add("voice-widget-active");
    return () => root.classList.remove("voice-widget-active");
  }, []);

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
