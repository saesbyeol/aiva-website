import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { caseStudies } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return {};
  return constructMetadata({
    title: study.title,
    description: study.description,
    path: `/work/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) notFound();

  const others = caseStudies.filter((s) => s.slug !== slug).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 bg-bg" aria-label="Case study hero">
        <div className="container-tight">
          <Reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm text-fg-secondary hover:text-fg transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              All case studies
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">{study.category}</Badge>
              <span className="text-xs text-fg-muted font-mono">{study.year}</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-h1 text-fg mb-4">{study.title}</h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-body-lg text-fg-secondary mb-6">
              {study.description}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cover */}
      <div className="container-default mb-16">
        <Reveal>
          <div
            className="w-full aspect-[16/7] rounded-2xl overflow-hidden border border-border bg-bg-elevated relative"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 to-indigo-900/80" />
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-4xl font-black text-white/10">{study.client}</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Body */}
      <section className="pb-24 bg-bg" aria-label="Case study details">
        <div className="container-tight">
          <div className="space-y-16">
            {/* Problem */}
            <Reveal>
              <div>
                <p className="text-label text-accent mb-3">The problem</p>
                <p className="text-body-lg text-fg-secondary leading-relaxed">
                  {study.problem}
                </p>
              </div>
            </Reveal>

            <div className="border-t border-border" />

            {/* Approach */}
            <Reveal>
              <div>
                <p className="text-label text-accent mb-3">Our approach</p>
                <p className="text-body-lg text-fg-secondary leading-relaxed">
                  {study.approach}
                </p>
              </div>
            </Reveal>

            <div className="border-t border-border" />

            {/* Results */}
            <Reveal>
              <div>
                <p className="text-label text-accent mb-6">Results</p>
                <ul
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  role="list"
                >
                  {study.results.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-3 p-4 rounded-xl border border-border bg-bg-elevated"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-fg">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* More work */}
      {others.length > 0 && (
        <section className="section-pad bg-bg-secondary border-t border-border" aria-label="More case studies">
          <div className="container-default">
            <Reveal>
              <h2 className="text-h3 text-fg mb-10">More work</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {others.map((s) => (
                <Reveal key={s.id}>
                  <Link
                    href={`/work/${s.slug}`}
                    className="group flex items-start gap-4 p-6 rounded-xl border border-border bg-bg-elevated hover:border-border-strong hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <p className="text-label text-accent mb-1">{s.client}</p>
                      <h3 className="text-body font-semibold text-fg group-hover:text-accent transition-colors mb-2">
                        {s.title}
                      </h3>
                      <p className="text-small text-fg-muted">{s.category}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-fg-muted group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
