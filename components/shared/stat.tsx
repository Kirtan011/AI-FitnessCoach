import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  value: ReactNode;
  label: ReactNode;
  className?: string;
}

/** Big display number over a small mono caption — for stat strips. */
export function Stat({ value, label, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="font-display text-3xl font-bold tracking-tight md:text-4xl">
        {value}
      </span>
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
