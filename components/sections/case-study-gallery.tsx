"use client";

import React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import type { SanityGalleryImage } from "@/sanity/lib/queries";

interface Props {
  images: SanityGalleryImage[];
}

export function CaseStudyGallery({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const open = React.useCallback((i: number) => setLightboxIndex(i), []);
  const close = React.useCallback(() => setLightboxIndex(null), []);

  const prev = React.useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  const next = React.useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
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

  if (!images?.length) return null;

  const isSingle = images.length === 1;

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
                : images.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {images.map((img, i) => (
              <Reveal key={img.url} delay={i * 0.05}>
                <button
                  onClick={() => open(i)}
                  className={cn(
                    "group relative w-full overflow-hidden rounded-xl border border-border",
                    "bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isSingle ? "aspect-[16/7]" : "aspect-[4/3]"
                  )}
                  aria-label={img.caption ?? `Slika ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.caption ?? `Slika projekta ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs text-white/80">{img.caption}</p>
                    </div>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label="Zatvori"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Prethodna slika"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-h-[85vh] max-w-[85vw] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={lightboxIndex}
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption ?? `Slika ${lightboxIndex + 1}`}
              fill
              sizes="85vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Caption + counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            {images[lightboxIndex].caption && (
              <p className="text-sm text-white/70">{images[lightboxIndex].caption}</p>
            )}
            {images.length > 1 && (
              <p className="font-mono text-xs text-white/30">
                {lightboxIndex + 1} / {images.length}
              </p>
            )}
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Sljedeća slika"
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
