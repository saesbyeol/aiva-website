"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { useTranslations } from "next-intl";
import type { SanityCaseStudy, SanityVideoAd } from "@/sanity/lib/queries";

// ─── Gradient palette (cycles by index) ───────────────────────────────────────

const GRADIENTS = [
  "from-violet-950 via-indigo-900 to-blue-950",
  "from-cyan-950 via-sky-900 to-slate-900",
  "from-emerald-950 via-teal-900 to-slate-900",
  "from-rose-950 via-pink-900 to-purple-950",
  "from-amber-950 via-orange-900 to-slate-900",
  "from-indigo-950 via-violet-900 to-fuchsia-950",
];

// ─── Unified work type for the grid ───────────────────────────────────────────

type Work = {
  id: string;
  num: number;
  title: string;
  client: string | null;
  category: string;
  year: string;
  description: string | null;
  tags: string[];
  type: "case-study" | "ad";
  href: string | null;
  gradient: string;
  video: string | null;
  coverImage: string | null;
};

function toWorks(caseStudies: SanityCaseStudy[], videoAds: SanityVideoAd[]): Work[] {
  return [
    ...caseStudies.map((s, i) => ({
      id: s._id,
      num: i + 1,
      title: s.title,
      client: s.client,
      category: s.category,
      year: s.year,
      description: s.description ?? null,
      tags: s.tags ?? [],
      type: "case-study" as const,
      href: `/radovi/${s.slug}`,
      gradient: GRADIENTS[i % GRADIENTS.length],
      video: null,
      coverImage: s.coverImageUrl ?? null,
    })),
    ...videoAds.map((a, i) => ({
      id: a._id,
      num: caseStudies.length + i + 1,
      title: a.title,
      client: null,
      category: a.category,
      year: "2025",
      description: a.description ?? null,
      tags: a.tags ?? [],
      type: "ad" as const,
      href: null,
      gradient: GRADIENTS[(caseStudies.length + i) % GRADIENTS.length],
      video: a.videoUrl,
      coverImage: null,
    })),
  ];
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

const ALL = "all";

// Fixed filter chips. A project appears under a chip when its Tagovi in Sanity
// contain the exact matching string. Chips always show, even at 0 (rendered "•").
const FILTER_TAGS = [
  "Video oglasi",
  "Generiranje slika",
  "E-commerce",
  "Web stranice",
  "AI rješenja",
  "Produktna fotografija",
  "Marketinška kampanja",
] as const;

// Maps the Croatian tag value (must match Sanity data / FILTER_TAGS) to the
// translation key used for the displayed chip label.
const CHIP_LABEL_KEYS: Record<string, string> = {
  "Video oglasi": "work.chipVideoAds",
  "Generiranje slika": "work.chipImageGen",
  "E-commerce": "work.chipEcommerce",
  "Web stranice": "work.chipWebsites",
  "AI rješenja": "work.chipAiSolutions",
  "Produktna fotografija": "work.chipProductPhotography",
  "Marketinška kampanja": "work.chipMarketingCampaign",
};

interface Props {
  caseStudies: SanityCaseStudy[];
  videoAds: SanityVideoAd[];
}

export default function WorksGallery({ caseStudies, videoAds }: Props) {
  const t = useTranslations();
  // `active` is either ALL or a tag string
  const [active, setActive] = React.useState<string>(ALL);
  const [modalSrc, setModalSrc] = React.useState<string | null>(null);

  const works = React.useMemo(
    () => toWorks(caseStudies, videoAds),
    [caseStudies, videoAds]
  );

  // Fixed chips; count = works whose tags include the chip. A work can carry
  // several tags, so counts intentionally overlap.
  const filters = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of works) {
      for (const tag of w.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    const tagChips = FILTER_TAGS.map((label) => ({
      label: CHIP_LABEL_KEYS[label] ? t(CHIP_LABEL_KEYS[label]) : label,
      value: label,
      count: counts.get(label) ?? 0,
    }));
    return [{ label: t("work.filterAll"), value: ALL, count: works.length }, ...tagChips];
  }, [works, t]);

  const filtered = React.useMemo(
    () => (active === ALL ? works : works.filter((w) => w.tags.includes(active))),
    [active, works]
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Header ── */}
      <section className="pt-40 pb-14" aria-label="Works header">
        <div className="container-default">
          <Reveal>
            <p className="text-label text-accent mb-3">{t("work.galleryEyebrow")}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-h1 text-fg mb-4">
              {t("work.galleryHeadingLead")}{" "}
              <span className="gradient-text">{t("work.galleryHeadingAccent")}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-body-lg text-fg-secondary max-w-xl mb-10">
              {t("work.gallerySubtitle")}
            </p>
          </Reveal>

          {/* Filter pills */}
          <Reveal delay={0.15}>
            <div className="flex gap-2.5 flex-wrap" role="tablist" aria-label={t("work.filterAria")}>
              {filters.map((f) => (
                <button
                  key={f.value}
                  role="tab"
                  aria-selected={active === f.value}
                  onClick={() => setActive(f.value)}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
                    active === f.value
                      ? "bg-accent text-white border-accent shadow-[0_0_24px_rgba(99,102,241,0.45)]"
                      : "text-fg-secondary border-border hover:border-border-strong hover:text-fg bg-transparent"
                  )}
                >
                  {f.label}
                  <span className="font-mono text-xs opacity-60 tabular-nums">
                    {f.count === 0 ? "•" : f.count}
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
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-fg-muted">
              <p className="text-body">{t("work.emptyCategory")}</p>
            </div>
          ) : (
            <div
              key={active}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-start"
              role="list"
            >
              {filtered.map((work, i) =>
                work.video ? (
                  <VideoCard
                    key={work.id}
                    work={work}
                    staggerIndex={i}
                    onOpen={setModalSrc}
                  />
                ) : (
                  <StaticCard key={work.id} work={work} staggerIndex={i} />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Video modal ── */}
      {modalSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setModalSrc(null)}
        >
          <button
            onClick={() => setModalSrc(null)}
            aria-label={t("work.galleryClose")}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <video
            src={modalSrc}
            autoPlay
            controls
            playsInline
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

// ─── Shared card pieces ────────────────────────────────────────────────────────

function cardAnimation(staggerIndex: number): React.CSSProperties {
  return {
    animationName: "reveal-up",
    animationDuration: "0.55s",
    animationDelay: `${Math.min(staggerIndex * 55, 400)}ms`,
    animationFillMode: "both",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  };
}

const cardShell =
  "group relative block rounded-2xl border border-border bg-bg-elevated p-3 " +
  "transition-all duration-500 ease-out hover:border-border-strong " +
  "hover:shadow-[0_0_50px_rgba(99,102,241,0.12)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/** "PROJECT 01" badge pinned to the media */
function ProjectBadge({ num }: { num: number }) {
  return (
    <span className="absolute top-4 left-4 z-20 font-mono text-[11px] tracking-widest uppercase text-white/80 bg-black/40 backdrop-blur-sm border border-white/15 rounded-md px-2.5 py-1">
      Project {String(num).padStart(2, "0")}
    </span>
  );
}

/** Text block below the media: category · year, title, description, CTA */
function CardBody({ work, cta }: { work: Work; cta: string }) {
  return (
    <div className="pt-5 px-1.5 pb-1.5">
      <p className="font-mono text-xs tracking-wider uppercase text-accent mb-3">
        {work.category} · {work.year}
      </p>
      <h2 className="text-xl font-bold text-fg leading-snug mb-2.5 group-hover:text-accent transition-colors duration-300">
        {work.title}
      </h2>
      {work.description && (
        <p className="text-body text-fg-secondary leading-relaxed line-clamp-2 mb-4">
          {work.description}
        </p>
      )}
      <span className="inline-flex items-center gap-1.5 font-mono text-sm text-accent">
        {cta}
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </div>
  );
}

// ─── Static card (case studies) — whole card links to the project ─────────────

function StaticCard({ work, staggerIndex }: { work: Work; staggerIndex: number }) {
  const t = useTranslations();
  return (
    <Link
      href={work.href!}
      role="listitem"
      aria-label={work.title}
      className={cardShell}
      style={cardAnimation(staggerIndex)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-bg">
        {work.coverImage ? (
          <>
            <Image
              src={work.coverImage}
              alt={work.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </>
        ) : (
          <>
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70 transition-opacity duration-500 group-hover:opacity-90", work.gradient)} />
            <div
              className="absolute inset-0 opacity-[0.055]"
              style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              aria-hidden
            />
            {work.client && (
              <div className="absolute inset-0 flex items-center justify-center px-8">
                <p className="font-black text-white/[0.08] text-center leading-tight uppercase tracking-tight select-none text-4xl md:text-5xl">
                  {work.client}
                </p>
              </div>
            )}
          </>
        )}
        <ProjectBadge num={work.num} />
      </div>
      <CardBody work={work} cta={t("work.ctaProject")} />
    </Link>
  );
}

// ─── Video card (hover to play, whole card opens modal) ───────────────────────

function VideoCard({ work, staggerIndex, onOpen }: { work: Work; staggerIndex: number; onOpen: (src: string) => void }) {
  const t = useTranslations();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);

  const handleEnter = React.useCallback(() => {
    videoRef.current?.play().catch(() => {});
    setPlaying(true);
  }, []);

  const handleLeave = React.useCallback(() => {
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
    setPlaying(false);
  }, []);

  const open = React.useCallback(() => {
    if (work.video) onOpen(work.video);
  }, [work.video, onOpen]);

  return (
    <div
      role="listitem"
      aria-label={`${t("work.ctaVideo")}: ${work.title}`}
      tabIndex={0}
      className={cn(cardShell, "cursor-pointer")}
      style={cardAnimation(staggerIndex)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-bg">
        <video
          ref={videoRef}
          src={work.video ?? ""}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          aria-hidden
        />
        {/* Play icon (hidden while playing) */}
        <div className={cn("absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300", playing ? "opacity-0" : "opacity-100")}>
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </div>
        </div>
        <ProjectBadge num={work.num} />
      </div>
      <CardBody work={work} cta={t("work.ctaVideo")} />
    </div>
  );
}
