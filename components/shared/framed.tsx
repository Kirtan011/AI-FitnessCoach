import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FramedProps {
  children?: ReactNode;
  className?: string;
  /** "default" = white card with border, "blue" = solid brand panel */
  tone?: "default" | "blue" | "muted";
  /** Show the small square markers on the four corners */
  markers?: boolean;
}

function CornerMarkers({ tone }: { tone: FramedProps["tone"] }) {
  const color = tone === "blue" ? "bg-primary-foreground" : "bg-primary";
  const base = cn("absolute z-10 size-1.5", color);
  return (
    <span aria-hidden>
      <span className={cn(base, "-left-[3px] -top-[3px]")} />
      <span className={cn(base, "-right-[3px] -top-[3px]")} />
      <span className={cn(base, "-bottom-[3px] -left-[3px]")} />
      <span className={cn(base, "-bottom-[3px] -right-[3px]")} />
    </span>
  );
}

/**
 * A bordered "blueprint" container with corner registration marks — the
 * framed-visual motif used throughout the design. Use tone="blue" for the
 * solid royal-blue feature panels.
 */
export function Framed({
  children,
  className,
  tone = "default",
  markers = true,
}: FramedProps) {
  return (
    <div
      className={cn(
        "relative border",
        tone === "blue" && "border-primary bg-primary text-primary-foreground",
        tone === "muted" && "border-border bg-secondary",
        tone === "default" && "border-border bg-card",
        className
      )}
    >
      {markers && <CornerMarkers tone={tone} />}
      {children}
    </div>
  );
}
