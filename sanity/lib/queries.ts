import { groq } from "next-sanity";
import { getSanityClient, isSanityConfigured } from "./client";
import { caseStudies as fallbackCaseStudies, adShowcase as fallbackAdShowcase } from "@/lib/content";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SanityGalleryImage = {
  url: string;
  caption: string | null;
};

export type SanityCaseStudy = {
  _id: string;
  title: string;
  client: string;
  slug: string;
  category: string;
  year: string;
  tags: string[];
  description: string;
  problem: string;
  approach: string;
  results: string[];
  coverImageUrl: string | null;
  gallery: SanityGalleryImage[];
  featured: boolean;
  order: number;
};

export type SanityVideoAd = {
  _id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  videoUrl: string | null;
  order: number;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

const caseStudiesQuery = groq`*[_type == "caseStudy"] | order(order asc) {
  _id,
  title,
  client,
  "slug": slug.current,
  category,
  year,
  tags,
  description,
  problem,
  approach,
  results,
  "coverImageUrl": coverImage.asset->url,
  "gallery": gallery[]{
    "url": asset->url,
    caption
  },
  featured,
  order
}`;

const videoAdsQuery = groq`*[_type == "videoAd"] | order(order asc) {
  _id,
  title,
  category,
  description,
  tags,
  "videoUrl": video.asset->url,
  order
}`;

const caseStudyBySlugQuery = groq`*[_type == "caseStudy" && slug.current == $slug][0] {
  _id,
  title,
  client,
  "slug": slug.current,
  category,
  year,
  tags,
  description,
  problem,
  approach,
  results,
  "coverImageUrl": coverImage.asset->url,
  "gallery": gallery[]{
    "url": asset->url,
    caption
  },
  featured,
  order
}`;

// ─── Fetch helpers (with content.ts fallback when Sanity not configured) ───────

export async function getCaseStudies(): Promise<SanityCaseStudy[]> {
  if (!isSanityConfigured()) {
    return fallbackCaseStudies.map((s, i) => ({
      _id: s.id,
      title: s.title,
      client: s.client,
      slug: s.slug,
      category: s.category,
      year: s.year,
      tags: s.tags,
      description: s.description,
      problem: s.problem,
      approach: s.approach,
      results: s.results,
      coverImageUrl: s.coverImage ?? null,
      gallery: [],
      featured: s.featured,
      order: i,
    }));
  }
  return getSanityClient()!.fetch<SanityCaseStudy[]>(
    caseStudiesQuery,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getVideoAds(): Promise<SanityVideoAd[]> {
  if (!isSanityConfigured()) {
    return fallbackAdShowcase.map((a, i) => ({
      _id: a.id,
      title: a.title,
      category: a.category,
      description: a.description,
      tags: a.tags,
      videoUrl: a.video ?? null,
      order: i,
    }));
  }
  return getSanityClient()!.fetch<SanityVideoAd[]>(
    videoAdsQuery,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getCaseStudyBySlug(slug: string): Promise<SanityCaseStudy | null> {
  if (!isSanityConfigured()) {
    const s = fallbackCaseStudies.find((cs) => cs.slug === slug);
    if (!s) return null;
    return {
      _id: s.id,
      title: s.title,
      client: s.client,
      slug: s.slug,
      category: s.category,
      year: s.year,
      tags: s.tags,
      description: s.description,
      problem: s.problem,
      approach: s.approach,
      results: s.results,
      coverImageUrl: s.coverImage ?? null,
      gallery: [],
      featured: s.featured,
      order: 0,
    };
  }
  return getSanityClient()!.fetch<SanityCaseStudy>(
    caseStudyBySlugQuery,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getCaseStudySlugs(): Promise<string[]> {
  if (!isSanityConfigured()) {
    return fallbackCaseStudies.map((s) => s.slug);
  }
  const studies = await getSanityClient()!.fetch<SanityCaseStudy[]>(
    caseStudiesQuery,
    {},
    { next: { revalidate: 60 } }
  );
  return studies.map((s) => s.slug);
}
