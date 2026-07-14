"use client";

import { useState, useEffect } from "react";
import { ProgressCharts } from "@/components/progress-charts";
import { LoadingScreen } from "@/components/loading-screen";

export default function ProgressPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Analyzing your progress..." subtitle="Analytics" />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground mt-2">Track your workouts, calories, and consistency over time.</p>
      </div>

      <ProgressCharts stats={stats} />
    </div>
  );
}
