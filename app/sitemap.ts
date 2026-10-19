import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { caseStudies } from "@/lib/content";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Default-locale URLs only: Croatian paths on aiva.hr, English on the EN-only build.
const path = (href: Parameters<typeof getPathname>[0]["href"]) =>
  getPathname({ locale: routing.defaultLocale, href });

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: SITE.url, priority: 1.0 },
    { url: `${SITE.url}${path("/usluge")}`, priority: 0.9 },
    { url: `${SITE.url}${path("/radovi")}`, priority: 0.9 },
    { url: `${SITE.url}${path("/ai-recepcija")}`, priority: 0.9 },
    { url: `${SITE.url}${path("/o-nama")}`, priority: 0.8 },
    { url: `${SITE.url}${path("/kontakt")}`, priority: 0.8 },
  ].map((r) => ({
    url: r.url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const workRoutes = caseStudies.map((s) => ({
    url: `${SITE.url}${path({ pathname: "/radovi/[slug]", params: { slug: s.slug } })}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes];
}
