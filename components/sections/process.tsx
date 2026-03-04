"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { process as processSteps } from "@/lib/content";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const CYCLE_MS = 3200;

export function Process() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % processSteps.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="section-pad bg-bg-secondary" aria-label="Our process">
      <div className="container-default">
        <Reveal>
          <SectionHeading
            label={t("process.label")}
            title={t("process.title")}
            align="center"
            className="mb-20"
          />
        </Reveal>

        {/* ── Desktop stepper (lg+) ── */}
        <div className="hidden lg:block">
          {/* Row: bubbles + connecting line */}
          <div className="relative flex items-start justify-between">
            {/* Static track */}
            <div
              className="absolute top-8 h-px bg-border"
              style={{ left: "calc(12.5% - 0px)", right: "calc(12.5% - 0px)" }}
              aria-hidden="true"
            />

            {/* Animated progress fill */}
            <motion.div
              className="absolute top-8 h-px bg-gradient-to-r from-accent to-accent-light origin-left"
              style={{ left: "calc(12.5%)", width: "75%" }}
              animate={{ scaleX: (active + 1) / processSteps.length }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              aria-hidden="true"
            />

            {processSteps.map((step, i) => (
              <button
                key={step.step}
                onClick={() => { setActive(i); setPaused(true); }}
                className="relative z-10 flex flex-col items-center w-1/4 pt-0 focus-visible:outline-none group"
                aria-label={`Step ${step.step}: ${step.title}`}
                aria-current={active === i ? "step" : undefined}
              >
                {/* Bubble */}
                <div className="relative mb-6">
                  {/* Pulse ring — only on active */}
                  {active === i && (
                    <motion.span
                      key={`ring-${i}`}
                      className="absolute inset-0 rounded-full border border-accent/50"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.9, opacity: 0 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                      aria-hidden="true"
                    />
                  )}
                  <motion.div
                    className={cn(
                      "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors duration-500",
                      active === i
                        ? "border-accent bg-accent/15 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                        : i < active
                        ? "border-accent/40 bg-accent/5"
                        : "border-border bg-bg"
                    )}
                    animate={active === i ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {i < active ? (
                      /* Completed checkmark */
                      <motion.svg
                        key="check"
                        viewBox="0 0 16 16"
                        className="w-5 h-5 text-accent"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.35 }}
                      >
                        <motion.path
                          d="M3 8l3.5 3.5L13 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-bold tabular-nums transition-colors duration-300",
                          active === i ? "text-accent" : "text-fg-muted"
                        )}
                      >
                        {step.step}
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    "text-base font-bold text-center transition-colors duration-300 mb-2",
                    active === i ? "text-fg" : "text-fg-secondary"
                  )}
                >
                  {step.title}
                </h3>

                {/* Timer progress bar under active title */}
                <div className="w-8 h-0.5 rounded-full bg-border overflow-hidden">
                  {active === i && !paused && (
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                      style={{ transformOrigin: "left" }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Animated description card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="mt-10 max-w-2xl mx-auto text-center px-8 py-7 rounded-2xl border border-border bg-bg"
            >
              <p className="text-body-lg text-fg-secondary leading-relaxed">
                {processSteps[active].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dot nav */}
          <div className="flex justify-center gap-2.5 mt-7" aria-label="Process steps">
            {processSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); setPaused(true); }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  active === i ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-border-strong"
                )}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile stack (below lg) ── */}
        <div className="lg:hidden space-y-4">
          {processSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1}>
              <div className="flex gap-5 p-6 rounded-2xl border border-border bg-bg">
                <div className="w-12 h-12 rounded-full border-2 border-accent/40 bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-accent">{step.step}</span>
                </div>
                <div>
                  <h3 className="text-h4 font-bold text-fg mb-2">{step.title}</h3>
                  <p className="text-body text-fg-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
