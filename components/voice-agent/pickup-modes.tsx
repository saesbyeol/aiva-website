import { Bot, Clock, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Trigger = { name: string; desc: string };

const modeIcons: LucideIcon[] = [Bot, Users, Clock];

// Which ring the agent takes the call on. -1 means the clock decides rather
// than the ring count: the office is shut, so the agent has the line from the
// first ring and the badge carries the reason.
const PICKUP_AT = [0, 3, -1];

const RINGS = 5;

/**
 * The three ways the agent can sit in front of a phone line, each shown as the
 * ring it answers on. The strip is the difference between the modes, so it
 * carries the comparison that three paragraphs otherwise have to make.
 */
export function PickupModes({
  triggers,
  teamLabel,
  agentLabel,
  closedLabel,
}: {
  triggers: Trigger[];
  teamLabel: string;
  agentLabel: string;
  closedLabel: string;
}) {
  return (
    <div className="border-border bg-bg-elevated divide-border divide-y overflow-hidden rounded-3xl border">
      {triggers.map((trigger, i) => {
        const Icon = modeIcons[i] ?? Bot;
        const pickup = PICKUP_AT[i];
        return (
          <div
            key={trigger.name}
            className="grid grid-cols-1 items-center gap-5 p-6 sm:p-7 lg:grid-cols-[1.4fr_1fr] lg:gap-10"
          >
            <div className="flex items-start gap-4">
              <span
                className="bg-accent/10 border-accent/25 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                aria-hidden="true"
              >
                <Icon className="h-[1.125rem] w-[1.125rem]" />
              </span>
              <div className="min-w-0">
                <h3 className="text-fg text-body font-bold">{trigger.name}</h3>
                <p className="text-fg-secondary text-small mt-1.5 leading-relaxed">
                  {trigger.desc}
                </p>
              </div>
            </div>

            <RingStrip
              pickup={pickup}
              teamLabel={teamLabel}
              agentLabel={agentLabel}
              closedLabel={closedLabel}
            />
          </div>
        );
      })}
    </div>
  );
}

function RingStrip({
  pickup,
  teamLabel,
  agentLabel,
  closedLabel,
}: {
  pickup: number;
  teamLabel: string;
  agentLabel: string;
  closedLabel: string;
}) {
  const closed = pickup === -1;

  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div className="flex flex-1 items-end gap-1.5">
        {Array.from({ length: RINGS }, (_, i) => {
          // Outside opening hours nobody on the team is there to ring, so the
          // agent answers every ring. Greying the whole strip would say the
          // opposite of what this row is for.
          const isAgent = closed ? true : i >= pickup;
          const spent = closed ? false : i < pickup;
          return (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-full transition-colors",
                isAgent
                  ? "bg-accent h-7"
                  : spent
                    ? "bg-border-strong h-4"
                    : "bg-border h-4"
              )}
            />
          );
        })}
      </div>

      <span className="border-accent/30 bg-accent/10 text-accent-light shrink-0 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold whitespace-nowrap">
        {closed
          ? `${closedLabel} → ${agentLabel}`
          : pickup === 0
            ? agentLabel
            : `${teamLabel} → ${agentLabel}`}
      </span>
    </div>
  );
}
