"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CircleNotch } from "@phosphor-icons/react";

/** Boutons NEXT Capital : bordure 1 px, capitales espacées, transition longue. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border font-sans font-medium uppercase tracking-[0.18em] transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary: "border-ink bg-ink text-bg hover:border-accent hover:bg-accent hover:text-accent-ink",
        secondary: "border-line-strong bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-bg",
        accent: "border-accent bg-accent text-accent-ink hover:border-ink hover:bg-ink hover:text-bg",
        ghost: "border-transparent text-ink-2 hover:border-line-strong hover:text-ink",
        danger: "border-danger bg-transparent text-danger-ink hover:bg-danger hover:text-bg",
        link: "border-transparent normal-case tracking-normal text-accent underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-[10px]",
        md: "h-10 px-4 text-[11px]",
        lg: "h-12 px-6 text-[11px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }
    return (
      <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} disabled={disabled || loading} {...props}>
        {loading ? <CircleNotch className="animate-spin" size={14} /> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
