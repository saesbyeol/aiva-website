"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Loader2, Mic, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useVoiceDemo } from "./voice-demo-provider";
import { ActivateDemoCard } from "./activate-demo-card";

/**
 * Starts a real conversation with the embedded ConvAI agent.
 *
 * The embed exposes no programmatic API (no methods on the custom element, no
 * events, no global), so the only way to start a call from our own UI is to
 * press the widget's own button inside its shadow root. That is a dependency on
 * someone else's internals, so the button treats "I could not find it" as a
 * first-class state rather than rendering a control that does nothing.
 *
 * The widget also fails for a predictable slice of real visitors: ad blockers
 * and privacy extensions block api.us.elevenlabs.io, the config fetch dies with
 * ERR_BLOCKED_BY_CLIENT, and the element never upgrades. That is not an error
 * we can catch from outside the widget, so it surfaces as the control never
 * appearing. Rather than leave a spinner up forever, give up after a bounded
 * wait and say what happened, with a way to reach a human instead.
 */

/** How long to wait for the widget before declaring it unavailable. */
const GIVE_UP_AFTER_MS = 10_000;

type State = "loading" | "ready" | "unavailable";

// The widget localises every label, so these are a preference, not a contract.
const CALL_LABEL = /poziv|call|razgovor|speak|talk|anruf|chiama|llamada|appel|ring/i;

// Controls that sit alongside the call button and must never be pressed in its
// place: send-message, collapse, expand, and the in-call controls.
const NOT_CALL_LABEL =
  /pošalji|posalji|send|sažmi|sazmi|collapse|expand|minimi|zatvori|close|mute|mikrofon|završi|zavrsi|end|hang/i;

/**
 * The widget's primary call action.
 *
 * Ordering is not a safe fallback: the widget renders a send-message button
 * before the call button, so taking the first button would start a chat rather
 * than a call. Prefer an explicit label match, then fall back to the largest
 * remaining control, since the call action is a full-width pill while the
 * others are small icon buttons. Position is never used.
 */
function findCallControl(): HTMLButtonElement | null {
  const root = document.querySelector("elevenlabs-convai")?.shadowRoot;
  if (!root) return null;

  const named = Array.from(root.querySelectorAll("button")).map((el) => ({
    el: el as HTMLButtonElement,
    name: `${el.getAttribute("aria-label") ?? ""} ${el.textContent ?? ""}`,
  }));
  if (named.length === 0) return null;

  const byLabel = named.find(
    (b) => CALL_LABEL.test(b.name) && !NOT_CALL_LABEL.test(b.name)
  );
  if (byLabel) return byLabel.el;

  const candidates = named.filter((b) => !NOT_CALL_LABEL.test(b.name));
  if (candidates.length === 0) return null;

  return candidates.reduce((widest, b) =>
    b.el.getBoundingClientRect().width > widest.el.getBoundingClientRect().width
      ? b
      : widest
  ).el;
}

function useWidgetState(activated: boolean): State {
  const [state, setState] = React.useState<State>("loading");

  React.useEffect(() => {
    if (!activated) return;

    if (findCallControl()) {
      setState("ready");
      return;
    }
    const poll = setInterval(() => {
      if (findCallControl()) {
        setState("ready");
        clearInterval(poll);
      }
    }, 400);
    const giveUp = setTimeout(() => {
      clearInterval(poll);
      setState((s) => (s === "ready" ? s : "unavailable"));
    }, GIVE_UP_AFTER_MS);

    return () => {
      clearInterval(poll);
      clearTimeout(giveUp);
    };
  }, [activated]);

  return state;
}

export function TalkButton({
  className,
  /**
   * What to render when the widget never arrives. The hero already carries a
   * "get in touch" CTA next to this one, so it hides; the demo section is
   * entirely about the widget, so it explains itself instead of going blank.
   */
  whenUnavailable = "hide",
}: {
  className?: string;
  whenUnavailable?: "hide" | "explain";
}) {
  const t = useTranslations("voiceAgent.demo");
  const { activated } = useVoiceDemo();
  const state = useWidgetState(activated);

  // Before activation there is no widget to drive, so the button is replaced
  // by the notice that starts it. The hero already carries its own CTA, so
  // only the demo section renders the card; the hero renders nothing.
  if (!activated) {
    return whenUnavailable === "explain" ? <ActivateDemoCard /> : null;
  }

  if (state === "unavailable") {
    if (whenUnavailable === "hide") return null;
    return (
      <div className="border-border bg-bg-elevated mx-auto max-w-md rounded-2xl border p-5 text-left">
        <p className="text-fg mb-1.5 flex items-center gap-2 text-sm font-semibold">
          <TriangleAlert className="text-fg-muted h-4 w-4 shrink-0" aria-hidden="true" />
          {t("blockedTitle")}
        </p>
        <p className="text-fg-secondary text-small leading-relaxed">{t("blockedBody")}</p>
        <Link
          href="/kontakt"
          className="text-accent hover:text-accent-light mt-3 inline-block text-sm font-semibold"
        >
          {t("blockedCta")}
        </Link>
      </div>
    );
  }

  const ready = state === "ready";

  return (
    <>
      <Button
        type="button"
        size="lg"
        variant="primary"
        className={className}
        disabled={!ready}
        onClick={() => findCallControl()?.click()}
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

      {/* The hint describes where the widget opens, so it belongs to the button
          and must not outlive it when the widget never loads. */}
      {whenUnavailable === "explain" && (
        <p className="text-fg-muted mt-5 flex items-center justify-center gap-2 text-xs">
          <Mic className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {t("hint")}
        </p>
      )}
    </>
  );
}
