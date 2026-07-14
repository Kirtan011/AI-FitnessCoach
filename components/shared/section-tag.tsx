import { cn } from "@/lib/utils";

interface SectionTagProps {
  label: string;
  /** Optional "[index/total]" counter shown on the right, e.g. 1 / 9 */
  index?: number;
  total?: number;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The bracketed header bar that opens each section
 * ( › WHAT WE DO ............................. [02/09] ).
 */
export function SectionTag({ label, index, total, className }: SectionTagProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border pb-3",
        className
      )}
    >
      <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">{"›"}</span> {label}
      </span>
      {index != null && total != null && (
        <span className="font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground">
          [{pad(index)}/{pad(total)}]
        </span>
      )}
    </div>
  );
}
