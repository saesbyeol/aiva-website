"use client";

import * as React from "react";
import {
  ArrowRightLeft,
  CalendarCheck,
  ClipboardList,
  MessageCircleQuestion,
  PhoneForwarded,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Ability = { icon: string; name: string; desc: string };

const iconMap: Record<string, LucideIcon> = {
  MessageCircleQuestion,
  CalendarCheck,
  ClipboardList,
  PhoneForwarded,
};

/**
 * The four things the agent can take on, as a rail of choices that swaps the
 * panel beside it, rather than four cards that differ only in their wording.
 *
 * Each panel is a small mock of what actually changes in a connected system, so
 * the section shows the outcome instead of describing it twice.
 */
export function AbilitySwitcher({
  abilities,
  panels,
}: {
  abilities: Ability[];
  panels: {
    slots: string[];
    slotTaken: string;
    record: [string, string][];
    routeTo: string;
    routeNote: string;
    faqQ: string;
    faqA: string;
    sourceLabel: string;
  };
}) {
  const [active, setActive] = React.useState(0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
      {/* Rail */}
      <div className="space-y-2.5" role="tablist" aria-orientation="vertical">
        {abilities.map((ability, i) => {
          const Icon = iconMap[ability.icon] ?? MessageCircleQuestion;
          const selected = i === active;
          return (
            <button
              key={ability.name}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`ability-panel-${i}`}
              id={`ability-tab-${i}`}
              onClick={() => setActive(i)}
              className={cn(
                "focus-visible:ring-accent focus-visible:ring-offset-bg flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-5",
                selected
                  ? "border-accent/40 bg-accent/[0.07]"
                  : "border-border bg-bg-elevated hover:border-border-strong"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                  selected
                    ? "bg-accent/15 border-accent/30 text-accent"
                    : "bg-bg-secondary border-border text-fg-muted"
                )}
                aria-hidden="true"
              >
                <Icon className="h-[1.125rem] w-[1.125rem]" />
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "text-body block font-bold transition-colors",
                    selected ? "text-fg" : "text-fg-secondary"
                  )}
                >
                  {ability.name}
                </span>
                <span
                  className={cn(
                    "text-small mt-1 block leading-relaxed transition-[max-height,opacity] duration-300",
                    selected
                      ? "text-fg-secondary max-h-40 opacity-100"
                      : "max-h-0 overflow-hidden opacity-0 lg:max-h-40 lg:opacity-60"
                  )}
                >
                  {ability.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`ability-panel-${active}`}
        aria-labelledby={`ability-tab-${active}`}
        className="border-border bg-bg-elevated relative flex min-h-[19rem] flex-col justify-center overflow-hidden rounded-3xl border p-6 sm:p-8"
      >
        <div
          className="bg-accent/[0.06] pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div key={active} className="motion-safe:animate-fade-in relative">
          {active === 0 && <FaqPanel {...panels} />}
          {active === 1 && <SlotsPanel {...panels} />}
          {active === 2 && <RecordPanel {...panels} />}
          {active === 3 && <RoutePanel {...panels} />}
        </div>
      </div>
    </div>
  );
}

type PanelProps = React.ComponentProps<typeof AbilitySwitcher>["panels"];

function FaqPanel({ faqQ, faqA, sourceLabel }: PanelProps) {
  return (
    <div className="space-y-4">
      <p className="text-fg-secondary text-small bg-bg-secondary border-border rounded-2xl rounded-tr-sm border px-4 py-3 leading-relaxed">
        {faqQ}
      </p>
      <p className="text-fg text-small bg-accent/10 border-accent/20 rounded-2xl rounded-tl-sm border px-4 py-3 leading-relaxed">
        {faqA}
      </p>
      <p className="text-fg-muted border-border flex items-center gap-2 border-t pt-4 text-xs">
        <span className="bg-accent h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        {sourceLabel}
      </p>
    </div>
  );
}

function SlotsPanel({ slots, slotTaken }: PanelProps) {
  return (
    <div>
      <p className="text-label mb-4">{slotTaken}</p>
      <div className="grid grid-cols-3 gap-2.5">
        {slots.map((slot, i) => (
          <span
            key={slot}
            className={cn(
              "rounded-xl border px-2 py-3 text-center font-mono text-sm tabular-nums",
              i === 2
                ? "border-accent bg-accent/15 text-fg font-semibold"
                : i === 1 || i === 4
                  ? "border-border bg-bg-secondary text-fg-muted line-through"
                  : "border-border bg-bg-secondary text-fg-secondary"
            )}
          >
            {slot}
          </span>
        ))}
      </div>
    </div>
  );
}

function RecordPanel({ record }: PanelProps) {
  return (
    <dl className="divide-border divide-y">
      {record.map(([key, value]) => (
        <div key={key} className="flex items-baseline gap-4 py-3 first:pt-0">
          <dt className="text-label w-28 shrink-0">{key}</dt>
          <dd className="text-fg text-small min-w-0 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function RoutePanel({ routeTo, routeNote }: PanelProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="flex items-center gap-4">
        <span className="bg-accent/15 border-accent/30 text-accent flex h-12 w-12 items-center justify-center rounded-2xl border">
          <PhoneForwarded className="h-5 w-5" aria-hidden="true" />
        </span>
        <ArrowRightLeft className="text-fg-muted h-4 w-4" aria-hidden="true" />
        <span className="bg-bg-secondary border-border text-fg-secondary flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold">
          {routeTo.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <p className="text-fg text-body font-bold">{routeTo}</p>
      <p className="text-fg-secondary text-small max-w-xs leading-relaxed">{routeNote}</p>
    </div>
  );
}
