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

/** FitFlow brand lockup */
export function Logo({ className, iconOnly = false, href, size = "md" }: LogoProps) {
  const isSmall = size === "sm";
  
  // Use logo2 when iconOnly is true, full logo otherwise
  const lightLogoSrc = iconOnly ? "/logo2_light.png" : "/logo_light.png";
  const darkLogoSrc = iconOnly ? "/logo2_dark.png" : "/logo_dark.png";
  
  // The logo images already contain the name, so we don't render separate text.
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img 
        src={lightLogoSrc} 
        alt="FitFlow Logo" 
        className={cn("object-contain dark:hidden w-auto", isSmall ? "max-h-8" : "max-h-10")} 
      />
      <img 
        src={darkLogoSrc} 
        alt="FitFlow Logo" 
        className={cn("object-contain hidden dark:block w-auto", isSmall ? "max-h-8" : "max-h-10")} 
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label="FitFlow home">
        {content}
      </Link>
    );
  }
  return content;
}
