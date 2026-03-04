"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { t } from "@/lib/i18n";

export function CTA() {
  return (
    <section
      className="section-pad bg-bg-secondary relative overflow-hidden"
      aria-label="Call to action"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full rounded-[50%] bg-accent/[0.06] blur-[80px]" />
      </div>

      <div className="container-tight relative z-10 text-center">
        <Reveal>
          <p className="text-label text-fg-muted mb-6">{t("cta.label")}</p>
          <h2 className="text-h1 text-fg mb-6">
            {t("cta.title")}
            <br />
            <span className="gradient-text">{t("cta.titleAccent")}</span>
          </h2>
          <p className="text-body-lg text-fg-secondary mb-10 max-w-xl mx-auto">
            {t("cta.description")}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="primary" className="group w-full sm:w-auto">
              <Link href="/contact">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{t("cta.primaryCta")}</span>
                <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <a href="mailto:hello@aiva.agency">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{t("cta.secondaryCta")}</span>
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 text-xs text-fg-muted">
            {t("cta.note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
