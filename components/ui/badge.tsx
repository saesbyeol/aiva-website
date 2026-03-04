import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-bg-elevated border border-border text-fg-secondary text-xs px-3 py-1 rounded-full",
        accent:
          "bg-accent/10 border border-accent/20 text-accent-light text-xs px-3 py-1 rounded-full",
        outline:
          "border border-border-strong text-fg-secondary text-xs px-3 py-1 rounded-full",
        label:
          "text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-fg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
