import type { Metadata } from "next";
import {
  ArrowRight,
  Database,
  Mic,
  Settings2,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { HeroCallCard } from "@/components/voice-agent/hero-call-card";
import { MissedCallCalculator } from "@/components/voice-agent/missed-call-calculator";
import {
  CallPlayer,
  type SystemStep,
  type Turn,
} from "@/components/voice-agent/call-player";
import { AbilitySwitcher, type Ability } from "@/components/voice-agent/ability-switcher";
import { IntegrationMap, type Tool } from "@/components/voice-agent/integration-map";
import { PickupModes, type Trigger } from "@/components/voice-agent/pickup-modes";
import { ElevenLabsWidget } from "@/components/voice-agent/elevenlabs-widget";
import { TalkButton } from "@/components/voice-agent/talk-button";
import { getTranslations, setRequestLocale } from "next-intl/server";

const CONVAI_AGENT_ID = "agent_8601m1k7w4cxe9ktwszx5d7471pb";

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
type NamedItem = { name: string; desc: string };
type Step = { number: string; name: string; desc: string };
type Faq = { q: string; a: string[] };

const pillarIcons: LucideIcon[] = [Database, Workflow, Settings2];

export default async function VoiceAgentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const turns = t.raw("voiceAgent.s2Turns") as Turn[];
  const systemSteps = t.raw("voiceAgent.s2Steps") as SystemStep[];
  const pillars = t.raw("voiceAgent.s3Pillars") as NamedItem[];
  const abilities = t.raw("voiceAgent.s4Items") as Ability[];
  const abilityPanels = t.raw("voiceAgent.abilityPanels") as React.ComponentProps<
    typeof AbilitySwitcher
  >["panels"];
  const tools = t.raw("voiceAgent.integration.tools") as Tool[];
  const triggers = t.raw("voiceAgent.s6Items") as Trigger[];
  const guardrails = t.raw("voiceAgent.s7Guardrails") as string[];
  const steps = t.raw("voiceAgent.s8Steps") as Step[];
  const faqs = t.raw("voiceAgent.s9Items") as Faq[];
  const heroChips = t.raw("voiceAgent.heroChips") as string[];

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

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="bg-bg relative overflow-hidden pt-36 pb-20"
        aria-label="AI receptionist"
      >
        <HeroBackdrop />

        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <Badge variant="accent" className="mb-6">
                {t("voiceAgent.badge")}
              </Badge>

              <h1 className="text-h1 text-fg mb-6 text-balance">
                {t("voiceAgent.title")}
              </h1>

              <p className="text-body-lg text-fg-secondary mb-8 max-w-xl leading-relaxed">
                {t("voiceAgent.intro1")}
              </p>

              <ul className="mb-9 flex flex-wrap gap-2.5" role="list">
                {heroChips.map((chip) => (
                  <li
                    key={chip}
                    className="border-border bg-bg-elevated text-fg-secondary flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium"
                  >
                    <span
                      className="bg-accent h-1.5 w-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <TalkButton className="w-full sm:w-auto" />
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="group w-full sm:w-auto"
                >
                  <Link href="/kontakt">
                    <span className="min-w-0 truncate">{t("voiceAgent.heroCta2")}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            <HeroCallCard />
          </div>
        </div>
      </section>

      {/* ── What a missed call costs ─────────────────────────────────────── */}
      <section className="section-pad bg-bg-secondary" aria-label="Cost of a missed call">
        <div className="container-default">
          <Reveal className="mb-10">
            <SectionHeading
              label={t("voiceAgent.calc.label")}
              labelClassName="text-accent"
              title={t("voiceAgent.calc.title")}
              titleClassName="text-balance"
              description={t("voiceAgent.calc.intro")}
            />
          </Reveal>
          <MissedCallCalculator />
        </div>
      </section>

      {/* ── The example call ─────────────────────────────────────────────── */}
      <section className="section-pad bg-bg" aria-label="Example call">
        <div className="container-wide">
          <Reveal className="mb-10">
            <SectionHeading
              title={t("voiceAgent.s2Title")}
              description={t("voiceAgent.s2Intro")}
              align="center"
            />
          </Reveal>

          <CallPlayer
            turns={turns}
            steps={systemSteps}
            agentLabel={t("voiceAgent.s2AgentLabel")}
            callerLabel={t("voiceAgent.s2CallerLabel")}
          />

          <div className="text-body text-fg-secondary mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 leading-relaxed md:grid-cols-2">
            <p>{t("voiceAgent.s2After1")}</p>
            <p>{t("voiceAgent.s2After2")}</p>
          </div>
        </div>
      </section>

      {/* ── Try it live ──────────────────────────────────────────────────── */}
      <section
        id="demo"
        className="bg-bg-secondary relative scroll-mt-24 overflow-hidden"
        aria-label="Talk to the agent"
      >
        <div
          className="bg-accent/10 pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[44rem] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
          aria-hidden="true"
        />
        <div className="container-tight section-pad relative z-10 text-center">
          <span className="border-accent/30 bg-accent/10 text-accent-light mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="bg-accent motion-safe:animate-ping-ring absolute inset-0 rounded-full" />
              <span className="bg-accent relative h-2 w-2 rounded-full" />
            </span>
            {t("voiceAgent.demo.label")}
          </span>

          <h2 className="text-h2 text-fg mb-5 text-balance">
            {t("voiceAgent.demo.title")}
          </h2>
          <p className="text-body-lg text-fg-secondary mx-auto mb-8 max-w-xl leading-relaxed">
            {t("voiceAgent.demo.body")}
          </p>

          <TalkButton className="mx-auto" />

          <p className="text-fg-muted mt-5 flex items-center justify-center gap-2 text-xs">
            <Mic className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {t("voiceAgent.demo.hint")}
          </p>
        </div>
      </section>

      {/* ── What it can take on ──────────────────────────────────────────── */}
      <section className="section-pad bg-bg" aria-label="What it can handle">
        <div className="container-wide">
          <Reveal className="mb-12">
            <SectionHeading title={t("voiceAgent.s4Title")} align="center" />
          </Reveal>
          <AbilitySwitcher abilities={abilities} panels={abilityPanels} />
        </div>
      </section>

      {/* ── How it connects ──────────────────────────────────────────────── */}
      <section
        className="section-pad bg-bg-secondary"
        aria-label="Connecting to your tools"
      >
        <div className="container-wide">
          <Reveal className="mb-12">
            <SectionHeading
              label={t("voiceAgent.s5Label")}
              labelClassName="text-accent"
              title={t("voiceAgent.s5Title")}
              description={t("voiceAgent.s5Body1")}
              align="center"
            />
          </Reveal>

          <IntegrationMap
            callerLabel={t("voiceAgent.integration.callerLabel")}
            callerDesc={t("voiceAgent.integration.callerDesc")}
            agentLabel={t("voiceAgent.integration.agentLabel")}
            agentDesc={t("voiceAgent.integration.agentDesc")}
            tools={tools}
          />

          <div className="text-body text-fg-secondary mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 leading-relaxed md:grid-cols-2">
            <p>{t("voiceAgent.s5Body2")}</p>
            <p>{t("voiceAgent.s5Body3")}</p>
          </div>

          {/* The three things the solution is built around */}
          <div className="border-border mt-14 border-t pt-12">
            <p className="text-fg-secondary text-body mx-auto mb-8 max-w-2xl text-center leading-relaxed">
              {t("voiceAgent.s3Body3")}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {pillars.map((pillar, i) => {
                const Icon = pillarIcons[i] ?? Database;
                return (
                  <div
                    key={pillar.name}
                    className="border-border bg-bg-elevated flex h-full items-start gap-3.5 rounded-2xl border p-5"
                  >
                    <span
                      className="bg-accent/10 border-accent/20 text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                      aria-hidden="true"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-fg text-small font-bold">{pillar.name}</h3>
                      <p className="text-fg-secondary mt-1 text-xs leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── When the AI picks up ─────────────────────────────────────────── */}
      <section className="section-pad bg-bg" aria-label="When the AI answers">
        <div className="container-default">
          <Reveal className="mb-12">
            <SectionHeading
              title={t("voiceAgent.s6Title")}
              description={t("voiceAgent.s6Intro")}
              align="center"
            />
          </Reveal>
          <PickupModes
            triggers={triggers}
            teamLabel={t("voiceAgent.pickup.teamLabel")}
            agentLabel={t("voiceAgent.pickup.agentLabel")}
            closedLabel={t("voiceAgent.pickup.closedLabel")}
          />
        </div>
      </section>

      {/* ── Handover to the team ─────────────────────────────────────────── */}
      <section className="section-pad bg-bg-secondary" aria-label="Handover to your team">
        <div className="container-default">
          <Reveal className="mb-12">
            <SectionHeading title={t("voiceAgent.s7Title")} />
          </Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-body text-fg-secondary space-y-4 leading-relaxed">
              <p>{t("voiceAgent.s7Body1")}</p>
              <p>{t("voiceAgent.s7Body2")}</p>
              <p>{t("voiceAgent.s7Body3")}</p>
            </div>
            <div className="border-border bg-bg-elevated h-fit rounded-2xl border p-6 sm:p-8">
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
          </div>
        </div>
      </section>

      {/* ── Our approach ─────────────────────────────────────────────────── */}
      <section className="section-pad bg-bg" aria-label="Our approach">
        <div className="container-default">
          <Reveal className="mb-12">
            <SectionHeading title={t("voiceAgent.s8Title")} align="center" />
          </Reveal>

          {/* A real sequence, so the numbering earns the vertical spine. */}
          <ol
            className="border-border relative ml-4 space-y-8 border-l pl-8 sm:ml-6 sm:pl-10"
            role="list"
          >
            {steps.map((step) => (
              <li key={step.number} className="relative">
                <span
                  className="bg-bg border-accent/40 text-accent absolute top-0 -left-[3.05rem] flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs font-bold sm:-left-[3.55rem]"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <h3 className="text-h4 text-fg mb-2 font-bold">{step.name}</h3>
                <p className="text-body text-fg-secondary max-w-2xl leading-relaxed">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        className="section-pad bg-bg-secondary"
        aria-label="Frequently asked questions"
      >
        <div className="container-tight">
          <Reveal className="mb-10">
            <SectionHeading title={t("voiceAgent.s9Title")} align="center" />
          </Reveal>
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
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="section-pad bg-bg" aria-label="Get in touch">
        <div className="container-tight text-center">
          <Reveal>
            <h2 className="text-h2 text-fg mb-4 text-balance">
              {t("voiceAgent.ctaTitle")}
            </h2>
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

      <ElevenLabsWidget agentId={CONVAI_AGENT_ID} language={locale} />
    </>
  );
}

/** Gradient orbs and grid, matching the home page hero's treatment. */
function HeroBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="bg-accent/[0.08] absolute -top-[25%] -left-[10%] h-[60%] w-[55%] rounded-full blur-[120px]" />
      <div className="bg-accent-light/[0.06] absolute top-[20%] -right-[15%] h-[65%] w-[55%] rounded-full blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
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
