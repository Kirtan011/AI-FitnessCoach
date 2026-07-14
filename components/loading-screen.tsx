"use client";

import { useEffect, useState } from "react";

const fitnessFacts = [
  "Did you know? Walking 10,000 steps a day can burn up to 500 calories.",
  "Muscle tissue burns more calories at rest than fat tissue.",
  "Stretching after exercise can improve flexibility and reduce injury risk.",
  "Drinking water before meals can help with weight management.",
  "High-intensity interval training (HIIT) can burn more calories in less time.",
];

export function LoadingScreen({
  message = "Creating your plan",
  subtitle = "Generating",
}: {
  message?: string;
  subtitle?: string;
}) {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % fitnessFacts.length);
    }, 3000);

    return () => clearInterval(factInterval);
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="mb-8 h-14 w-14 animate-spin rounded-full border-2 border-border border-t-primary" />
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-primary">
        {subtitle}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold">
        {message}
      </h3>
      <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground transition-all duration-500">
        {fitnessFacts[factIndex]}
      </p>
    </div>
  );
}
