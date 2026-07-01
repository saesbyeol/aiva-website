import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hr", "en"],
  defaultLocale: "hr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/usluge": { hr: "/usluge", en: "/services" },
    "/radovi": { hr: "/radovi", en: "/work" },
    "/radovi/[slug]": { hr: "/radovi/[slug]", en: "/work/[slug]" },
    "/o-nama": { hr: "/o-nama", en: "/about" },
    "/kontakt": { hr: "/kontakt", en: "/contact" },
    "/privatnost": { hr: "/privatnost", en: "/privacy" },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
