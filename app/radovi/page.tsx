import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import WorksGallery from "@/components/sections/works-gallery";

export const metadata: Metadata = constructMetadata({
  title: "Naši radovi",
  description:
    "Pogledajte naše projekte — od AI video oglasa do enterprise automatizacijskih sustava.",
  path: "/radovi",
});

export default function WorksPage() {
  return <WorksGallery />;
}
