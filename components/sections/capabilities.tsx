"use client";

import * as React from "react";
import { motion, useScroll, useMotionValue, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";
import { t, ta } from "@/lib/i18n";

type CapCard = { number: string; title: string; subtitle: string; description: string; accent: string; };
type Stat = { value: string; label: string; };

export function Capabilities() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const capabilities = ta<CapCard[]>("capabilities.cards");
  const stats = ta<Stat[]>("capabilities.stats");

  return (
    <section
      ref={containerRef}
      className="section-pad bg-bg relative overflow-hidden"
      aria-label="Our capabilities"
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,transparent_70%)]" />
      </div>

      <div className="container-wide">
        {/* Header — pins while you scroll through cards */}
        <div className="text-center mb-20">
          <motion.h2
            className="text-h1 text-fg"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t("capabilities.title")}<span className="gradient-text inline-block pb-[0.25em] pr-[0.15em]">{t("capabilities.titleAccent")}</span>
          </motion.h2>
        </div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <CapabilityCard key={cap.number} cap={cap} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

function CapabilityCard({
  cap,
  index,
}: {
  cap: CapCard;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative p-8 rounded-2xl border border-border bg-bg-elevated",
        "overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:border-border-strong"
      )}
    >
      {/* Number */}
      <span
        className="absolute top-6 right-6 text-6xl font-black text-fg-muted/10 select-none"
        aria-hidden="true"
      >
        {cap.number}
      </span>

      {/* Gradient line */}
      <div
        className={cn(
          "w-12 h-1 rounded-full bg-gradient-to-r mb-6",
          cap.accent
        )}
        aria-hidden="true"
      />

      <h3 className="text-h3 font-bold text-fg mb-4 group-hover:text-accent transition-colors">
        {cap.title}
      </h3>
      <p className="text-body-lg text-fg-secondary leading-relaxed">
        {cap.description}
      </p>
    </motion.div>
  );
}

function StatStrip({ stats }: { stats: Stat[] }) {
  const x = useMotionValue(0);
  const innerRef = React.useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    const el = innerRef.current;
    if (!el) return;
    const halfWidth = el.scrollWidth / 2;
    let next = x.get() - delta * 0.045; // ~45 px/s — slow & smooth
    if (next <= -halfWidth) next += halfWidth;
    x.set(next);
  });

  return (
    <div className="mt-24 overflow-x-hidden" aria-label="Key statistics">
      <motion.div
        ref={innerRef}
        className="flex items-center gap-16 lg:gap-24 pt-3 pb-8"
        style={{ x, willChange: "transform" }}
      >
        {[...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex-shrink-0 text-center">
            <p
              className="text-display font-black gradient-text leading-[1.1] pb-[0.25em] mb-1"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              {stat.value}
            </p>
            <p className="text-small text-fg-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
