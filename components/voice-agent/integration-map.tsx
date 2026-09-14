import {
  Bot,
  CalendarDays,
  MessageSquare,
  PhoneCall,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Tool = { name: string; desc: string };

const toolIcons: LucideIcon[] = [CalendarDays, Users, MessageSquare];

/**
 * Where the call goes: the caller reaches the agent, the agent reaches the
 * tools that hold the answer.
 *
 * The wires reflow rather than scale: horizontal between columns on wide
 * screens, vertical between stacked cards on narrow ones. Nothing is drawn in a
 * fixed-size canvas, so no label ever shrinks below its set size.
 */
export function IntegrationMap({
  callerLabel,
  callerDesc,
  agentLabel,
  agentDesc,
  tools,
}: {
  callerLabel: string;
  callerDesc: string;
  agentLabel: string;
  agentDesc: string;
  tools: Tool[];
}) {
  return (
    <div className="flex flex-col items-stretch gap-0 lg:flex-row lg:items-center lg:gap-0">
      {/* Caller */}
      <Node icon={PhoneCall} title={callerLabel} desc={callerDesc} className="lg:w-52" />

      <Wire />

      {/* Agent */}
      <div className="border-accent/30 bg-accent/[0.07] relative shrink-0 rounded-2xl border p-5 text-center lg:w-56">
        <div
          className="bg-accent/20 pointer-events-none absolute inset-0 rounded-2xl blur-2xl"
          aria-hidden="true"
        />
        <div className="relative">
          <span
            className="bg-accent/20 border-accent/40 text-accent mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border"
            aria-hidden="true"
          >
            <Bot className="h-5 w-5" />
          </span>
          <p className="text-fg text-body font-bold">{agentLabel}</p>
          <p className="text-fg-secondary text-small mt-1 leading-relaxed">{agentDesc}</p>
        </div>
      </div>

      <Wire />

      {/* Tools */}
      <div className="flex flex-1 flex-col gap-3">
        {tools.map((tool, i) => {
          const Icon = toolIcons[i] ?? CalendarDays;
          return (
            <div
              key={tool.name}
              className="border-border bg-bg-elevated flex items-start gap-3.5 rounded-2xl border p-4"
            >
              <span
                className="bg-bg-secondary border-border text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-fg text-small font-bold">{tool.name}</p>
                <p className="text-fg-muted mt-0.5 text-xs leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Node({
  icon: Icon,
  title,
  desc,
  className,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-bg-elevated shrink-0 rounded-2xl border p-5 text-center",
        className
      )}
    >
      <span
        className="bg-bg-secondary border-border text-fg-secondary mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-fg text-body font-bold">{title}</p>
      <p className="text-fg-secondary text-small mt-1 leading-relaxed">{desc}</p>
    </div>
  );
}

/**
 * The animated link between two nodes. Two SVGs rather than one rotated
 * element, so the dash travels along the reading direction in both layouts.
 */
function Wire() {
  return (
    <>
      {/* Stacked layout */}
      <svg
        className="text-accent/50 mx-auto h-8 w-4 shrink-0 lg:hidden"
        viewBox="0 0 4 32"
        fill="none"
        aria-hidden="true"
      >
        <line
          x1="2"
          y1="0"
          x2="2"
          y2="32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 8"
          className="motion-safe:animate-flow"
        />
      </svg>

      {/* Side-by-side layout */}
      <svg
        className="text-accent/50 hidden h-4 w-10 shrink-0 lg:block xl:w-14"
        viewBox="0 0 40 4"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="2"
          x2="40"
          y2="2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 8"
          className="motion-safe:animate-flow"
        />
      </svg>
    </>
  );
}
