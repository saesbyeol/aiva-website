"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { caseStudies } from "@/lib/content";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function Work() {
  return (
    <section className="section-pad bg-bg" aria-label="Featured work">
      <div className="container-default">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <Reveal>
            <SectionHeading
              label={t("work.label")}
              title={t("work.title")}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/radovi"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-light transition-colors group flex-shrink-0"
            >
              {t("work.seeAll")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.filter((c) => c.featured).map((study, i) => (
            <CaseStudyCard key={study.id} study={study} index={i} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function CaseStudyCard({
  study,
  index,
}: {
  study: (typeof caseStudies)[0];
  index: number;
}) {
  const [hovered, setHovered] = React.useState(false);

  const gradients = [
    "from-violet-900/80 to-indigo-900/80",
    "from-cyan-900/80 to-blue-900/80",
    "from-purple-900/80 to-pink-900/80",
  ];

  return (
    <Link
      href={`/radovi/${study.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden border border-border",
        "transition-all duration-400 hover:border-border-strong hover:shadow-lg hover:-translate-y-1",
        "bg-bg-elevated"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Case study: ${study.title}`}
    >
      {/* Visual header */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* Gradient placeholder */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            gradients[index % gradients.length]
          )}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="accent">{study.category}</Badge>
        </div>
        {/* Arrow icon */}
        <motion.div
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <ArrowUpRight className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {study.client && <p className="text-label text-accent mb-2">{study.client}</p>}
        <h3 className="text-h4 font-bold text-fg mb-3 group-hover:text-accent transition-colors leading-tight">
          {study.title}
        </h3>
        <p className="text-body text-fg-secondary leading-relaxed flex-1 mb-4">
          {study.description}
        </p>

        {/* Results preview */}
        <div className="border-t border-border pt-4">
          <p className="text-xs font-medium text-fg-muted mb-2">{t("work.keyResult")}</p>
          <p className="text-sm font-semibold text-fg">{study.results[0]}</p>
        </div>
      </div>
    </Link>
  );
}
