"use client";

import { useEffect, useState } from "react";
import { ProgressCharts } from "@/components/progress-charts";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { LoadingScreen } from "@/components/loading-screen";
import { useProgressStore } from "@/hooks/use-progress-store";

export default function ProgressPage() {
  const { stats, workoutHistory, fetchStats, fetchWorkoutHistory } = useProgressStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Fetch if not already loaded in store
      const promises = [];
      if (!stats) promises.push(fetchStats());
      if (workoutHistory.length === 0) promises.push(fetchWorkoutHistory());
      
      if (promises.length > 0) {
        await Promise.all(promises);
      }
      setIsLoading(false);
    }
    loadData();
  }, [stats, workoutHistory.length, fetchStats, fetchWorkoutHistory]);

  if (isLoading) {
    return <LoadingScreen message="Analyzing your progress..." subtitle="Analytics" />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Progress Analytics</h1>
        <p className="text-muted-foreground mt-2">Track your workouts, calories, and consistency over time.</p>
      </div>

      <AnalyticsDashboard sessions={workoutHistory} />
      <ProgressCharts stats={stats} />
    </div>
  );
}
