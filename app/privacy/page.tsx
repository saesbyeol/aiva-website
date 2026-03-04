import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";
import { t, dict } from "@/lib/i18n";

export const metadata: Metadata = constructMetadata({
  title: "Politika privatnosti",
  description: "Kako Aiva prikuplja, koristi i štiti vaše informacije.",
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  const s1Parts = t("privacy.s1Body").split("{url}");

  return (
    <section className="pt-40 pb-24 bg-bg" aria-label="Privacy policy">
      <div className="container-tight">
        <Reveal>
          <Badge variant="label" className="mb-6">{t("privacy.badge")}</Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-h1 text-fg mb-4">{t("privacy.title")}</h1>
          <p className="text-small text-fg-muted mb-12">
            {t("privacy.updated")}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="prose prose-sm max-w-none space-y-10 text-fg-secondary">
            <Section title={t("privacy.s1Title")}>
              <p>
                {s1Parts[0]}
                <a href={SITE.url} className="text-accent hover:underline">{SITE.url}</a>
                {s1Parts[1]}
              </p>
              <p>
                {t("privacy.s1Contact")}{" "}
                <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">
                  {SITE.email}
                </a>
                .
              </p>
            </Section>

            <Section title={t("privacy.s2Title")}>
              <p>
                <strong className="text-fg">Podaci obrasca za kontakt:</strong>{" "}
                {t("privacy.s2Form").replace("Podaci obrasca za kontakt: ", "")}
              </p>
              <p>
                <strong className="text-fg">Analitika:</strong>{" "}
                {t("privacy.s2Analytics").replace("Analitika: ", "")}
              </p>
              <p>
                <strong className="text-fg">Kolačići:</strong>{" "}
                {t("privacy.s2Cookies").replace("Kolačići: ", "")}
              </p>
            </Section>

            <Section title={t("privacy.s3Title")}>
              <ul className="list-disc list-inside space-y-2">
                {dict.privacy.s3List.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                {t("privacy.s3NoBuy")}
              </p>
            </Section>

            <Section title={t("privacy.s4Title")}>
              <p>{t("privacy.s4Body")}</p>
            </Section>

            <Section title={t("privacy.s5Title")}>
              <p>{t("privacy.s5Body")}</p>
              <p>
                {t("privacy.s5Contact")}{" "}
                <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">
                  {SITE.email}
                </a>
                .
              </p>
            </Section>

            <Section title={t("privacy.s6Title")}>
              <p>{t("privacy.s6Body")}</p>
              <ul className="list-disc list-inside space-y-1">
                {dict.privacy.s6List.map((item) => (
                  <li key={item.name}>
                    <strong className="text-fg">{item.name}</strong> {item.desc}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title={t("privacy.s7Title")}>
              <p>{t("privacy.s7Body")}</p>
            </Section>

            <Section title={t("privacy.s8Title")}>
              <p>{t("privacy.s8Body")}</p>
            </Section>

            <Section id="terms" title={t("privacy.s9Title")}>
              <p>{t("privacy.s9Body1")}</p>
              <p>{t("privacy.s9Body2")}</p>
            </Section>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id}>
      <h2 className="text-h4 font-bold text-fg mb-4">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </div>
  );
}
