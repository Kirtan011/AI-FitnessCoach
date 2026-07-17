"use client";

import { useState } from "react";
import { ImageOffIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  containerClassName?: string;
}

export function ImageWithFallback({ src, alt, className, fallbackText, containerClassName, ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={cn("relative flex items-center justify-center bg-secondary/20 overflow-hidden", containerClassName)}>
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-0">
          <Loader2Icon className="h-5 w-5 animate-spin opacity-50" />
        </div>
      )}
      {error || !src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-2 text-center bg-secondary/40 z-10">
          <ImageOffIcon className="h-5 w-5 mb-1 opacity-50" />
          {fallbackText && <span className="text-[10px] leading-tight opacity-70 truncate w-full" title={fallbackText}>{fallbackText}</span>}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(className, "transition-opacity duration-300 relative z-10", loading ? "opacity-0" : "opacity-100")}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          {...props}
        />
      )}
    </div>
  );
}
