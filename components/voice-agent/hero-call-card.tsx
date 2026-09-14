"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CalendarCheck, Check, PhoneCall, Search } from "lucide-react";
import { Waveform } from "./waveform";
import { cn } from "@/lib/utils";

/**
 * The hero's visual: a call in progress, looping through the four beats the
 * rest of the page then explains in words (ring, answer, look something up,
 * write it back).
 *
 * This is the page's single piece of ambient motion. Under
 * prefers-reduced-motion it renders the final frame and stays there, which is
 * also what a viewer sees in a screenshot, so nothing meaningful is motion-only.
 */

type Beat = { at: number; phase: "ringing" | "speaking" | "working" | "done" };

// Cumulative timeline in ms. The loop restarts a beat after the last one.
const BEATS: Beat[] = [
  { at: 0, phase: "ringing" },
  { at: 1600, phase: "speaking" },
  { at: 5200, phase: "working" },
  { at: 7600, phase: "done" },
];
const LOOP = 11600;

export function HeroCallCard() {
  const t = useTranslations("voiceAgent.callCard");
  const [elapsed, setElapsed] = React.useState(LOOP);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setElapsed((now - start) % LOOP);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const phase = BEATS.reduce<Beat["phase"]>(
    (acc, beat) => (elapsed >= beat.at ? beat.phase : acc),
    "ringing"
  );
  const ringing = phase === "ringing";

  // The on-screen timer only advances once the call connects.
  const seconds = Math.max(0, Math.floor((Math.min(elapsed, LOOP) - BEATS[1].at) / 1000));

  return (
    <div className="relative">
      {/* Glow behind the card, tying it to the hero's gradient orbs. */}
      <div
        className="bg-accent/20 absolute -inset-6 rounded-[2.5rem] blur-3xl"
        aria-hidden="true"
      />

      <div className="border-border bg-bg-elevated/90 relative overflow-hidden rounded-3xl border shadow-lg backdrop-blur">
        {/* Call header */}
        <div className="border-border bg-bg-secondary/80 flex items-center gap-3 border-b px-5 py-4">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
            {!ringing && (
              <span
                className="bg-accent/30 motion-safe:animate-ping-ring absolute inset-0 rounded-full"
                aria-hidden="true"
              />
            )}
            <span className="bg-accent/15 border-accent/30 text-accent relative flex h-9 w-9 items-center justify-center rounded-full border">
              <PhoneCall className="h-4 w-4" />
            </span>
          </span>

          <div className="min-w-0">
            <p className="text-fg truncate text-sm font-semibold">
              {ringing ? t("incoming") : t("connected")}
            </p>
            <p className="text-fg-muted truncate text-xs">{t("number")}</p>
          </div>

          <span className="text-fg-muted ml-auto shrink-0 font-mono text-xs tabular-nums">
            {ringing ? t("ringing") : `00:${String(seconds).padStart(2, "0")}`}
          </span>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          <Waveform active={phase === "speaking"} />

          {/* What the agent is saying. Fixed min-height so the card does not
              resize as the sentence swaps. */}
          <div className="min-h-[4.5rem]">
            <p className="text-label mb-2">{t("agentLabel")}</p>
            <p
              key={phase}
              className="text-fg text-body motion-safe:animate-fade-in leading-relaxed"
            >
              {ringing ? t("lineRinging") : t("lineSpeaking")}
            </p>
          </div>

          {/* System steps, revealed as the call reaches them. */}
          <div className="grid grid-cols-2 gap-3">
            <StatusChip
              icon={Search}
              label={t("stepChecking")}
              state={
                phase === "ringing" ? "idle" : phase === "speaking" ? "idle" : "done"
              }
              busyLabel={t("stepCheckingBusy")}
              busy={phase === "working"}
            />
            <StatusChip
              icon={CalendarCheck}
              label={t("stepBooked")}
              state={phase === "done" ? "done" : "idle"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusChip({
  icon: Icon,
  label,
  busyLabel,
  state,
  busy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  busyLabel?: string;
  state: "idle" | "done";
  busy?: boolean;
}) {
  const lit = state === "done" || busy;
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors duration-500",
        lit ? "border-accent/30 bg-accent/10" : "border-border bg-bg-secondary/50"
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-500",
          lit ? "bg-accent/20 text-accent" : "bg-bg-elevated text-fg-muted"
        )}
        aria-hidden="true"
      >
        {state === "done" && !busy ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Icon className="h-3.5 w-3.5" />
        )}
      </span>
      <span
        className={cn(
          "truncate text-xs font-medium transition-colors duration-500",
          lit ? "text-fg" : "text-fg-muted"
        )}
      >
        {busy && busyLabel ? busyLabel : label}
      </span>
    </div>
  );
}
