"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies, adShowcase } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

// ─── Data ──────────────────────────────────────────────────────────────────────

const CASE_GRADIENTS: Record<string, string> = {
  "clearpath-finance": "from-violet-950 via-indigo-900 to-blue-950",
  "nova-ecommerce": "from-cyan-950 via-sky-900 to-slate-900",
  "atlas-legal": "from-emerald-950 via-teal-900 to-slate-900",
};

type Work = {
  id: string;
  num: number;
  title: string;
  client: string | null;
  category: string;
  year: string;
  type: "case-study" | "ad";
  href: string | null;
  gradient: string;
  video: string | null;
};

const works: Work[] = [
  ...caseStudies.map((s, i) => ({
    id: s.id,
    num: i + 1,
    title: s.title,
    client: s.client,
    category: s.category,
    year: s.year,
    type: "case-study" as const,
    href: `/radovi/${s.slug}`,
    gradient: CASE_GRADIENTS[s.slug] ?? "from-violet-950 to-indigo-900",
    video: null,
  })),
  ...adShowcase.map((a, i) => ({
    id: a.id,
    num: caseStudies.length + i + 1,
    title: a.title,
    client: null,
    category: a.category,
    year: "2025",
    type: "ad" as const,
    href: null,
    gradient: a.color,
    video: a.video ?? null,
  })),
];

const FILTERS = [
  { label: "Sve", value: "all", count: works.length },
  { label: "Video oglasi", value: "ad", count: adShowcase.length },
  { label: "Projekti", value: "case-study", count: caseStudies.length },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

// ─── Gallery ───────────────────────────────────────────────────────────────────

export default function WorksGallery() {
  const [active, setActive] = React.useState<FilterValue>("all");

  const filtered = React.useMemo(
    () => (active === "all" ? works : works.filter((w) => w.type === active)),
    [active]
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Header ── */}
      <section className="pt-40 pb-14" aria-label="Works header">
        <div className="container-default">
          <Reveal>
            <p className="text-label text-accent mb-3">NAŠI RADOVI</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-h1 text-fg mb-4">
              Rezultati koji{" "}
              <span className="gradient-text">govore sami za sebe.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-body-lg text-fg-secondary max-w-xl mb-10">
              Od AI video oglasa do enterprise sustava — projekti koje smo izgradili za naše klijente.
            </p>
          </Reveal>

          {/* Filter pills */}
          <Reveal delay={0.15}>
            <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filter radova">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  role="tab"
                  aria-selected={active === f.value}
                  onClick={() => setActive(f.value)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                    active === f.value
                      ? "bg-accent text-white border-accent shadow-[0_0_24px_rgba(99,102,241,0.45)]"
                      : "text-fg-secondary border-border hover:border-border-strong hover:text-fg bg-transparent"
                  )}
                >
                  {f.label}
                  <span className="ml-1.5 font-mono text-xs opacity-50">
                    [{f.count}]
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="pb-32" aria-label="Works gallery">
        <div className="container-default">
          <div
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
            role="list"
          >
            {filtered.map((work, i) => (
              <WorkCard key={work.id} work={work} staggerIndex={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function WorkCard({ work, staggerIndex }: { work: Work; staggerIndex: number }) {
  const delay = Math.min(staggerIndex * 55, 400);

  const card = (
    <div
      role="listitem"
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-bg-elevated border border-border",
        "aspect-[3/4] transition-all duration-500 ease-out",
        "hover:border-border-strong hover:shadow-[0_0_60px_rgba(99,102,241,0.12)]",
        work.href ? "cursor-pointer" : "cursor-default"
      )}
      style={{
        animationName: "reveal-up",
        animationDuration: "0.55s",
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* ── Media ── */}
      {work.video ? (
        <video
          src={work.video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          aria-hidden
        />
      ) : (
        <>
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-opacity duration-500 opacity-70 group-hover:opacity-90",
              work.gradient
            )}
          />
          {/* Dot grid texture */}
          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden
          />
          {/* Client name watermark */}
          {work.client && (
            <div className="absolute inset-0 flex items-center justify-center px-10">
              <p className="font-black text-white/[0.07] text-center leading-tight uppercase tracking-tight select-none text-4xl md:text-5xl">
                {work.client}
              </p>
            </div>
          )}
        </>
      )}

      {/* Dark scrim so top labels are always readable */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* ── Top labels ── */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10 pointer-events-none">
        <span className="font-mono text-[11px] text-white/40 leading-none tabular-nums">
          {String(work.num).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-white/60 uppercase bg-black/30 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full">
          {work.category}
        </span>
      </div>

      {/* ── Bottom overlay (slides up on hover) ── */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 p-5",
          "bg-gradient-to-t from-black/95 via-black/75 to-transparent",
          /* mobile: always visible; desktop: slides up on hover */
          "translate-y-[38%] group-hover:translate-y-0",
          "@supports (selector(:hover)){translate-y-[38%]}",
          "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        )}
      >
        <p className="font-mono text-[11px] text-white/40 mb-2 tabular-nums">
          {work.year}
        </p>
        <div className="flex items-start gap-3">
          <h2 className="flex-1 text-sm font-bold text-fg leading-snug">
            {work.title}
          </h2>
          {work.href && (
            <span
              aria-hidden
              className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150"
            >
              <ArrowUpRight className="w-4 h-4 text-accent" />
            </span>
          )}
        </div>
        {work.client && (
          <p className="text-xs text-fg-muted mt-1.5">{work.client}</p>
        )}
      </div>
    </div>
  );

  if (work.href) {
    return (
      <Link href={work.href} className="block" aria-label={work.title}>
        {card}
      </Link>
    );
  }

  return card;
}
