"use client";

import { cn } from "@/lib/utils";

// Fixed per-bar heights and delays: a random walk would change on every render
// and make the SSR and client markup disagree.
const BARS = [
  0.35, 0.6, 0.9, 0.45, 0.75, 1, 0.55, 0.3, 0.7, 0.95, 0.5, 0.8, 0.4, 0.65, 0.9, 0.35,
  0.55, 0.85, 0.45, 0.7, 0.3, 0.6, 0.95, 0.4, 0.75, 0.5, 0.85, 0.35,
];

/**
 * Voice level meter for the call panels. `active` is the only state: when the
 * line is quiet the bars settle to a flat baseline rather than disappearing, so
 * the panel keeps its height and nothing below it shifts.
 */
export function Waveform({ active, className }: { active: boolean; className?: string }) {
  return (
    <div className={cn("flex h-10 items-center gap-[3px]", className)} aria-hidden="true">
      {BARS.map((peak, i) => (
        <span
          key={i}
          className={cn(
            "flex-1 rounded-full transition-[height,background-color] duration-300",
            active ? "bg-accent/70 motion-safe:animate-wave" : "bg-border-strong"
          )}
          style={{
            height: active ? `${Math.round(peak * 100)}%` : "3px",
            animationDelay: `${(i % 7) * 0.09}s`,
            // Scales the keyframe so each bar tops out at its own peak.
            ["--wave-peak" as string]: `${Math.round(peak * 100)}%`,
          }}
        />
      ))}
    </div>
  );
}
