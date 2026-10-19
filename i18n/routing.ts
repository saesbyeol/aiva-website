import { defineRouting } from "next-intl/routing";

// Set NEXT_PUBLIC_SITE_LOCALE=en on a Vercel project to build the English-only
// site: Croatian routes disappear and English is served prefix-free at "/".
const englishOnly = process.env.NEXT_PUBLIC_SITE_LOCALE === "en";

export const routing = defineRouting({
  locales: englishOnly ? ["en"] : ["hr", "en"],
  defaultLocale: englishOnly ? "en" : "hr",
  localePrefix: "as-needed",
  // Croatian must always be served prefix-free at "/", regardless of the
  // visitor's Accept-Language header or any previously-set cookie. English
  // is reached only via an explicit "/en" URL or the LocaleToggle.
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/usluge": { hr: "/usluge", en: "/services" },
    "/radovi": { hr: "/radovi", en: "/work" },
    "/radovi/[slug]": { hr: "/radovi/[slug]", en: "/work/[slug]" },
    "/o-nama": { hr: "/o-nama", en: "/about" },
    "/ai-recepcija": { hr: "/ai-recepcija", en: "/ai-receptionist" },
    "/kontakt": { hr: "/kontakt", en: "/contact" },
    "/privatnost": { hr: "/privatnost", en: "/privacy" },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
