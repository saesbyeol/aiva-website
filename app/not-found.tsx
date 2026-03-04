import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { t } from "@/lib/i18n";

export default function NotFound() {
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
