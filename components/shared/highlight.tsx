import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Inline brand-blue emphasis for a word or phrase inside a heading. */
export function Highlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("text-primary", className)}>{children}</span>;
}
