import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { ContactForm } from "./contact-form";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { Mail, Calendar, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Contact",
  description:
    "Book a free discovery call or send us a message. We respond within one business day.",
  path: "/contact",
});

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@aiva.agency",
    href: "mailto:hello@aiva.agency",
  },
  {
    icon: Calendar,
    label: "Discovery call",
    value: "Book via Calendly",
    href: "#calendly",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote-first, global",
    href: null,
  },
  {
    icon: MessageSquare,
    label: "Response time",
    value: "Within 1 business day",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 bg-bg" aria-label="Contact hero">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <Reveal>
                <Badge variant="accent" className="mb-6">
                  Contact
                </Badge>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="text-h1 text-fg mb-6">
                  Let&apos;s talk
                  <br />
                  <span className="gradient-text">about your problem.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-body-lg text-fg-secondary mb-10 leading-relaxed">
                  Tell us what you&apos;re working on and we&apos;ll tell you if
                  AI can help — and how. No pitch. No pressure. Just an honest
                  conversation.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="space-y-5">
                  {contactDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-center gap-4"
                    >
                      <div
                        className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <detail.icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-fg-muted mb-0.5">
                          {detail.label}
                        </p>
                        {detail.href ? (
                          <a
                            href={detail.href}
                            className="text-sm font-medium text-fg hover:text-accent transition-colors link-underline"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-fg">
                            {detail.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Calendly placeholder */}
              <Reveal delay={0.2}>
                <div
                  id="calendly"
                  className="mt-10 p-6 rounded-xl border border-border bg-bg-elevated"
                >
                  <p className="text-sm font-semibold text-fg mb-1">
                    Prefer to book directly?
                  </p>
                  <p className="text-xs text-fg-muted mb-4">
                    Schedule a 30-minute discovery call at a time that works for
                    you.
                  </p>
                  <a
                    href="https://calendly.com/aiva-agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-dark transition-colors"
                    aria-label="Book a discovery call on Calendly (opens in new tab)"
                  >
                    <Calendar className="w-4 h-4" />
                    Open Calendly
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal delay={0.1} direction="right">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
