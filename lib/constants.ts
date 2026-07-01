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
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aiva.agency",
  email: "automation.aiva@gmail.com",
  instagram: "https://www.instagram.com/aiva.hr",
  facebook: "https://web.facebook.com/people/Aiva/61586583368219/",
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
      { label: t("footer.terms"), href: "/privatnost#terms" as const },
    ],
    social: [
      { label: "Instagram", href: SITE.instagram },
      { label: "Facebook", href: SITE.facebook },
    ],
  };
}
