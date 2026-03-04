import * as React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { faqs } from "@/lib/content";
import { t } from "@/lib/i18n";

export function FAQ() {
  return (
    <section className="section-pad bg-bg" aria-label="Frequently asked questions">
      <div className="container-tight">
        <Reveal className="mb-14">
          <SectionHeading
            label={t("faq.label")}
            title={t("faq.title")}
            description={t("faq.description")}
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
