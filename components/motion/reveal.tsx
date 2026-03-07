"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const animationName: Record<string, string> = {
  up: "reveal-up",
  down: "reveal-down",
  left: "reveal-left",
  right: "reveal-right",
  none: "reveal-fade",
};

function useInViewOnce(amount = 0.15) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip animation on touch devices or reduced-motion — CSS already shows content
    if (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: amount }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount]);

  return { ref, visible };
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
  amount?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  amount = 0.15,
}: RevealProps) {
  const { ref, visible } = useInViewOnce(amount);

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={
        visible
          ? {
              animationName: animationName[direction],
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animationFillMode: "both",
              animationTimingFunction: EASE,
            }
          : { opacity: 0 }
      }
    >
      {children}
    </div>
  );
}

// ─── Stagger container ────────────────────────────────────────────────────────
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  amount?: number;
}

export function Stagger({
  children,
  className,
  staggerDelay = 0.1,
  amount = 0.1,
}: StaggerProps) {
  const { ref, visible } = useInViewOnce(amount);

  return (
    <div ref={ref} className={cn(className)}>
      {React.Children.map(children, (child, i) => (
        <div
          data-reveal
          style={
            visible
              ? {
                  animationName: "reveal-up",
                  animationDuration: "0.6s",
                  animationDelay: `${i * staggerDelay}s`,
                  animationFillMode: "both",
                  animationTimingFunction: EASE,
                }
              : { opacity: 0 }
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
}
