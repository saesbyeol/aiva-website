import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Capabilities } from "@/components/sections/capabilities";
import { Process } from "@/components/sections/process";
import { Work } from "@/components/sections/work";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Capabilities />
      <Process />
      <Work />
      <FAQ />
      <CTA />
    </>
  );
}
