import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy",
  description: "How Aiva collects, uses, and protects your information.",
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <section className="pt-40 pb-24 bg-bg" aria-label="Privacy policy">
      <div className="container-tight">
        <Reveal>
          <Badge variant="label" className="mb-6">Legal</Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-h1 text-fg mb-4">Privacy Policy</h1>
          <p className="text-small text-fg-muted mb-12">
            Last updated: January 2025
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="prose prose-sm max-w-none space-y-10 text-fg-secondary">
            <Section title="1. Who we are">
              <p>
                {SITE.name} (&ldquo;Aiva&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website {SITE.url}. This privacy policy explains how we handle information
                that you provide to us or that we collect through your use of this website.
              </p>
              <p>
                For questions, contact us at{" "}
                <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">
                  {SITE.email}
                </a>
                .
              </p>
            </Section>

            <Section title="2. Information we collect">
              <p>
                <strong className="text-fg">Contact form data:</strong> When you
                submit our contact form, we collect your name, email address,
                company name (optional), and the message you write. This is used
                solely to respond to your inquiry.
              </p>
              <p>
                <strong className="text-fg">Analytics:</strong> If you have
                analytics configured (Plausible), we collect anonymised,
                aggregate data about page visits. Plausible does not use cookies
                and is GDPR compliant. No personal data is collected.
              </p>
              <p>
                <strong className="text-fg">Cookies:</strong> This website does
                not use tracking or advertising cookies. We may set a session
                cookie for theme preference (dark/light mode).
              </p>
            </Section>

            <Section title="3. How we use your information">
              <ul className="list-disc list-inside space-y-2">
                <li>To respond to enquiries submitted via our contact form</li>
                <li>To understand aggregate website usage and improve performance</li>
                <li>To comply with legal obligations</li>
              </ul>
              <p>
                We do <strong className="text-fg">not</strong> sell, rent, or
                trade your personal data with third parties.
              </p>
            </Section>

            <Section title="4. Data retention">
              <p>
                Contact form submissions are retained for up to 12 months, after
                which they are deleted unless we have an ongoing contractual
                relationship. You may request deletion at any time.
              </p>
            </Section>

            <Section title="5. Your rights">
              <p>
                Under GDPR and applicable data protection laws, you have the
                right to: access your personal data, correct inaccuracies,
                request deletion, withdraw consent, and lodge a complaint with a
                supervisory authority.
              </p>
              <p>
                To exercise any of these rights, email us at{" "}
                <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">
                  {SITE.email}
                </a>
                .
              </p>
            </Section>

            <Section title="6. Third-party services">
              <p>
                We may use the following third-party services, each with their
                own privacy policies:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong className="text-fg">Resend</strong> — email delivery
                </li>
                <li>
                  <strong className="text-fg">Plausible Analytics</strong> —
                  privacy-preserving web analytics (optional)
                </li>
                <li>
                  <strong className="text-fg">Vercel</strong> — website hosting
                </li>
              </ul>
            </Section>

            <Section title="7. Security">
              <p>
                We implement appropriate technical and organisational measures to
                protect your personal data against unauthorised access, loss, or
                disclosure. All data is transmitted over HTTPS.
              </p>
            </Section>

            <Section title="8. Changes to this policy">
              <p>
                We may update this policy from time to time. The &ldquo;last
                updated&rdquo; date at the top reflects the most recent revision.
                Continued use of the website constitutes acceptance of the updated
                policy.
              </p>
            </Section>

            <Section id="terms" title="9. Terms of use">
              <p>
                By accessing this website, you agree to use it lawfully and in
                good faith. You may not use it to transmit harmful, unlawful, or
                offensive content. We reserve the right to restrict access to the
                website at our discretion.
              </p>
              <p>
                All content on this website is the property of {SITE.name} and
                protected by applicable intellectual property laws.
              </p>
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
