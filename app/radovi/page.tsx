import type { Metadata } from "next";
import Image from "next/image";
import { Play } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { adShowcase } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export const metadata: Metadata = constructMetadata({
  title: "Naši radovi",
  description:
    "Primjeri AI generiranih reklama — video, vizuali i UGC sadržaj koji pretvaraju gledatelje u klijente.",
  path: "/radovi",
});

export default function WorkPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 bg-bg" aria-label="Work hero">
        <div className="container-default">
          <Reveal>
            <Badge variant="accent" className="mb-6">
              {t("workPage.badge")}
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-h1 text-fg mb-6 max-w-3xl">
              {t("workPage.title")}{" "}
              <span className="gradient-text">{t("workPage.titleAccent")}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-body-lg text-fg-secondary max-w-2xl leading-relaxed">
              {t("workPage.description")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Ad Showcase Grid */}
      <section className="pb-24 bg-bg" aria-label="Ad showcase">
        <div className="container-default">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adShowcase.map((item) => (
              <AdCard key={item.id} item={item} />
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

function AdCard({ item }: { item: (typeof adShowcase)[0] }) {
  const hasVideo = "video" in item && item.video;
  const hasImage = "image" in item && item.image;

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-bg-elevated hover:border-border-strong hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Media */}
      <div className="relative aspect-[9/16] overflow-hidden bg-bg">
        {hasVideo ? (
          <video
            src={item.video as string}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : hasImage ? (
          <Image
            src={item.image as string}
            alt={item.title}
            fill
            className="object-cover"
            unoptimized={(item.image as string).endsWith(".gif")}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <>
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-25",
                item.color
              )}
            />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className={cn(
                  "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center opacity-30",
                  item.color
                )}
              >
                <Play className="w-6 h-6 text-white ml-0.5" />
              </div>
              <span className="text-xs text-fg-muted opacity-60">
                {t("workPage.comingSoon")}
              </span>
            </div>
          </>
        )}

        {/* Category badge */}
        <Badge variant="accent" className="absolute top-3 left-3">
          {item.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-base font-bold text-fg mb-2 group-hover:text-accent transition-colors leading-snug">
          {item.title}
        </h2>
        <p className="text-sm text-fg-secondary leading-relaxed flex-1 mb-4">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
