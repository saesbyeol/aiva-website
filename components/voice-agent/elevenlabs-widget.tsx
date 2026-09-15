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
