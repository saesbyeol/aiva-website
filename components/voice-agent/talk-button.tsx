"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Loader2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Starts a real conversation with the embedded ConvAI agent.
 *
 * The embed exposes no programmatic API (no methods on the custom element, no
 * events, no global), so the only way to start a call from our own UI is to
 * press the widget's own button inside its shadow root. That is a dependency on
 * someone else's internals, so the button treats "I could not find it" as a
 * first-class state: it stays disabled until the control has actually been
 * located, and never renders as a live button that does nothing.
 */

/** The widget's primary action, preferred by label and falling back to order. */
function findCallControl(): HTMLButtonElement | null {
  const host = document.querySelector("elevenlabs-convai");
  const root = host?.shadowRoot;
  if (!root) return null;

  const buttons = Array.from(root.querySelectorAll("button"));
  if (buttons.length === 0) return null;

  // The label is localised by the widget, so matching it is a preference, not a
  // requirement. The call action is the first button in every layout we have
  // seen; the second is the text-chat toggle.
  const labelled = buttons.find((b) => {
    const name = `${b.getAttribute("aria-label") ?? ""} ${b.textContent ?? ""}`;
    return /poziv|call|razgovor|speak|talk/i.test(name);
  });
  return (labelled ?? buttons[0]) as HTMLButtonElement;
}

export function TalkButton({
  variant = "primary",
  className,
}: {
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const t = useTranslations("voiceAgent.demo");
  const [ready, setReady] = React.useState(false);

  // The embed is loaded with afterInteractive and upgrades the element some
  // time later, so poll until its control exists rather than assuming it does.
  React.useEffect(() => {
    if (findCallControl()) {
      setReady(true);
      return;
    }
    const timer = setInterval(() => {
      if (findCallControl()) {
        setReady(true);
        clearInterval(timer);
      }
    }, 400);
    // Give up quietly after 20s; the button stays disabled and labelled as
    // unavailable instead of pretending to work.
    const stop = setTimeout(() => clearInterval(timer), 20000);
    return () => {
      clearInterval(timer);
      clearTimeout(stop);
    };
  }, []);

  const start = () => {
    const control = findCallControl();
    if (!control) {
      setReady(false);
      return;
    }
    control.click();
    // The widget is fixed to the corner, so move the eye to it after the click.
    document.querySelector("elevenlabs-convai")?.scrollIntoView({ block: "nearest" });
  };

  return (
    <Button
      type="button"
      size="lg"
      variant={variant}
      className={className}
      onClick={start}
      disabled={!ready}
    >
      {ready ? (
        <Mic className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <Loader2
          className="h-4 w-4 shrink-0 motion-safe:animate-spin"
          aria-hidden="true"
        />
      )}
      <span className="min-w-0 truncate">{ready ? t("cta") : t("ctaLoading")}</span>
    </Button>
  );
}
