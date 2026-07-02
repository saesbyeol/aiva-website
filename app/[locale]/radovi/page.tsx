import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import WorksGallery from "@/components/sections/works-gallery";
import { getCaseStudies, getVideoAds } from "@/sanity/lib/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return constructMetadata({
    title: t("meta.work.title"),
    description: t("meta.work.description"),
    path: "/radovi",
    locale,
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [caseStudies, videoAds] = await Promise.all([
    getCaseStudies(),
    getVideoAds(),
  ]);

  return <WorksGallery caseStudies={caseStudies} videoAds={videoAds} />;
}
