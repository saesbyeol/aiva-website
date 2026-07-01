"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

export function LocaleToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  function switchTo(next: string) {
    if (next === locale) return;
    // Preserve dynamic params (e.g. [slug]) when switching locale.
    router.replace(
      // @ts-expect-error -- pathname is a typed route; params supplies [slug] when present
      { pathname, params },
      { locale: next }
    );
  }

  return (
    <div className={cn("flex items-center gap-1 text-sm font-medium", className)}>
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="text-fg-muted mx-1">|</span>}
          <button
            onClick={() => switchTo(loc)}
            aria-current={loc === locale ? "true" : undefined}
            className={cn(
              "uppercase transition-colors",
              loc === locale
                ? "text-fg"
                : "text-fg-secondary hover:text-fg"
            )}
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  );
}
