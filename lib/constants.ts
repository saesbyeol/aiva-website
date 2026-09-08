import type { useTranslations } from "next-intl";

type T = ReturnType<typeof useTranslations>;

export const SITE = {
  name: "Aiva",
  // Keep tagline/description here for now — lib/seo.ts (constructMetadata,
  // organizationSchema, websiteSchema) still reads them. Phase 5 moves these
  // into per-locale messages. Do NOT remove them this phase.
  tagline: "AI sustavi koji se isporučuju.",
  description:
    "Pomažemo tvrtkama da uvedu AI u svakodnevno poslovanje kroz automatizaciju marketinga, sadržaja i prodajnih procesa.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aiva.hr",
  email: "leo@aiva.hr",
  instagram: "https://www.instagram.com/aiva.hr",
  facebook: "https://web.facebook.com/people/Aiva/61586583368219/",
} as const;

// Legal entity behind the Aiva brand. These are matters of public record
// (sudski registar), not copy, so they live here rather than in the message
// catalogs — the privacy policy renders them identically in HR and EN and
// they must never drift between the two.
export const COMPANY = {
  legalName: "MODELITY društvo s ograničenom odgovornošću za informatičke usluge",
  shortName: "Modelity d.o.o.",
  brand: "Aiva",
  brandDomain: "aiva.hr",
  street: "Trg dr. Žarka Dolinara 18",
  city: "Koprivnica",
  country: "HR",
  oib: "33666234446",
  // Data-protection enquiries are handled separately from general contact
  // (SITE.email), so a GDPR request never sits in a sales inbox.
  privacyEmail: "alen@aiva.hr",
} as const;

/** Croatian supervisory authority — where data subjects may lodge a complaint. */
export const AZOP = {
  address: "Selska cesta 136, 10000 Zagreb",
  email: "azop@azop.hr",
  web: "https://azop.hr",
  webLabel: "azop.hr",
} as const;

export function getNavLinks(t: T) {
  return [
    { label: t("nav.services"), href: "/usluge" as const },
    { label: t("nav.work"), href: "/radovi" as const },
    { label: t("nav.about"), href: "/o-nama" as const },
    { label: t("nav.contact"), href: "/kontakt" as const },
  ];
}

export function getFooterLinks(t: T) {
  return {
    company: [
      { label: t("nav.about"), href: "/o-nama" as const },
      { label: t("nav.work"), href: "/radovi" as const },
      { label: t("nav.services"), href: "/usluge" as const },
      { label: t("nav.contact"), href: "/kontakt" as const },
    ],
    legal: [
      { label: t("privacy.title"), href: "/privatnost" as const },
      {
        label: t("footer.terms"),
        href: { pathname: "/privatnost", hash: "terms" } as const,
      },
    ],
    social: [
      { label: "Instagram", href: SITE.instagram },
      { label: "Facebook", href: SITE.facebook },
    ],
  };
}
