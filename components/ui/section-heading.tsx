import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "text-center mx-auto max-w-3xl",
        className
      )}
    >
      {label && (
        <p className="text-label text-fg-muted" aria-label={label}>
          {label}
        </p>
      )}
      <h2 className={cn("text-h2 text-fg", titleClassName)}>{title}</h2>
      {description && (
        <p
          className={cn(
            "text-body-lg text-fg-secondary",
            align === "center" ? "mx-auto" : ""
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
