"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Bot, Check, Pause, Play, RotateCcw, Settings2, User } from "lucide-react";
import { Waveform } from "./waveform";
import { cn } from "@/lib/utils";

export type Turn = { role: "agent" | "caller" | "system"; text: string };
export type SystemStep = { name: string; detail: string };

/**
 * The example call, played back rather than listed.
 *
 * Every turn is rendered on mount and only *revealed* as playback reaches it,
 * so the panel never changes height, assistive technology can read the whole
 * transcript at any point, and the conversation is still fully readable with
 * JavaScript disabled or reduced motion set.
 */
export function CallPlayer({
  turns,
  steps,
  agentLabel,
  callerLabel,
}: {
  turns: Turn[];
  steps: SystemStep[];
  agentLabel: string;
  callerLabel: string;
}) {
  const t = useTranslations("voiceAgent.player");

  // Each turn holds the floor for a beat proportional to how long it takes to
  // say, with a floor so the short ones do not flash past.
  const durations = React.useMemo(
    () => turns.map((turn) => Math.max(1300, Math.round(turn.text.length * 42))),
    [turns]
  );

  const [playing, setPlaying] = React.useState(false);
  const [index, setIndex] = React.useState(-1);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reduced = React.useRef(false);

  // Reduced motion (or no autoplay yet): show the finished transcript.
  React.useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setIndex(turns.length - 1);
  }, [turns.length]);

  // Start once the panel is actually on screen, so the call is not already over
  // by the time someone scrolls to it.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!playing) return;
    if (index >= turns.length - 1) {
      setPlaying(false);
      return;
    }
    const next = index + 1;
    const timer = setTimeout(() => setIndex(next), durations[next]);
    return () => clearTimeout(timer);
  }, [playing, index, durations, turns.length]);

  const finished = index >= turns.length - 1;
  const elapsed = durations.slice(0, index + 1).reduce((a, b) => a + b, 0);
  const seconds = Math.round(elapsed / 1000);

  // A system turn is the agent working, not speaking.
  const speaking = playing && turns[index]?.role !== "system";

  // Behind-the-scenes steps light up across the back half of the call, where
  // the transcript's own system turn sits.
  const stepsLit = turns
    .slice(0, index + 1)
    .filter((turn) => turn.role === "system").length;

  const toggle = () => {
    if (finished) {
      setIndex(-1);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };

  return (
    <div
      ref={rootRef}
      className="border-border bg-bg-elevated overflow-hidden rounded-3xl border shadow-lg"
    >
      {/* Transport */}
      <div className="border-border bg-bg-secondary flex items-center gap-3 border-b px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={toggle}
          className="bg-accent hover:bg-accent-dark focus-visible:ring-accent focus-visible:ring-offset-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label={finished ? t("replay") : playing ? t("pause") : t("play")}
        >
          {finished ? (
            <RotateCcw className="h-4 w-4" />
          ) : playing ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" />
          )}
        </button>

        <Waveform active={speaking} className="h-6 flex-1" />

        <span className="text-fg-muted shrink-0 font-mono text-xs tabular-nums">
          00:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
        {/* Transcript */}
        <ol className="space-y-5 p-5 sm:p-7" role="list">
          {turns.map((turn, i) => (
            <li
              key={i}
              className={cn(
                "transition-all duration-500",
                i <= index ? "translate-y-0 opacity-100" : "translate-y-1 opacity-40"
              )}
            >
              {turn.role === "system" ? (
                <SystemNote text={turn.text} />
              ) : (
                <Bubble
                  turn={turn}
                  label={turn.role === "agent" ? agentLabel : callerLabel}
                />
              )}
            </li>
          ))}
        </ol>

        {/* Behind the scenes */}
        <div className="border-border bg-bg-secondary/60 flex flex-col justify-center border-t p-5 sm:p-7 lg:border-t-0 lg:border-l">
          <p className="text-label mb-5">{t("behindTheScenes")}</p>
          <ol className="space-y-4" role="list">
            {steps.map((step, i) => {
              // The first step is underway as soon as the call connects; the
              // rest resolve as the agent's system turns complete.
              const done =
                i === 0 ? index >= 1 : stepsLit > 0 && index >= turns.length - 1;
              const active = i === 0 ? index >= 1 : stepsLit > 0;
              return (
                <li key={step.name} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                      active
                        ? "border-accent/40 bg-accent/15 text-accent"
                        : "border-border bg-bg-elevated text-fg-muted"
                    )}
                    aria-hidden="true"
                  >
                    {done ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-small font-semibold transition-colors duration-500",
                        active ? "text-fg" : "text-fg-muted"
                      )}
                    >
                      {step.name}
                    </p>
                    <p className="text-fg-muted text-xs leading-relaxed">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function SystemNote({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="bg-border h-px flex-1" aria-hidden="true" />
      <span className="text-fg-muted flex max-w-md items-start gap-2.5 text-xs leading-relaxed italic">
        <Settings2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {text}
      </span>
      <span className="bg-border h-px flex-1" aria-hidden="true" />
    </div>
  );
}

function Bubble({ turn, label }: { turn: Turn; label: string }) {
  const isAgent = turn.role === "agent";
  return (
    <div className={cn("flex gap-3", isAgent ? "justify-start" : "justify-end")}>
      {isAgent && <Avatar icon={Bot} accent />}
      <div className={cn("max-w-[85%]", !isAgent && "text-right")}>
        <p className="text-label mb-1.5">{label}</p>
        <p
          className={cn(
            "text-small inline-block rounded-2xl px-4 py-3 text-left leading-relaxed",
            isAgent
              ? "bg-accent/10 border-accent/20 text-fg rounded-tl-sm border"
              : "bg-bg-secondary border-border text-fg-secondary rounded-tr-sm border"
          )}
        >
          {turn.text}
        </p>
      </div>
      {!isAgent && <Avatar icon={User} />}
    </div>
  );
}

function Avatar({
  icon: Icon,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
        accent
          ? "bg-accent/10 border-accent/20 text-accent"
          : "bg-bg-secondary border-border text-fg-muted"
      )}
      aria-hidden="true"
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}
