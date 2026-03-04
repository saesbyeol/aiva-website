"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { testimonials } from "@/lib/content";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function Testimonials() {
  return (
    <section
      className="section-pad bg-bg-secondary overflow-hidden"
      aria-label="Testimonials"
    >
      <div className="container-default">
        <Reveal className="mb-16">
          <SectionHeading
            label={t("testimonials.label")}
            title={t("testimonials.title")}
            align="center"
          />
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <div
      className={cn(
        "relative p-8 rounded-2xl border border-border bg-bg-elevated",
        "transition-all duration-300 hover:border-border-strong hover:shadow-md"
      )}
    >
      {/* Quote icon */}
      <div
        className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-6"
        aria-hidden="true"
      >
        <Quote className="w-4 h-4 text-accent" />
      </div>

      {/* Quote */}
      <blockquote>
        <p className="text-body-lg text-fg leading-relaxed font-medium mb-6">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <footer className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent-light/30 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-sm font-bold text-accent">
              {testimonial.author[0]}
            </span>
          </div>
          <div>
            <cite className="not-italic text-sm font-semibold text-fg block">
              {testimonial.author}
            </cite>
            <p className="text-xs text-fg-muted">{testimonial.role}</p>
          </div>
        </footer>
      </blockquote>
    </div>
  );
}
