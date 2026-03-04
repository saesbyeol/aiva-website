"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  speed?: "slow" | "normal" | "fast";
  children: React.ReactNode;
  pauseOnHover?: boolean;
}

export function Marquee({
  className,
  children,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn("overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex w-max gap-12 marquee-track",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {/* Duplicate for seamless loop */}
        {children}
        {children}
      </div>
    </div>
  );
}
