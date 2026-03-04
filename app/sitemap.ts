import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { caseStudies } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: SITE.url, priority: 1.0 },
    { url: `${SITE.url}/services`, priority: 0.9 },
    { url: `${SITE.url}/work`, priority: 0.9 },
    { url: `${SITE.url}/about`, priority: 0.8 },
    { url: `${SITE.url}/contact`, priority: 0.8 },
  ].map((r) => ({
    url: r.url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const workRoutes = caseStudies.map((s) => ({
    url: `${SITE.url}/work/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes];
}
