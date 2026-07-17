"use client";

import { useState, useEffect } from "react";
import { ProgressCharts } from "@/components/progress-charts";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { LoadingScreen } from "@/components/loading-screen";

export default function ProgressPage() {
  const [stats, setStats] = useState<any>(null);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, historyRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/workout-history")
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setWorkoutHistory(historyData);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

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
