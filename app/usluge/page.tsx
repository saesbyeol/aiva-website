import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  FileText,
  BrainCircuit,
  Database,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { services } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export const metadata: Metadata = constructMetadata({
  title: "Usluge",
  description:
    "Od AI automatizacije do prilagođenih LLM aplikacija — gradimo AI sustave koji se integriraju u vaš stek i donose mjerljive rezultate.",
  path: "/usluge",
});

const iconMap: Record<string, LucideIcon> = {
  Zap,
  FileText,
  BrainCircuit,
  Database,
  Compass,
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 bg-bg" aria-label="Services hero">
        <div className="container-default">
          <Reveal>
            <h1 className="text-h1 text-fg">
              {t("servicesPage.pageTitle")}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Service blocks */}
      <section className="section-pad bg-bg-secondary" aria-label="Service details">
        <div className="container-default space-y-24">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Zap;
            return (
              <div
                key={service.id}
                id={service.id}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                  i % 2 !== 0 && "lg:grid-flow-col-dense"
                )}
              >
                {/* Text side */}
                <Reveal direction={i % 2 === 0 ? "left" : "right"}>
                  <div className={cn(i % 2 !== 0 && "lg:col-start-2")}>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br flex-shrink-0",
                          service.color
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="label">{service.timeline}</Badge>
                    </div>
                    <h2 className="text-h2 text-fg mb-4">{service.title}</h2>
                    <p className="text-body-lg text-fg-secondary mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-label text-fg-muted mb-3">
                          {t("services.outcomesLabel")}
                        </p>
                        <ul className="space-y-2" role="list">
                          {service.outcomes.map((o) => (
                            <li
                              key={o}
                              className="flex items-start gap-2 text-sm text-fg-secondary"
                            >
                              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-label text-fg-muted mb-3">
                          {t("services.deliverablesLabel")}
                        </p>
                        <ul className="space-y-2" role="list">
                          {service.deliverables.map((d) => (
                            <li
                              key={d}
                              className="flex items-start gap-2 text-sm text-fg-secondary"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Visual side */}
                <Reveal direction={i % 2 === 0 ? "right" : "left"}>
                  <div
                    className={cn(
                      "aspect-[4/3] rounded-2xl border border-border bg-bg-elevated relative overflow-hidden",
                      i % 2 !== 0 && "lg:col-start-1 lg:row-start-1"
                    )}
                    aria-hidden="true"
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-20",
                        service.color
                      )}
                    />
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-20 h-20 text-white/10" />
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-fg-muted" />
                      <span className="text-xs text-fg-muted">
                        {service.timeline}
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

    </>
  );
}
