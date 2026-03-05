"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  FileText,
  BrainCircuit,
  Globe,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { services } from "@/lib/content";
import { t } from "@/lib/i18n";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  FileText,
  BrainCircuit,
  Globe,
};

export function Services() {
  return (
    <section className="section-pad bg-bg" aria-label="Services">
      <div className="container-default">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
          {/* Left: heading */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionHeading
                label={t("services.label")}
                title={t("services.title")}
                description={t("services.description")}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/usluge"
                className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-accent hover:text-accent-light transition-colors group"
              >
                {t("services.seeAll")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>

          {/* Right: cards */}
          <Stagger className="space-y-4">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const [hovered, setHovered] = React.useState(false);
  const Icon = iconMap[service.icon] ?? Zap;

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
    >
      <Link
        href={`/usluge#${service.id}`}
        className={cn(
          "group flex items-start gap-5 p-6 rounded-xl border border-border bg-bg-elevated",
          "transition-all duration-300",
          "hover:border-border-strong hover:shadow-md hover:bg-bg-secondary"
        )}
        aria-label={`${service.title} — ${service.shortDescription}`}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center bg-gradient-to-br",
            service.color,
            "opacity-80 group-hover:opacity-100 transition-opacity"
          )}
          aria-hidden="true"
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-h4 font-semibold text-fg group-hover:text-accent transition-colors">
              {service.title}
            </h3>
            <ArrowRight
              className={cn(
                "w-4 h-4 text-fg-muted flex-shrink-0 transition-all duration-300",
                "group-hover:text-accent group-hover:translate-x-1"
              )}
              aria-hidden="true"
            />
          </div>
          <p className="text-body text-fg-secondary mt-1 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
