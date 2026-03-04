"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: inline-flex with overflow protection. Icons must use shrink-0, label must use min-w-0.
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
    "disabled:pointer-events-none disabled:opacity-50 select-none " +
    "overflow-hidden", // prevent icon bleed
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white hover:bg-accent-dark active:scale-[0.97] shadow-md hover:shadow-glow",
        secondary:
          "border border-border-strong bg-bg-elevated text-fg hover:bg-bg-secondary hover:border-accent/50 active:scale-[0.97]",
        ghost:
          "text-fg-secondary hover:text-fg hover:bg-bg-elevated active:scale-[0.97]",
        outline:
          "border border-border-strong text-fg hover:border-accent hover:text-accent active:scale-[0.97]",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.97]",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-11 px-5 text-sm rounded-lg",
        xl: "h-12 px-6 text-sm rounded-xl",  // reduced from h-14/px-9/text-base — prevents overflow
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
