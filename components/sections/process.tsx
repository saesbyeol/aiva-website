"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { process as processSteps } from "@/lib/content";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function Process() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

        <div
          ref={ref}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-border"
            aria-hidden="true"
          />
          <motion.div
            className="hidden lg:block absolute top-8 left-[12.5%] h-px bg-gradient-to-r from-accent to-accent-light origin-left"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ width: "75%" }}
            aria-hidden="true"
          />

          {processSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.15,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              className="relative"
            >
              {/* Step number bubble */}
              <div className="relative z-10 w-16 h-16 rounded-full border-2 border-border bg-bg flex items-center justify-center mb-6 mx-auto md:mx-0">
                <motion.div
                  className="absolute inset-0 rounded-full bg-accent/10"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                />
                <span className="text-sm font-bold text-fg-muted z-10">
                  {step.step}
                </span>
              </div>

              <h3 className="text-h4 font-bold text-fg mb-3 text-center md:text-left">
                {step.title}
              </h3>
              <p className="text-body text-fg-secondary leading-relaxed text-center md:text-left">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
