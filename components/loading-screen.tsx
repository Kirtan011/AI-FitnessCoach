"use client";

import { useEffect, useState } from "react";

const fitnessFacts = [
  "Did you know? Walking 10,000 steps a day can burn up to 500 calories.",
  "Muscle tissue burns more calories at rest than fat tissue.",
  "Stretching after exercise can improve flexibility and reduce injury risk.",
  "Drinking water before meals can help with weight management.",
  "High-intensity interval training (HIIT) can burn more calories in less time.",
];

export function LoadingScreen() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(factInterval);
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-secondary border-t-primary mb-6"></div>
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold mb-4">Creating Your Plan</h3>
        <p className="text-muted-foreground text-sm leading-relaxed transition-all duration-500">
          {fitnessFacts[factIndex]}
        </p>
      </div>
    </div>
  );
}
