import * as React from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/motion/reveal";
import { getContent } from "@/lib/content-i18n";

export async function Clients() {
  const t = await getTranslations();
  const locale = await getLocale();
  const { clients } = getContent(locale);
  return (
    <section className="py-16 border-y border-border overflow-hidden" aria-label="Clients">
      <div className="container-default mb-10">
        <Reveal>
          <p className="text-label text-center">
            {t("clients.label")}
          </p>
        </Reveal>
      </div>

      <Marquee>
        {clients.map((client) => (
          <ClientLogo key={client.name} name={client.name} />
        ))}
      </Marquee>
    </section>
  );
}

function ClientLogo({ name }: { name: string }) {
  // Generate a consistent gradient based on name for placeholder
  const colors = [
    ["#6366f1", "#818cf8"],
    ["#06b6d4", "#38bdf8"],
    ["#10b981", "#34d399"],
    ["#f59e0b", "#fbbf24"],
    ["#ef4444", "#f87171"],
    ["#8b5cf6", "#a78bfa"],
  ];
  const idx =
    name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  const [from, to] = colors[idx];

  return (
    <div className="flex items-center justify-center h-12 px-2">
      <div
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-bg-elevated opacity-60 hover:opacity-100 transition-opacity"
        title={name}
      >
        <div
          className="w-5 h-5 rounded-full flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-fg-secondary whitespace-nowrap">
          {name}
        </span>
      </div>
    </div>
  );
}
