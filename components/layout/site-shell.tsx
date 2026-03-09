"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { LenisProvider } from "@/components/motion/lenis-provider";
import { ProgressBar } from "@/components/motion/progress-bar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");

  if (isStudio) {
    // Render studio pages bare — no nav, footer, scroll library, or progress bar
    return <>{children}</>;
  }

  return (
    <LenisProvider>
      <ProgressBar />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </LenisProvider>
  );
}
