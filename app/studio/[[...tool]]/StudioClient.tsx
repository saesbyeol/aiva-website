"use client";

import dynamic from "next/dynamic";
import config from "@/sanity.config";

// Load the studio only in the browser — it uses DOM APIs incompatible with SSR
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => ({ default: mod.NextStudio })),
  { ssr: false, loading: () => <div className="min-h-screen bg-black" /> }
);

export default function StudioClient() {
  return <NextStudio config={config} />;
}
