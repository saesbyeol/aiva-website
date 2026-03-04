import type { Metadata } from "next";
import { SITE } from "./constants";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = SITE.description,
  path = "",
  image = "/og-image.svg",
  noIndex = false,
}: SeoProps = {}): Metadata {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const url = `${SITE.url}${path}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      type: "website",
      locale: "hr_HR",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: SITE.twitter,
      site: SITE.twitter,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon.png`,
  description: SITE.description,
  email: SITE.email,
  sameAs: [
    "https://twitter.com/aiva_agency",
    "https://linkedin.com/company/aiva-agency",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/work?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
