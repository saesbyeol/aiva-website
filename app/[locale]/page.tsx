import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Capabilities } from "@/components/sections/capabilities";
import { Work } from "@/components/sections/work";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <Services />
      <Capabilities />
      {/* <Work /> */}
      <FAQ />
      <CTA />
    </>
  );
}
