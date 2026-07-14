import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PillProps {
  children: ReactNode;
  /** Optional small leading tag (e.g. "New") rendered as a blue chip */
  tag?: ReactNode;
  className?: string;
}

/** Bordered announcement pill — the "New · …" badge shown above the hero. */
export function Pill({ children, tag, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-xs text-muted-foreground shadow-sm",
        className
      )}
    >
      {tag && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-primary">
          {tag}
        </span>
      )}
      {children}
    </span>
  );
}
