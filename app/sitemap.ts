import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { caseStudies } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: SITE.url, priority: 1.0 },
    { url: `${SITE.url}/usluge`, priority: 0.9 },
    { url: `${SITE.url}/radovi`, priority: 0.9 },
    { url: `${SITE.url}/o-nama`, priority: 0.8 },
    { url: `${SITE.url}/kontakt`, priority: 0.8 },
  ].map((r) => ({
    url: r.url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const workRoutes = caseStudies.map((s) => ({
    url: `${SITE.url}/radovi/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes];
}
