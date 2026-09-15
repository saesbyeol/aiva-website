"use client";

import { Mic, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useVoiceDemo } from "./voice-demo-provider";

/**
 * The pre-activation state of the demo: says what starting it will do, then
 * starts it. This is the consent moment for voice processing, so the notice
 * has to be readable before the click, not linked from after it.
 */
export function ActivateDemoCard({ className }: { className?: string }) {
  const t = useTranslations("voiceAgent.demo");
  const { activate } = useVoiceDemo();

  return (
    <div
      className={`border-border bg-bg-elevated mx-auto max-w-md rounded-2xl border p-6 text-center ${className ?? ""}`}
    >
      <Mic className="text-accent mx-auto mb-3 h-6 w-6" aria-hidden="true" />
      <p className="text-fg mb-2 text-base font-semibold">{t("activateTitle")}</p>
      <p className="text-fg-secondary text-small mb-5 leading-relaxed">
        {t("activateBody")}
      </p>
      <Button type="button" size="lg" variant="primary" onClick={activate}>
        <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 truncate">{t("activateCta")}</span>
      </Button>
      <Link
        href="/privatnost"
        className="text-fg-muted hover:text-accent mt-4 block text-xs underline"
      >
        {t("activatePrivacy")}
      </Link>
    </div>
  );
}
