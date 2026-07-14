import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GradientType = "text" | "linear" | "radial";

type Direction =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const DIRECTION_MAP: Record<Direction, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
  "top-left": "to top left",
  "top-right": "to top right",
  "bottom-left": "to bottom left",
  "bottom-right": "to bottom right",
};

interface GradientProps extends HTMLAttributes<HTMLElement> {
  type?: GradientType;
  from?: string;
  via?: string;
  to?: string;
  /** Linear direction: top | bottom | left | right | top-left | ... */
  direction?: Direction;
  /** Radial shape/position, e.g. "circle at center" or "circle at 30% 0%" */
  position?: string;
  /** Override the rendered tag (defaults: span for text, div otherwise) */
  as?: ElementType;
  children?: ReactNode;
}

// Reusable gradient for text, linear, and radial backgrounds. Defaults to the
// brand crimson→gold. Colors accept any CSS color, including theme vars.
export function Gradient({
  type = "linear",
  from = "var(--primary)",
  via,
  to = "var(--accent)",
  direction = "bottom-right",
  position = "circle at center",
  as,
  className,
  style,
  children,
  ...rest
}: GradientProps) {
  const stops = [from, via, to].filter(Boolean).join(", ");
  const image =
    type === "radial"
      ? `radial-gradient(${position}, ${stops})`
      : `linear-gradient(${DIRECTION_MAP[direction]}, ${stops})`;

  const Tag = (as ?? (type === "text" ? "span" : "div")) as ElementType;

  const gradientStyle: CSSProperties =
    type === "text"
      ? {
          backgroundImage: image,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          ...style,
        }
      : { backgroundImage: image, ...style };

  return (
    <Tag
      className={cn(type === "text" && "inline-block", className)}
      style={gradientStyle}
      {...rest}
    >
      {children}
    </Tag>
  );
}
