"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  title,
  description,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title: string; description?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-encre/60" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 border border-line-strong bg-bg p-7 shadow-[var(--shadow-2)] focus:outline-none",
          className,
        )}
        {...props}
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <DialogPrimitive.Title className="font-display text-[18px] font-light uppercase tracking-[0.06em] text-ink">{title}</DialogPrimitive.Title>
            {description ? <DialogPrimitive.Description className="mt-2 text-[13.5px] text-ink-2">{description}</DialogPrimitive.Description> : null}
          </div>
          <DialogPrimitive.Close className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 transition-colors hover:text-ink" aria-label="Fermer">
            [ Fermer ]
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
