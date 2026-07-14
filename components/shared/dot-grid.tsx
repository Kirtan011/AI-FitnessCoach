import { cn } from "@/lib/utils";

interface DotGridProps {
  className?: string;
  /** "dots" = radial dot field, "lines" = thin engineering grid */
  variant?: "dots" | "lines";
  /** Fade the pattern toward the edges with a radial mask */
  fade?: boolean;
}

/**
 * Decorative, non-interactive background layer (dotted field or line grid).
 * Drop inside a `relative` container as an absolutely-positioned backdrop.
 */
export function DotGrid({
  className,
  variant = "dots",
  fade = true,
}: DotGridProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        variant === "lines" ? "bg-line-grid" : "bg-dot-grid",
        fade && "mask-fade",
        className
      )}
    />
  );
}
