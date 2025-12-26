"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZapIcon } from "@/components/icons";

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
    <div className="relative overflow-hidden py-12 md:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-primary/15 to-transparent blur-3xl animate-float-delay-1" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-accent/5 via-transparent to-primary/5 blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0_0/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative">
        <h1 className="mx-auto max-w-5xl text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          Make the change
          <br />
          <span className="gradient-text animate-gradient">from today.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground text-pretty sm:text-lg md:text-xl leading-relaxed">
          Get your own personalized AI fitness routine to start today !
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="h-14 gap-3 hover:cursor-pointer  rounded-lg px-8 text-base font-semibold shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-[1.02]"
          >
            <ZapIcon className="h-5 w-5 " />
            Proceed Your Fitness Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
