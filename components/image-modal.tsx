"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XIcon, LoaderIcon, ImageIcon, SparklesIcon } from "@/components/icons";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: "exercise" | "meal";
}

export function ImageModal({
  isOpen,
  onClose,
  itemName,
  itemType,
}: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && itemName) {
      setIsLoading(true);

      const prompt =
        itemType === "exercise"
          ? `${itemName} exercise, fitness, gym, person working out, professional photography, high quality`
          : `${itemName}, delicious healthy food, professional food photography, high quality, appetizing`;

      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt
      )}?width=512&height=512&nologo=true`;
      setImageUrl(url);
    }
  }, [isOpen, itemName, itemType]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-3xl glass-card border-0 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                {itemType === "exercise" ? (
                  <ImageIcon className="h-5 w-5 text-primary" />
                ) : (
                  <SparklesIcon className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <span className="font-semibold text-lg">{itemName}</span>
                <p className="text-xs text-muted-foreground">
                  AI Generated Image
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Image container */}
          <div className="relative aspect-square bg-secondary/30">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                    <LoaderIcon className="h-8 w-8 text-primary-foreground animate-spin" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium">Generating Image</p>
                  <p className="text-sm text-muted-foreground">
                    This may take a few seconds...
                  </p>
                </div>
              </div>
            )}
            {imageUrl && (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={itemName}
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gradient-to-r from-secondary/30 to-transparent">
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <SparklesIcon className="h-4 w-4 text-primary" />
              Powered by AI Image Generation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
