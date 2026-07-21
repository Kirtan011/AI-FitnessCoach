"use client";

import { useEffect, useState } from "react";
import { WorkoutCalendar } from "@/components/workout-calendar";
import { WorkoutHistory } from "@/components/workout-history";
import { LoadingScreen } from "@/components/loading-screen";
import { useProgressStore } from "@/hooks/use-progress-store";

export default function HistoryPage() {
  const { workoutHistory, fetchWorkoutHistory } = useProgressStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (workoutHistory.length === 0) {
        await fetchWorkoutHistory();
      }
      setIsLoading(false);
    }
    loadHistory();
  }, [workoutHistory.length, fetchWorkoutHistory]);

  if (isLoading) {
    return <LoadingScreen message="Loading history..." subtitle="Dashboard" />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Workout History</h1>
        <p className="text-muted-foreground">View your past workouts and training calendar.</p>
      </div>
      
      <WorkoutCalendar workoutDates={workoutHistory.map((h) => h.date)} />
      <WorkoutHistory sessions={workoutHistory} />
    </div>
  );
}
