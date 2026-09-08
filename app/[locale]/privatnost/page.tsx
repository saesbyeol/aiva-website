import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { AZOP, COMPANY } from "@/lib/constants";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return constructMetadata({
    title: t("meta.privacy.title"),
    description: t("meta.privacy.description"),
    path: "/privatnost",
    noIndex: true,
    locale,
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

// Shapes of the `t.raw` blocks in messages/{hr,en}.json → privacy.*
type DataGroup = { name: string; desc: string; items: string[] };
type PurposeRow = { purpose: string; basis: string; detail: string };
type RetentionRow = { what: string; period: string };
type Processor = { name: string; role: string; location: string };
type NamedItem = { name: string; desc: string };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const s2Groups = t.raw("privacy.s2Groups") as DataGroup[];
  const s3Rows = t.raw("privacy.s3Rows") as PurposeRow[];
  const s4Rows = t.raw("privacy.s4Rows") as RetentionRow[];
  const s5List = t.raw("privacy.s5List") as Processor[];
  const s7List = t.raw("privacy.s7List") as NamedItem[];
  const s8Groups = t.raw("privacy.s8Groups") as NamedItem[];

  // Controller identity comes from lib/constants (public-record facts), not the
  // message catalogs — only the labels are translated, so the OIB and address
  // can never drift between HR and EN.
  const controllerRows = [
    {
      label: t("privacy.s1LabelEntity"),
      value: `${COMPANY.legalName} (${COMPANY.shortName})`,
    },
    {
      label: t("privacy.s1LabelBrand"),
      value: `${COMPANY.brand} (${COMPANY.brandDomain})`,
    },
    { label: t("privacy.s1LabelAddress"), value: `${COMPANY.street}, ${COMPANY.city}` },
    { label: t("privacy.s1LabelOib"), value: COMPANY.oib },
  ];

  return (
    <section className="bg-bg pt-40 pb-24" aria-label="Privacy policy">
      <div className="container-tight">
        <Reveal>
          <Badge variant="label" className="mb-6">
            {t("privacy.badge")}
          </Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-h1 text-fg mb-4">{t("privacy.title")}</h1>
          <p className="text-small text-fg-muted mb-8">{t("privacy.updated")}</p>
          <p className="text-body text-fg-secondary mb-12 leading-relaxed">
            {t("privacy.intro")}
          </p>
        </Reveal>

        <div className="text-fg-secondary max-w-none space-y-12">
          {/* 1. Controller */}
          <Section title={t("privacy.s1Title")}>
            <p>{t("privacy.s1Body")}</p>
            <dl className="border-border bg-bg-elevated divide-border divide-y rounded-xl border">
              {controllerRows.map((row) => (
                <Row key={row.label} label={row.label}>
                  {row.value}
                </Row>
              ))}
              <Row label={t("privacy.s1LabelContact")}>
                <MailLink address={COMPANY.privacyEmail} />
              </Row>
            </dl>
            <p>{t("privacy.s1Dpo")}</p>
          </Section>

          {/* 2. What we collect */}
          <Section title={t("privacy.s2Title")}>
            <p>{t("privacy.s2Body")}</p>
            <div className="space-y-5">
              {s2Groups.map((group) => (
                <div key={group.name}>
                  <h3 className="text-body text-fg mb-1.5 font-semibold">{group.name}</h3>
                  <p className="leading-relaxed">{group.desc}</p>
                  {group.items.length > 0 && (
                    <ul className="mt-2 list-outside list-disc space-y-1 pl-5">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <p className="text-small text-fg-muted">{t("privacy.s2Ip")}</p>
          </Section>

          {/* 3. Purposes and legal basis */}
          <Section title={t("privacy.s3Title")}>
            <p>{t("privacy.s3Body")}</p>
            <ul className="space-y-4" role="list">
              {s3Rows.map((row) => (
                <li
                  key={row.purpose}
                  className="border-border bg-bg-elevated rounded-xl border p-5"
                >
                  <p className="text-body text-fg font-semibold">{row.purpose}</p>
                  <p className="text-label text-accent mt-1.5">{row.basis}</p>
                  <p className="text-small mt-2.5 leading-relaxed">{row.detail}</p>
                </li>
              ))}
            </ul>
          </Section>

          {/* 4. Retention */}
          <Section title={t("privacy.s4Title")}>
            <p>{t("privacy.s4Body")}</p>
            <dl className="border-border bg-bg-elevated divide-border divide-y rounded-xl border">
              {s4Rows.map((row) => (
                <Row key={row.what} label={row.what}>
                  {row.period}
                </Row>
              ))}
            </dl>
            <p>{t("privacy.s4After")}</p>
          </Section>

          {/* 5. Recipients */}
          <Section title={t("privacy.s5Title")}>
            <p>{t("privacy.s5Body")}</p>
            <ul
              className="border-border bg-bg-elevated divide-border divide-y rounded-xl border"
              role="list"
            >
              {s5List.map((p) => (
                <li key={p.name} className="px-5 py-4">
                  <p className="text-small text-fg font-semibold">{p.name}</p>
                  <p className="text-small mt-1">{p.role}</p>
                  <p className="text-fg-muted mt-1 text-xs">
                    {t("privacy.s5ColLocation")}: {p.location}
                  </p>
                </li>
              ))}
            </ul>
            <p>{t("privacy.s5Fonts")}</p>
            <p>{t("privacy.s5Authorities")}</p>
          </Section>

          {/* 6. International transfers */}
          <Section title={t("privacy.s6Title")}>
            <p>{t("privacy.s6Body")}</p>
            <p>
              {t("privacy.s6Copy")} <MailLink address={COMPANY.privacyEmail} />
            </p>
          </Section>

          {/* 7. Rights */}
          <Section title={t("privacy.s7Title")}>
            <p>{t("privacy.s7Body")}</p>
            <ul className="list-outside list-disc space-y-2.5 pl-5" role="list">
              {s7List.map((right) => (
                <li key={right.name} className="leading-relaxed">
                  <strong className="text-fg font-semibold">{right.name}</strong>
                  {" — "}
                  {right.desc}
                </li>
              ))}
            </ul>
            <p>{t("privacy.s7How")}</p>
          </Section>

          {/* 8. Cookies */}
          <Section title={t("privacy.s8Title")}>
            <p>{t("privacy.s8Body")}</p>
            <ul className="list-outside list-disc space-y-2.5 pl-5" role="list">
              {s8Groups.map((group) => (
                <li key={group.name} className="leading-relaxed">
                  <strong className="text-fg font-semibold">{group.name}</strong>
                  {" — "}
                  {group.desc}
                </li>
              ))}
            </ul>
            <p>{t("privacy.s8Manage")}</p>
            <p>{t("privacy.s8Storage")}</p>
          </Section>

          {/* 9. Security */}
          <Section title={t("privacy.s9Title")}>
            <p>{t("privacy.s9Body")}</p>
            <p>{t("privacy.s9Caveat")}</p>
          </Section>

          {/* 10. Automated decision-making */}
          <Section title={t("privacy.s10Title")}>
            <p>{t("privacy.s10Body")}</p>
          </Section>

          {/* 11. Minors */}
          <Section title={t("privacy.s11Title")}>
            <p>{t("privacy.s11Body")}</p>
          </Section>

          {/* 12. Changes */}
          <Section title={t("privacy.s12Title")}>
            <p>{t("privacy.s12Body")}</p>
          </Section>

          {/* 13. Contact and complaints */}
          <Section title={t("privacy.s13Title")}>
            <p>
              {t("privacy.s13Body")} <MailLink address={COMPANY.privacyEmail} />
            </p>
            <p>{t("privacy.s13Azop")}</p>
            <dl className="border-border bg-bg-elevated divide-border divide-y rounded-xl border">
              <Row label={t("privacy.s13AzopLabelAddress")}>
                <span className="text-fg block font-semibold">
                  {t("privacy.s13AzopName")}
                </span>
                {AZOP.address}
              </Row>
              <Row label={t("privacy.s13AzopLabelEmail")}>
                <MailLink address={AZOP.email} />
              </Row>
              <Row label={t("privacy.s13AzopLabelWeb")}>
                <a
                  href={AZOP.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {AZOP.webLabel}
                </a>
              </Row>
            </dl>
          </Section>

          {/* 14. Terms of use — the footer links straight to this anchor */}
          <Section id="terms" title={t("privacy.s14Title")}>
            <p>{t("privacy.s14Body1")}</p>
            <p>{t("privacy.s14Body2")}</p>
            <p>{t("privacy.s14Body3")}</p>
          </Section>
        </div>
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
    <Reveal>
      <div id={id} className="scroll-mt-32">
        <h2 className="text-h4 text-fg mb-4 font-bold">{title}</h2>
        <div className="text-small space-y-4 leading-relaxed">{children}</div>
      </div>
    </Reveal>
  );
}

/**
 * One label/value pair inside a bordered <dl>. Stacks on mobile and splits into
 * two columns from `sm` up, so the long legal-entity name never forces the card
 * to scroll sideways.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4">
      <dt className="text-label text-fg-muted sm:pt-0.5">{label}</dt>
      <dd className="text-small text-fg-secondary break-words">{children}</dd>
    </div>
  );
}

function MailLink({ address }: { address: string }) {
  return (
    <a href={`mailto:${address}`} className="text-accent hover:underline">
      {address}
    </a>
  );
}
