"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

/**
 * "Powered by Modelity" — the Aiva brand's attribution to the legal entity
 * behind it (see COMPANY in lib/constants). Rendered under the wordmark in the
 * header and footer, and again in the footer's bottom bar.
 *
 * The brand name always picks up the accent colour; everything else about the
 * type — size, tracking, muted vs secondary tone — comes from the caller via
 * `className`, so the same string can read as body copy in one place and as an
 * uppercase label in another. No colour is set here, to keep `className` from
 * having to fight a default.
 */
export function PoweredBy({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <p className={className}>
      {t.rich("site.poweredBy", {
        brand: (chunks: ReactNode) => <span className="text-accent">{chunks}</span>,
      })}
    </p>
  );
}
