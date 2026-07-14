"use client";

import { useState, useEffect } from "react";
import { WorkoutCalendar } from "@/components/workout-calendar";
import { WorkoutHistory } from "@/components/workout-history";
import { LoadingScreen } from "@/components/loading-screen";

export default function HistoryPage() {
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("/api/workout-history");
        if (response.ok) {
          const data = await response.json();
          setWorkoutHistory(data);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Loading history..." subtitle="Dashboard" />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">History & Analytics</h1>
        <p className="text-muted-foreground">Track your progress and view past workouts.</p>
      </div>
      <WorkoutCalendar workoutDates={workoutHistory.map((h) => h.date)} />
      <WorkoutHistory sessions={workoutHistory} />
    </div>
  );
}
