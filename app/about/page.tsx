import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Linkedin } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { teamMembers, toolingStack } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger } from "@/components/motion/reveal";

export const metadata: Metadata = constructMetadata({
  title: "About",
  description:
    "Aiva is an AI systems agency founded by engineers who believe great AI products are built with craft, not shortcuts.",
  path: "/about",
});

const principles = [
  {
    number: "01",
    title: "Results over demos",
    description:
      "We measure success in time saved, revenue generated, and errors eliminated — not in impressive prototype videos.",
  },
  {
    number: "02",
    title: "Honesty over hype",
    description:
      "We'll tell you when AI isn't the right answer. Our reputation is worth more than one over-sold engagement.",
  },
  {
    number: "03",
    title: "Craft at every layer",
    description:
      "From system architecture to user interface, we hold ourselves to a standard that makes us genuinely proud of our work.",
  },
  {
    number: "04",
    title: "Long-term partnerships",
    description:
      "We design every system so you can own it. Our goal is to be the last AI partner you need — not to create dependency.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 bg-bg" aria-label="About hero">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <Badge variant="accent" className="mb-6">
                  Our story
                </Badge>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="text-h1 text-fg mb-6">
                  Built by engineers who got tired of watching AI fail.
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-body-lg text-fg-secondary mb-6 leading-relaxed">
                  Aiva was founded by engineers and product builders who&apos;d
                  spent years at the intersection of AI research and real-world
                  software — and watched too many AI projects fail, not because
                  the technology wasn&apos;t ready, but because the implementation
                  wasn&apos;t.
                </p>
                <p className="text-body-lg text-fg-secondary mb-8 leading-relaxed">
                  We started Aiva with one conviction: production-grade AI
                  systems should be the norm, not the exception. We exist to
                  close the gap between what AI can do and what businesses
                  actually have deployed and running.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <Button asChild variant="primary" size="lg">
                  <Link href="/contact">
                    Start a conversation
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </Reveal>
            </div>

            {/* Right visual */}
            <Reveal direction="right">
              <div
                className="aspect-square rounded-2xl border border-border bg-bg-elevated relative overflow-hidden"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-7xl font-black gradient-text">Aiva</p>
                    <p className="text-label text-fg-muted">Est. 2022</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section-pad bg-bg-secondary" aria-label="Our principles">
        <div className="container-default">
          <Reveal className="mb-16">
            <SectionHeading
              label="Our principles"
              title="How we think, how we work."
              align="center"
            />
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div
                key={p.number}
                className="relative p-8 rounded-2xl border border-border bg-bg-elevated"
              >
                <span
                  className="absolute top-6 right-6 text-5xl font-black text-fg-muted/10 select-none"
                  aria-hidden="true"
                >
                  {p.number}
                </span>
                <h3 className="text-h4 font-bold text-fg mb-3">{p.title}</h3>
                <p className="text-body text-fg-secondary leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad bg-bg" aria-label="Team">
        <div className="container-default">
          <Reveal className="mb-16">
            <SectionHeading
              label="The team"
              title="Small on purpose. Obsessive by nature."
              description="We keep the team tight so every project gets senior-level attention. No juniors handed your work at the back of a sprint."
            />
          </Reveal>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </Stagger>
        </div>
      </section>

      {/* Tooling */}
      <section className="section-pad bg-bg-secondary" aria-label="Tooling stack">
        <div className="container-default">
          <Reveal className="mb-14">
            <SectionHeading
              label="Stack"
              title="The tools we trust."
              description="Model-agnostic. Pragmatic. Always the right tool for the job."
            />
          </Reveal>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolingStack.map((category) => (
              <div
                key={category.category}
                className="p-6 rounded-xl border border-border bg-bg-elevated"
              >
                <p className="text-label text-accent mb-4">
                  {category.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

function TeamCard({ member }: { member: (typeof teamMembers)[0] }) {
  return (
    <div className="group flex flex-col p-6 rounded-xl border border-border bg-bg-elevated hover:border-border-strong hover:shadow-md transition-all">
      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent-light/30 flex items-center justify-center mb-4 text-xl font-bold text-accent"
        aria-hidden="true"
      >
        {member.name[0]}
      </div>
      <h3 className="text-body font-bold text-fg mb-0.5">{member.name}</h3>
      <p className="text-small text-accent mb-3">{member.role}</p>
      <p className="text-small text-fg-secondary leading-relaxed flex-1">
        {member.bio}
      </p>
      <a
        href={member.linkedin}
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-accent transition-colors"
        aria-label={`${member.name} on LinkedIn`}
      >
        <Linkedin className="w-3.5 h-3.5" />
        LinkedIn
      </a>
    </div>
  );
}
