"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/** Interrupteur carré (angles droits), signal violet à l'état actif. */
export const Switch = React.forwardRef<React.ComponentRef<typeof SwitchPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center border border-line-strong bg-bg-sunken p-[2px] transition-colors duration-300 data-[state=checked]:border-accent data-[state=checked]:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block h-3.5 w-3.5 bg-ink transition-transform duration-300 data-[state=checked]:translate-x-4 data-[state=checked]:bg-accent-ink" />
    </SwitchPrimitive.Root>
  ),
);
Switch.displayName = "Switch";
