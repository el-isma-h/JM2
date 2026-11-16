import * as React from "react";
import { cn } from "@/lib/utils";

/** Champs NEXT Capital : bordure 1 px, fond transparent, focus encre. */
const base =
  "w-full border border-line-strong bg-transparent px-3.5 font-sans text-ink outline-none transition-colors duration-300 placeholder:text-ink-3/80 focus:border-ink focus:ring-0 disabled:bg-bg-sunken disabled:text-ink-3 aria-[invalid=true]:border-danger";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(base, "h-10 text-sm", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(base, "min-h-24 py-2.5 text-sm leading-relaxed", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(base, "h-10 text-sm appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238e8b83%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9", className)} {...props}>
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({ className, children, hint, required, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { hint?: string; required?: boolean }) {
  return (
    <label className={cn("mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink-3", className)} {...props}>
      {children}
      {required ? <span className="ml-1 text-accent" aria-hidden>*</span> : null}
      {hint ? <span className="ml-2 normal-case tracking-normal text-ink-3/80">{hint}</span> : null}
    </label>
  );
}

export function Field({
  label,
  hint,
  help,
  error,
  required,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  help?: string;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label htmlFor={htmlFor} hint={hint} required={required}>
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12.5px] text-danger-ink" role="alert">
          {error}
        </p>
      ) : help ? (
        <p className="mt-1.5 text-[12px] text-ink-3">{help}</p>
      ) : null}
    </div>
  );
}

export function Checkbox({ className, label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: React.ReactNode }) {
  return (
    <label className={cn("inline-flex cursor-pointer items-start gap-2.5 text-sm", className)}>
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded-none border-line-strong accent-[var(--accent)]" {...props} />
      {label ? <span className="text-ink">{label}</span> : null}
    </label>
  );
}
