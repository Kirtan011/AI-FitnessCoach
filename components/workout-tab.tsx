"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DumbbellIcon, VolumeIcon, FlameIcon, ClockIcon, SparklesIcon, PlayIcon } from "@/components/icons";
import type { FitnessPlan } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WorkoutTabProps {
  planId?: string | null;
  plan: FitnessPlan;
  isSpeaking: boolean;
  speakingSection: string | null;
  onSpeak: () => void;
  onStopSpeak: () => void;
  onSelectItem: (type: "exercise" | "meal", data: any) => void;
}

export function WorkoutTab({
  planId,
  plan,
  isSpeaking,
  speakingSection,
  onSpeak,
  onStopSpeak,
  onSelectItem,
}: WorkoutTabProps) {
  const router = useRouter();
  const [startingDay, setStartingDay] = useState<string | null>(null);

  const handleStartWorkout = async (day: any) => {
    if (!planId) {
      alert("No active plan found to start a workout from.");
      return;
    }
    setStartingDay(day.day);
    try {
      const response = await fetch("/api/workout-session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fitnessPlanId: planId,
          workoutName: `${day.day} - ${day.focus}`,
          workoutType: "HOME",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        router.push(`/workout/${data.sessionId}`);
      } else {
        alert("Failed to start workout. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error starting workout.");
    } finally {
      setStartingDay(null);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold">
          <DumbbellIcon className="h-5 w-5 text-primary" /> Workout Plan
        </h3>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            isSpeaking && speakingSection === "workout"
              ? onStopSpeak()
              : onSpeak()
          }
        >
          <VolumeIcon className="h-4 w-4 mr-1" />
          {isSpeaking && speakingSection === "workout" ? "Stop" : "Listen"}
        </Button>
      </div>

      {/* Warmup */}
      {plan.warmup && plan.warmup.length > 0 && (
        <div className="mb-6">
          <h4 className="font-display text-md font-bold mb-3 flex items-center gap-2">
            <FlameIcon className="h-4 w-4 text-orange-500" /> Warm-up Routine
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {plan.warmup.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => onSelectItem("exercise", ex)}
                className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-left text-xs transition hover:border-primary/40 hover:bg-secondary"
              >
                <span className="font-semibold">{ex.name}</span>
                <br />
                <span className="font-mono text-muted-foreground">
                  {ex.sets} sets · {ex.reps}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Workout Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plan.workoutPlan.map((day, i) => (
          <Card key={i} className="hover-lift gap-3">
            <CardHeader className="pb-0">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                {day.day}
              </p>
              <CardTitle className="font-display text-lg">
                {day.focus}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => handleStartWorkout(day)}
                disabled={startingDay === day.day}
              >
                {startingDay === day.day ? "Starting..." : "Start Workout"}
                <PlayIcon className="ml-2 h-4 w-4" />
              </Button>
              <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <ClockIcon className="h-3.5 w-3.5" /> {day.duration}
                <span className="text-border">|</span>
                <FlameIcon className="h-3.5 w-3.5 text-primary" />
                {day.caloriesBurned} kcal
              </p>

              <div className="space-y-2">
                {day.exercises.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectItem("exercise", ex)}
                    className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-left text-xs transition hover:border-primary/40 hover:bg-secondary"
                  >
                    <span className="font-semibold">{ex.name}</span>
                    <br />
                    <span className="font-mono text-muted-foreground">
                      {ex.sets} sets · {ex.reps} reps
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cooldown */}
      {plan.cooldown && plan.cooldown.length > 0 && (
        <div className="mt-6">
          <h4 className="font-display text-md font-bold mb-3 flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-blue-500" /> Cool-down Routine
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {plan.cooldown.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => onSelectItem("exercise", ex)}
                className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-left text-xs transition hover:border-primary/40 hover:bg-secondary"
              >
                <span className="font-semibold">{ex.name}</span>
                <br />
                <span className="font-mono text-muted-foreground">
                  {ex.sets} sets · {ex.reps}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
