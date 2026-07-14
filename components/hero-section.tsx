"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZapIcon } from "@/components/icons";
import { DotGrid, Highlight, MonoLabel, Pill } from "@/components/shared";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [motivationQuote, setMotivationQuote] = useState<string>("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);

  const fetchMotivationQuote = async () => {
    setIsLoadingQuote(true);
    try {
      const response = await fetch("/api/generate-motivation");
      const data = await response.json();
      if (data.quotes && data.quotes.length > 0) {
        const randomQuote =
          data.quotes[Math.floor(Math.random() * data.quotes.length)];
        setMotivationQuote(randomQuote);
      }
    } catch (error) {
      console.error("Failed to fetch motivation:", error);
      setMotivationQuote(
        "Your transformation starts with a single step. Make it today."
      );
    } finally {
      setIsLoadingQuote(false);
    }
  };

  useEffect(() => {
    fetchMotivationQuote();
  }, []);

  return (
    <div className="relative overflow-hidden py-16 md:py-24 lg:py-28">
      <DotGrid className="opacity-70" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="flex justify-center">
          <Pill tag="Coach">Personalized to your profile →</Pill>
        </div>

        <h1 className="mx-auto mt-8 max-w-2xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
          Make the change <Highlight>from today.</Highlight>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Get your own personalized AI fitness routine — workouts and nutrition
          built around your goals, ready in seconds.
        </p>

        <div className="mt-10 flex items-center justify-center">
          <Button
            onClick={onGetStarted}
            size="xl"
            className="gap-3 shadow-lg shadow-primary/20"
          >
            <ZapIcon className="h-5 w-5" />
            Start your fitness journey
          </Button>
        </div>

        {/* Motivation line */}
        <div className="mx-auto mt-12 max-w-lg border-t border-border pt-6">
          <MonoLabel dot className="justify-center">
            Today&apos;s motivation
          </MonoLabel>
          <p className="mt-3 min-h-[1.5rem] text-pretty text-sm text-muted-foreground italic">
            {isLoadingQuote ? (
              <span className="inline-block h-4 w-2/3 animate-pulse rounded bg-muted align-middle" />
            ) : (
              `“${motivationQuote}”`
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
