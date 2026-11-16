import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="data-table text-[13.5px]">{children}</table>
    </div>
  );
}

export function Th({ className, children, num }: { className?: string; children?: React.ReactNode; num?: boolean }) {
  return <th className={cn(num && "num", className)}>{children}</th>;
}

export function Td({ className, children, num, ...props }: React.TdHTMLAttributes<HTMLTableCellElement> & { num?: boolean }) {
  return (
    <td className={cn(num && "num", className)} {...props}>
      {children}
    </td>
  );
}
