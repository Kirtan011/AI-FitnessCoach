import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MonoLabelProps {
  children: ReactNode;
  className?: string;
  /** Render a small square brand marker before the text */
  dot?: boolean;
  as?: ElementType;
}

/**
 * Small uppercase monospace "technical" label — the recurring caption style
 * (e.g. RECALL LATENCY, PRODUCT CATALOG). Brand-wide typographic primitive.
 */
export function MonoLabel({
  children,
  className,
  dot = false,
  as,
}: MonoLabelProps) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground",
        className
      )}
    >
      {dot && (
        <span className="size-1.5 rounded-[1px] bg-primary" aria-hidden />
      )}
      {children}
    </Tag>
  );
}
