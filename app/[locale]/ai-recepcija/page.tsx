import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  ClipboardList,
  Clock,
  Database,
  MessageCircleQuestion,
  PhoneCall,
  PhoneForwarded,
  Settings2,
  ShieldCheck,
  User,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return constructMetadata({
    title: t("meta.voiceAgent.title"),
    description: t("meta.voiceAgent.description"),
    path: "/ai-recepcija",
    locale,
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

// Shapes of the `t.raw` blocks in messages/{hr,en}.json → voiceAgent.*
type Turn = { role: "agent" | "caller" | "system"; text: string };
type NamedItem = { name: string; desc: string };
type IconItem = NamedItem & { icon: string };
type Step = { number: string; name: string; desc: string };
type Faq = { q: string; a: string[] };

// Icon names live in the catalogs as plain strings so the copy stays free of
// code; this map is the only place they resolve to components.
const iconMap: Record<string, LucideIcon> = {
  MessageCircleQuestion,
  CalendarCheck,
  ClipboardList,
  PhoneForwarded,
};

const pillarIcons: LucideIcon[] = [Database, Workflow, Settings2];
const triggerIcons: LucideIcon[] = [PhoneCall, Clock, Bot];

export default async function VoiceAgentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const turns = t.raw("voiceAgent.s2Turns") as Turn[];
  const pillars = t.raw("voiceAgent.s3Pillars") as NamedItem[];
  const abilities = t.raw("voiceAgent.s4Items") as IconItem[];
  const triggers = t.raw("voiceAgent.s6Items") as NamedItem[];
  const guardrails = t.raw("voiceAgent.s7Guardrails") as string[];
  const steps = t.raw("voiceAgent.s8Steps") as Step[];
  const faqs = t.raw("voiceAgent.s9Items") as Faq[];

  // Mirrors the visible FAQ block below. Kept in the same component so the two
  // cannot drift apart, which is what makes the markup eligible for rich results.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-bg pt-40 pb-20" aria-label="AI receptionist hero">
        <div className="container-default">
          <Reveal>
            <Badge variant="accent" className="mb-6">
              {t("voiceAgent.badge")}
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-h1 text-fg mb-6 max-w-4xl">{t("voiceAgent.title")}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="max-w-2xl space-y-4">
              <p className="text-body-lg text-fg-secondary leading-relaxed">
                {t("voiceAgent.intro1")}
              </p>
              <p className="text-body-lg text-fg-secondary leading-relaxed">
                {t("voiceAgent.intro2")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What it is */}
      <section
        className="section-pad bg-bg-secondary"
        aria-label="What an AI receptionist is"
      >
        <div className="container-default">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <div className="lg:sticky lg:top-32">
                <Reveal direction="left">
                  <SectionHeading
                    label={t("voiceAgent.s1Label")}
                    labelClassName="text-accent"
                    title={t("voiceAgent.s1Title")}
                    titleClassName="text-balance"
                    description={t("voiceAgent.s1Body1")}
                  />
                </Reveal>
              </div>
            </div>
            <Reveal direction="right">
              <div className="text-body text-fg-secondary space-y-5 leading-relaxed">
                <p>{t("voiceAgent.s1Body2")}</p>
                <p>{t("voiceAgent.s1Body3")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Example call — the centrepiece of the page */}
      <section className="section-pad bg-bg" aria-label="Example call">
        <div className="container-tight">
          <Reveal className="mb-10">
            <SectionHeading
              title={t("voiceAgent.s2Title")}
              description={t("voiceAgent.s2Intro")}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <Transcript
              turns={turns}
              agentLabel={t("voiceAgent.s2AgentLabel")}
              callerLabel={t("voiceAgent.s2CallerLabel")}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="text-body text-fg-secondary mt-10 space-y-4 leading-relaxed">
              <p>{t("voiceAgent.s2After1")}</p>
              <p>{t("voiceAgent.s2After2")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Under the hood */}
      <section
        className="section-pad bg-bg-secondary"
        aria-label="How it works behind the scenes"
      >
        <div className="container-default">
          <Reveal className="mb-12">
            <SectionHeading title={t("voiceAgent.s3Title")} align="center" />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="text-body text-fg-secondary mx-auto mb-12 max-w-3xl space-y-4 text-center leading-relaxed">
              <p>{t("voiceAgent.s3Body1")}</p>
              <p>{t("voiceAgent.s3Body2")}</p>
              <p>{t("voiceAgent.s3Body3")}</p>
            </div>
          </Reveal>

          {/* The three things the solution is built around */}
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = pillarIcons[i] ?? Database;
              return (
                <div
                  key={pillar.name}
                  className="border-border bg-bg-elevated h-full rounded-2xl border p-6 text-center"
                >
                  <div
                    className="bg-accent/10 border-accent/20 mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg border"
                    aria-hidden="true"
                  >
                    <Icon className="text-accent h-5 w-5" />
                  </div>
                  <h3 className="text-h4 text-fg mb-2 font-bold">{pillar.name}</h3>
                  <p className="text-small text-fg-secondary leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* What it can take on */}
      <section className="section-pad bg-bg" aria-label="What it can handle">
        <div className="container-default">
          <Reveal className="mb-12">
            <SectionHeading title={t("voiceAgent.s4Title")} align="center" />
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {abilities.map((item) => {
              const Icon = iconMap[item.icon] ?? MessageCircleQuestion;
              return (
                <div
                  key={item.name}
                  className="border-border bg-bg-elevated hover:border-border-strong flex h-full flex-col items-center gap-4 rounded-2xl border p-6 text-center transition-colors"
                >
                  <div
                    className="bg-accent/10 border-accent/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                    aria-hidden="true"
                  >
                    <Icon className="text-accent h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-body text-fg mb-1.5 font-bold">{item.name}</h3>
                    <p className="text-small text-fg-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Integrations */}
      <section
        className="section-pad bg-bg-secondary"
        aria-label="Connecting to your tools"
      >
        <div className="container-default">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <div className="lg:sticky lg:top-32">
                <Reveal direction="left">
                  <SectionHeading
                    label={t("voiceAgent.s5Label")}
                    labelClassName="text-accent"
                    title={t("voiceAgent.s5Title")}
                    titleClassName="text-balance"
                    description={t("voiceAgent.s5Body1")}
                  />
                </Reveal>
              </div>
            </div>
            <Reveal direction="right">
              <div className="text-body text-fg-secondary space-y-5 leading-relaxed">
                <p>{t("voiceAgent.s5Body2")}</p>
                <p>{t("voiceAgent.s5Body3")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* When the AI picks up */}
      <section className="section-pad bg-bg" aria-label="When the AI answers">
        <div className="container-default">
          <Reveal className="mb-12">
            <SectionHeading
              title={t("voiceAgent.s6Title")}
              description={t("voiceAgent.s6Intro")}
              align="center"
            />
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {triggers.map((item, i) => {
              const Icon = triggerIcons[i] ?? PhoneCall;
              return (
                <div
                  key={item.name}
                  className="border-border bg-bg-elevated h-full rounded-2xl border p-6 text-center"
                >
                  <div className="mb-4 flex items-center justify-center gap-3">
                    <div
                      className="bg-bg-secondary border-border flex h-9 w-9 items-center justify-center rounded-lg border"
                      aria-hidden="true"
                    >
                      <Icon className="text-accent h-4 w-4" />
                    </div>
                    <Badge variant="label">{`0${i + 1}`}</Badge>
                  </div>
                  <h3 className="text-body text-fg mb-2 font-bold">{item.name}</h3>
                  <p className="text-small text-fg-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Handover to the team */}
      <section className="section-pad bg-bg-secondary" aria-label="Handover to your team">
        <div className="container-default">
          <Reveal className="mb-12">
            <SectionHeading title={t("voiceAgent.s7Title")} />
          </Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal direction="left">
              <div className="text-body text-fg-secondary space-y-4 leading-relaxed">
                <p>{t("voiceAgent.s7Body1")}</p>
                <p>{t("voiceAgent.s7Body2")}</p>
                <p>{t("voiceAgent.s7Body3")}</p>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="border-border bg-bg-elevated rounded-2xl border p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-2.5">
                  <ShieldCheck className="text-accent h-4 w-4" aria-hidden="true" />
                  <p className="text-label">{t("voiceAgent.s7GuardrailsLabel")}</p>
                </div>
                <ul className="space-y-3" role="list">
                  {guardrails.map((rule) => (
                    <li
                      key={rule}
                      className="text-small text-fg-secondary flex items-start gap-3 leading-relaxed"
                    >
                      <span
                        className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        aria-hidden="true"
                      />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="section-pad bg-bg" aria-label="Our approach">
        <div className="container-default">
          <Reveal className="mb-12">
            <SectionHeading title={t("voiceAgent.s8Title")} align="center" />
          </Reveal>
          <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-2" role="list">
            {steps.map((step) => (
              <li
                key={step.number}
                className="border-border bg-bg-elevated h-full rounded-2xl border p-6 text-center sm:p-8"
              >
                <span
                  className="text-accent text-label mb-3 block select-none"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <h3 className="text-h4 text-fg mb-3 font-bold">{step.name}</h3>
                <p className="text-small text-fg-secondary leading-relaxed">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="section-pad bg-bg-secondary"
        aria-label="Frequently asked questions"
      >
        <div className="container-tight">
          <Reveal className="mb-10">
            <SectionHeading title={t("voiceAgent.s9Title")} align="center" />
          </Reveal>
          <Reveal delay={0.05}>
            {/* Native <details> so the answers are expandable without JavaScript
                and remain findable by in-page search when closed. */}
            <div className="divide-border border-border bg-bg-elevated divide-y rounded-2xl border">
              {faqs.map((faq) => (
                <details key={faq.q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-body text-fg font-semibold">{faq.q}</h3>
                    <span
                      className="text-fg-muted mt-1 shrink-0 transition-transform duration-200 group-open:rotate-45"
                      aria-hidden="true"
                    >
                      <Plus />
                    </span>
                  </summary>
                  <div className="text-small text-fg-secondary mt-3 space-y-3 leading-relaxed">
                    {faq.a.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-pad bg-bg" aria-label="Get in touch">
        <div className="container-tight text-center">
          <Reveal>
            <h2 className="text-h2 text-fg mb-4">{t("voiceAgent.ctaTitle")}</h2>
            <p className="text-body-lg text-fg-secondary mb-8 leading-relaxed">
              {t("voiceAgent.ctaBody")}
            </p>
            <Button asChild variant="primary" size="lg" className="group">
              <Link href="/kontakt">
                <span className="min-w-0 truncate">{t("voiceAgent.ctaButton")}</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/**
 * The example phone call, rendered as an ordered transcript rather than a chat
 * mock-up: each turn keeps its speaker label in the text (not just in colour or
 * position), so the conversation still reads correctly to a screen reader and
 * in high-contrast modes.
 *
 * `system` turns are not speech, they narrate what the agent is doing between
 * utterances, so they are centred and visually distinct from either speaker.
 */
function Transcript({
  turns,
  agentLabel,
  callerLabel,
}: {
  turns: Turn[];
  agentLabel: string;
  callerLabel: string;
}) {
  return (
    <div className="border-border bg-bg-elevated overflow-hidden rounded-2xl border">
      {/* Call header */}
      <div className="border-border bg-bg-secondary flex items-center gap-3 border-b px-5 py-3.5 sm:px-6">
        <span
          className="bg-accent/10 border-accent/20 flex h-8 w-8 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <PhoneCall className="text-accent h-3.5 w-3.5" />
        </span>
        <p className="text-label">{agentLabel}</p>
        <span
          className="text-fg-muted ml-auto flex items-center gap-1.5 text-xs"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          00:14
        </span>
      </div>

      <ol className="space-y-5 p-5 sm:p-7" role="list">
        {turns.map((turn, i) => {
          if (turn.role === "system") {
            return (
              <li key={i} className="flex items-start gap-3 py-1">
                <span className="bg-border h-px flex-1 self-center" aria-hidden="true" />
                <span className="text-fg-muted flex max-w-md items-start gap-2.5 text-xs leading-relaxed italic">
                  <Settings2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {turn.text}
                </span>
                <span className="bg-border h-px flex-1 self-center" aria-hidden="true" />
              </li>
            );
          }

          const isAgent = turn.role === "agent";
          return (
            <li
              key={i}
              className={cn("flex gap-3", isAgent ? "justify-start" : "justify-end")}
            >
              {isAgent && <Avatar icon={Bot} accent />}
              <div className={cn("max-w-[85%] sm:max-w-[75%]", !isAgent && "text-right")}>
                <p className="text-label mb-1.5">{isAgent ? agentLabel : callerLabel}</p>
                <p
                  className={cn(
                    "text-small inline-block rounded-2xl px-4 py-3 text-left leading-relaxed",
                    isAgent
                      ? "bg-accent/10 border-accent/20 text-fg rounded-tl-sm border"
                      : "bg-bg-secondary border-border text-fg-secondary rounded-tr-sm border"
                  )}
                >
                  {turn.text}
                </p>
              </div>
              {!isAgent && <Avatar icon={User} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Avatar({ icon: Icon, accent }: { icon: LucideIcon; accent?: boolean }) {
  return (
    <span
      className={cn(
        "mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
        accent
          ? "bg-accent/10 border-accent/20 text-accent"
          : "bg-bg-secondary border-border text-fg-muted"
      )}
      aria-hidden="true"
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

/** Small plus that rotates into a cross when its <details> parent is open. */
function Plus() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}
