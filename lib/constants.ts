import { t } from "./i18n";

export const SITE = {
  name: "Aiva",
  tagline: "AI sustavi koji se isporučuju.",
  description:
    "Aiva gradi produkcijsko-spremne AI sustave — automatizacije, pipeline-ove za sadržaj, prilagođene LLM aplikacije — koji se besprijekorno integriraju u vaše poslovanje i donose mjerljive rezultate.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aiva.agency",
  email: "inquiry@aiva.hr",
  instagram: "https://www.instagram.com/aiva.hr",
  facebook: "https://web.facebook.com/people/Aiva/61586583368219/",
};

export const NAV_LINKS = [
  { label: t("nav.services"), href: "/usluge" },
  // { label: t("nav.work"), href: "/radovi" },
  { label: t("nav.about"), href: "/o-nama" },
  { label: t("nav.contact"), href: "/kontakt" },
];

export const FOOTER_LINKS = {
  company: [
    { label: t("nav.about"), href: "/o-nama" },
    // { label: t("nav.work"), href: "/radovi" },
    { label: t("nav.services"), href: "/usluge" },
    { label: t("nav.contact"), href: "/kontakt" },
  ],
  legal: [
    { label: t("privacy.title"), href: "/privatnost" },
    { label: "Uvjeti korištenja", href: "/privatnost#terms" },
  ],
  social: [
    { label: "Instagram", href: "https://www.instagram.com/aiva.hr" },
    { label: "Facebook", href: "https://web.facebook.com/people/Aiva/61586583368219/" },
  ],
};
