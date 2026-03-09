import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import WorksGallery from "@/components/sections/works-gallery";
import { getCaseStudies, getVideoAds } from "@/sanity/lib/queries";

export const metadata: Metadata = constructMetadata({
  title: "Naši radovi",
  description:
    "Pogledajte naše projekte — od AI video oglasa do enterprise automatizacijskih sustava.",
  path: "/radovi",
});

export default async function WorksPage() {
  const [caseStudies, videoAds] = await Promise.all([
    getCaseStudies(),
    getVideoAds(),
  ]);

  return <WorksGallery caseStudies={caseStudies} videoAds={videoAds} />;
}
