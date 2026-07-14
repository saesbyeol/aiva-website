import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, CheckCircle2, ArrowRight, ArrowUpRight } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { getCaseStudyBySlug, getCaseStudies } from "@/sanity/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { CaseStudyGallery } from "@/components/sections/case-study-gallery";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return {};
  return constructMetadata({
    title: study.title,
    description: study.description,
    path: `/radovi/${study.slug}`,
    locale,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();

  const allStudies = await getCaseStudies();
  const others = allStudies.filter((s) => s.slug !== slug).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 bg-bg" aria-label="Case study hero">
        <div className="container-tight">
          <Reveal>
            <Link
              href="/radovi"
              className="inline-flex items-center gap-2 text-sm text-fg-secondary hover:text-fg transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t("caseStudy.backToWork")}
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
            <p className="text-body-lg text-fg-secondary mb-6">{study.description}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {study.tags?.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
          </Reveal>
          {study.externalUrl && (
            <Reveal delay={0.25}>
              <div className="mt-8">
                <Button asChild size="lg">
                  <a
                    href={study.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    {t("work.ctaWebsite")}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Cover */}
      <div className="container-default mb-16">
        <Reveal>
          {study.externalUrl && !study.coverImageUrl ? (
            // Website project: live, clickable preview of the site
            <a
              href={study.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("work.ctaWebsite")}: ${study.title}`}
              className="group block w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-bg-elevated relative"
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.02]">
                <iframe
                  src={study.externalUrl}
                  title={study.title}
                  loading="lazy"
                  tabIndex={-1}
                  aria-hidden
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  className="absolute top-0 left-0 origin-top-left border-0 pointer-events-none"
                  style={{ width: "125%", height: "125%", transform: "scale(0.8)" }}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" aria-hidden />
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white/90">
                {t("work.ctaWebsite")}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>
          ) : (
            <div
              className="w-full aspect-[16/7] rounded-2xl overflow-hidden border border-border bg-bg-elevated relative"
              aria-hidden
            >
              {study.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={study.coverImageUrl}
                  alt={study.client}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </Reveal>
      </div>

      {/* Gallery */}
      {study.gallery?.length > 0 && (
        <CaseStudyGallery images={study.gallery} />
      )}

      {/* Description below the media */}
      {study.mediaDescription && (
        <section className="pb-16 bg-bg" aria-label="Opis projekta">
          <div className="container-tight">
            <Reveal>
              <p className="text-body-lg text-fg-secondary leading-relaxed whitespace-pre-line">
                {study.mediaDescription}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Body */}
      <section className="pb-24 bg-bg" aria-label="Case study details">
        <div className="container-tight">
          <div className="space-y-16">
            {study.problem && (
              <Reveal>
                <div>
                  <p className="text-label text-accent mb-3">{t("caseStudy.problemLabel")}</p>
                  <p className="text-body-lg text-fg-secondary leading-relaxed">{study.problem}</p>
                </div>
              </Reveal>
            )}
            {study.problem && study.approach && <div className="border-t border-border" />}
            {study.approach && (
              <Reveal>
                <div>
                  <p className="text-label text-accent mb-3">{t("caseStudy.approachLabel")}</p>
                  <p className="text-body-lg text-fg-secondary leading-relaxed">{study.approach}</p>
                </div>
              </Reveal>
            )}
            {study.approach && study.results?.length > 0 && <div className="border-t border-border" />}
            {study.results?.length > 0 && (
              <Reveal>
                <div>
                  <p className="text-label text-accent mb-6">{t("caseStudy.resultsLabel")}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
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
            )}
          </div>
        </div>
      </section>

      {/* More work */}
      {others.length > 0 && (
        <section className="section-pad bg-bg-secondary border-t border-border" aria-label="More case studies">
          <div className="container-default">
            <Reveal>
              <h2 className="text-h3 text-fg mb-10">{t("caseStudy.moreWork")}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {others.map((s) => (
                <Reveal key={s._id}>
                  <Link
                    href={{ pathname: "/radovi/[slug]", params: { slug: s.slug } }}
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
