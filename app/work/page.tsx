import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { caseStudies } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export const metadata: Metadata = constructMetadata({
  title: "Radovi",
  description:
    "Studije slučaja AI automatizacije, LLM aplikacija i pipeline-ova za sadržaj koji su donijeli stvarne rezultate.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 bg-bg" aria-label="Work hero">
        <div className="container-default">
          <Reveal>
            <Badge variant="accent" className="mb-6">
              {t("workPage.badge")}
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-h1 text-fg mb-6 max-w-3xl">
              {t("workPage.title")}{" "}
              <span className="gradient-text">{t("workPage.titleAccent")}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-body-lg text-fg-secondary max-w-2xl">
              {t("workPage.description")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Case studies */}
      <section className="pb-24 bg-bg" aria-label="All case studies">
        <div className="container-default">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, i) => (
              <CaseStudyCard key={study.id} study={study} index={i} />
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

const gradients = [
  "from-violet-900/90 to-indigo-900/90",
  "from-cyan-900/90 to-blue-900/90",
  "from-purple-900/90 to-pink-900/90",
];

function CaseStudyCard({
  study,
  index,
}: {
  study: (typeof caseStudies)[0];
  index: number;
}) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className={cn(
        "group flex flex-col rounded-2xl overflow-hidden border border-border bg-bg-elevated",
        "transition-all duration-300 hover:border-border-strong hover:shadow-lg hover:-translate-y-1"
      )}
      aria-label={`${t("work.readStudy")} ${study.title}`}
    >
      {/* Header visual */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            gradients[index % gradients.length]
          )}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <Badge variant="accent" className="absolute top-4 left-4">
          {study.category}
        </Badge>
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
        <div className="absolute bottom-4 right-4">
          <span className="text-xs text-white/60 font-mono">{study.year}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <p className="text-label text-accent mb-2">{study.client}</p>
        <h2 className="text-h4 font-bold text-fg mb-3 group-hover:text-accent transition-colors leading-tight">
          {study.title}
        </h2>
        <p className="text-body text-fg-secondary leading-relaxed flex-1 mb-5">
          {study.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {study.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Results */}
        <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {study.results.slice(0, 2).map((r, i) => (
            <div key={i} className="text-sm">
              <span className="font-semibold text-fg">{r.split(" ")[0]}</span>{" "}
              <span className="text-fg-muted">{r.split(" ").slice(1).join(" ")}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
