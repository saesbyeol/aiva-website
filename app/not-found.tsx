import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { routing } from "@/i18n/routing";

export default async function NotFound() {
  // This file lives outside app/[locale]/, so it renders for paths that
  // don't match any locale-prefixed route at all (e.g. a request-locale
  // mismatch or a completely unknown top-level path). There is no
  // NextIntlClientProvider ancestor here (that's only mounted by
  // app/[locale]/layout.tsx), so:
  //  - getTranslations() needs an explicit locale, since there's no
  //    request-scoped locale to read.
  //  - the locale-aware `Link` from "@/i18n/navigation" can't be used here
  //    either (it calls useLocale() under the hood, which throws "No intl
  //    context found" without a provider) — use plain next/link to "/"
  //    instead, which is exactly the prefix-free default-locale home.
  const t = await getTranslations({ locale: routing.defaultLocale });
  return (
    <section
      className="min-h-screen flex items-center justify-center bg-bg"
      aria-label={t("notFound.title")}
    >
      <div className="text-center px-6">
        <p className="text-label text-accent mb-4">{t("notFound.label")}</p>
        <h1 className="text-h1 text-fg mb-4">{t("notFound.title")}</h1>
        <p className="text-body-lg text-fg-secondary mb-10 max-w-md mx-auto">
          {t("notFound.description")}
        </p>
        <Button asChild variant="primary" size="lg">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">{t("notFound.cta")}</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
