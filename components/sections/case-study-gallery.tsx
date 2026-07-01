"use client";

import React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { useTranslations } from "next-intl";
import type { SanityGalleryItem } from "@/sanity/lib/queries";

interface Props {
  images: SanityGalleryItem[];
}

export function CaseStudyGallery({ images }: Props) {
  const t = useTranslations();
  // Only render items that actually resolved to a media URL.
  const items = React.useMemo(
    () => images.filter((m): m is SanityGalleryItem & { url: string } => !!m.url),
    [images]
  );

  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const open = React.useCallback((i: number) => setLightboxIndex(i), []);
  const close = React.useCallback(() => setLightboxIndex(null), []);

  const prev = React.useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length]
  );

  const next = React.useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  // Keyboard navigation
  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, close, prev, next]);

  if (!items.length) return null;

  const isSingle = items.length === 1;
  const active = lightboxIndex === null ? null : items[lightboxIndex];

  return (
    <>
      <section className="pb-16" aria-label="Galerija projekta">
        <div className="container-default">
          <Reveal>
            <p className="text-label text-accent mb-6">GALERIJA</p>
          </Reveal>
          <div
            className={cn(
              "grid gap-3",
              isSingle
                ? "grid-cols-1"
                : items.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {items.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <button
                  onClick={() => open(i)}
                  className={cn(
                    "group relative w-full overflow-hidden rounded-xl border border-border",
                    "bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isSingle ? "aspect-[16/7]" : "aspect-[4/3]"
                  )}
                  aria-label={item.caption ?? (item.kind === "video" ? `Video ${i + 1}` : `Slika ${i + 1}`)}
                >
                  {item.kind === "video" ? (
                    <video
                      src={item.url}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.caption ?? `Slika projekta ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {/* play badge for videos */}
                  {item.kind === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-14 h-14 rounded-full bg-black/50 border border-white/30 flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-6 h-6 text-white translate-x-0.5" />
                      </span>
                    </div>
                  )}
                  {item.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs text-white/80">{item.caption}</p>
                    </div>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label={t("work.galleryClose")}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label={t("work.galleryPrev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Media */}
          <div
            className="relative max-h-[85vh] max-w-[85vw] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {active.kind === "video" ? (
              <video
                key={lightboxIndex}
                src={active.url}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] max-w-[85vw] rounded-xl shadow-2xl"
              />
            ) : (
              <Image
                key={lightboxIndex}
                src={active.url}
                alt={active.caption ?? `Slika ${(lightboxIndex ?? 0) + 1}`}
                fill
                sizes="85vw"
                className="object-contain"
                priority
              />
            )}
          </div>

          {/* Caption + counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            {active.caption && (
              <p className="text-sm text-white/70">{active.caption}</p>
            )}
            {items.length > 1 && (
              <p className="font-mono text-xs text-white/30">
                {(lightboxIndex ?? 0) + 1} / {items.length}
              </p>
            )}
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label={t("work.galleryNext")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
