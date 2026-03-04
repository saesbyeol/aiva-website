"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, ta } from "@/lib/i18n";

function AnimatedWord() {
  const words = ta<string[]>("hero.words");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="relative inline-block overflow-hidden pb-[0.5em] -mb-[0.5em]">
      <motion.span
        key={index}
        initial={{ y: "200%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-150%", opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="gradient-text inline-block pb-[0.25em]"
      >
        {words[index]}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-bg"
      aria-label="Hero"
    >
      {/* Animated background */}
      <HeroBackground />

      <motion.div
        className="container-wide relative z-10 pt-36 pb-28"
        style={{ y, opacity }}
      >
        <motion.div
          className="max-w-6xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="mb-8">
            <span className="inline-flex items-center gap-2 text-label text-fg-muted border border-border rounded-full px-4 py-1.5 bg-bg-elevated">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
              {t("hero.eyebrow")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-display text-fg leading-[1] mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            {t("hero.headlinePrefix")}
            <br />
            <AnimatedWord />
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={item}
            className="text-body-lg text-fg-secondary max-w-2xl mb-10 leading-relaxed"
          >
            {t("hero.description")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Button asChild size="lg" variant="primary" className="group">
              <Link href="/kontakt">
                <span className="min-w-0 truncate">{t("hero.cta1")}</span>
                <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/radovi">
                <span className="min-w-0 truncate">{t("hero.cta2")}</span>
              </Link>
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={item}
            className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="flex -space-x-2.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/40 to-accent-light/40 border-2 border-bg ring-0"
                  aria-hidden="true"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">
                {t("hero.trustedBy")}
              </p>
              <p className="text-xs text-fg-muted">
                {t("hero.sectors")}
              </p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-fg-muted ml-1">{t("hero.avgRating")}</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="text-xs text-fg-muted tracking-widest uppercase">
          {t("hero.scroll")}
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-fg-muted" />
      </motion.div>
    </section>
  );
}

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/[0.07] blur-[120px]" />
      <div className="absolute top-[30%] -right-[15%] w-[55%] h-[55%] rounded-full bg-accent-light/[0.06] blur-[100px]" />
      <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-500/[0.04] blur-[100px]" />

      {/* Dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating shapes */}
      <FloatingShape
        className="top-[15%] right-[12%] w-20 h-20"
        delay={0}
        shape="ring"
      />
      <FloatingShape
        className="bottom-[25%] left-[8%] w-14 h-14"
        delay={1.5}
        shape="dot"
      />
      <FloatingShape
        className="top-[45%] right-[25%] w-10 h-10"
        delay={0.8}
        shape="square"
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function FloatingShape({
  className,
  delay,
  shape,
}: {
  className: string;
  delay: number;
  shape: "ring" | "dot" | "square";
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -18, 0] }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {shape === "ring" && (
        <div className="w-full h-full rounded-full border border-accent/20 animate-spin-slow" />
      )}
      {shape === "dot" && (
        <div className="w-full h-full rounded-full bg-accent-light/15" />
      )}
      {shape === "square" && (
        <div className="w-full h-full rounded-lg border border-fg-muted/10 rotate-12" />
      )}
    </motion.div>
  );
}
