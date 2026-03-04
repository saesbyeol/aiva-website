import { t } from "./i18n";

export const SITE = {
  name: "Aiva",
  tagline: "AI sustavi koji se isporučuju.",
  description:
    "Aiva gradi produkcijsko-spremne AI sustave — automatizacije, pipeline-ove za sadržaj, prilagođene LLM aplikacije — koji se besprijekorno integriraju u vaše poslovanje i donose mjerljive rezultate.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aiva.agency",
  email: "inquiry@aiva.hr",
  twitter: "@aiva_agency",
  linkedIn: "https://linkedin.com/company/aiva-agency",
};

export const NAV_LINKS = [
  { label: t("nav.services"), href: "/services" },
  { label: t("nav.work"), href: "/work" },
  { label: t("nav.about"), href: "/about" },
  { label: t("nav.contact"), href: "/contact" },
];

export const FOOTER_LINKS = {
  company: [
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.work"), href: "/work" },
    { label: t("nav.services"), href: "/services" },
    { label: t("nav.contact"), href: "/contact" },
  ],
  legal: [
    { label: t("privacy.title"), href: "/privacy" },
    { label: "Uvjeti korištenja", href: "/privacy#terms" },
  ],
  social: [
    { label: "Twitter", href: "https://twitter.com/aiva_agency" },
    { label: "LinkedIn", href: "https://linkedin.com/company/aiva-agency" },
    { label: "GitHub", href: "https://github.com/aiva-agency" },
  ],
};
