import Link from "next/link";
import { DumbbellIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Hide the wordmark and render the mark only */
  iconOnly?: boolean;
  /** Wrap in a link to this href */
  href?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { box: "size-6", icon: "size-3.5", text: "text-base" },
  md: { box: "size-7", icon: "size-4", text: "text-lg" },
  lg: { box: "size-9", icon: "size-5", text: "text-2xl" },
} as const;

/** FitChamp brand lockup: blue square mark + wordmark. */
export function Logo({ className, iconOnly = false, href, size = "md" }: LogoProps) {
  const s = sizes[size];
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid place-items-center rounded-md bg-primary text-primary-foreground shadow-sm",
          s.box
        )}
      >
        <DumbbellIcon className={s.icon} />
      </span>
      {!iconOnly && (
        <span
          className={cn(
            "font-display font-bold tracking-tight text-foreground",
            s.text
          )}
        >
          FitChamp
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label="FitChamp home">
        {content}
      </Link>
    );
  }
  return content;
}
