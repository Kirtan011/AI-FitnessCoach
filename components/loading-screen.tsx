"use client";

import { useEffect, useState } from "react";
import { DumbbellIcon, SparklesIcon, SaladIcon } from "@/components/icons";

const loadingMessages = [
  "Analyzing your fitness profile...",
  "Crafting personalized workouts...",
  "Balancing your nutrition plan...",
  "Adding motivational insights...",
  "Finalizing your AI-powered plan...",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 space-y-8">
      {/* Simple bouncing bars loader */}
      <div className="flex items-end justify-center space-x-3">
        <div
          className="h-12 w-3 bg-gradient-to-t from-primary to-primary/80 rounded-full animate-bounce shadow-lg"
          style={{ animationDelay: "0s", animationDuration: "1.2s" }}
        />
        <div
          className="h-16 w-3 bg-gradient-to-t from-accent to-accent/80 rounded-full animate-bounce shadow-lg"
          style={{ animationDelay: "0.2s", animationDuration: "1.2s" }}
        />
        <div
          className="h-10 w-3 bg-gradient-to-t from-primary to-primary/80 rounded-full animate-bounce shadow-lg"
          style={{ animationDelay: "0.4s", animationDuration: "1.2s" }}
        />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Creating Your Plan
        </h3>
        <p className="text-lg text-muted-foreground h-8 transition-all duration-500">
          {loadingMessages[messageIndex]}
        </p>
      </div>

      <div className="w-80">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-primary">
            {Math.min(Math.round(progress), 95)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
      </div>

      <div className="max-w-md text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">💡 Tip:</span> Small
          consistent steps lead to big results. Stay committed to your journey.
        </p>
      </div>
    </div>
  );
}
