"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DumbbellIcon, VolumeIcon, FlameIcon, ClockIcon, ZapIcon, PlayIcon } from "@/components/icons";
import type { FitnessPlan } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Framed, SectionTag, ImageWithFallback } from "@/components/shared";

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
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = plan.workoutPlan?.[selectedDayIndex];

  if (!plan.workoutPlan || plan.workoutPlan.length === 0 || !selectedDay) {
    return (
      <div className="p-6 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-border">
        No workout plan data was generated. Please try regenerating your plan.
      </div>
    );
  }
  const handleStartWorkout = async (day: any) => {
    setStartingDay(day.day);
    try {
      const response = await fetch("/api/workout-session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(planId ? { fitnessPlanId: planId } : {}),
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
        <SectionTag>
          <DumbbellIcon className="h-4 w-4 mr-2 inline" /> Workout Plan
        </SectionTag>

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

      {/* Day Selector */}
      <div className="mb-8">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-2 p-1">
            {plan.workoutPlan.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-6 py-3 rounded-md text-sm font-bold transition-all border ${
                  selectedDayIndex === idx 
                    ? "bg-primary border-primary text-primary-foreground shadow-sm scale-[1.02]" 
                    : "bg-transparent border-border text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-muted-foreground/30"
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Selected Workout Day */}
      <div className="animate-in fade-in zoom-in duration-300">
        <Framed>
          <Card className="hover-lift gap-3 shadow-xl bg-card border-none">
          <CardHeader className="pb-0 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-1">
              {selectedDay.day}
            </p>
            <CardTitle className="font-display text-2xl">
              {selectedDay.focus}
            </CardTitle>
            <div className="flex justify-center items-center gap-4 font-mono text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><ClockIcon className="h-4 w-4 text-blue-500" /> {selectedDay.duration}</span>
              <span className="flex items-center gap-1"><FlameIcon className="h-4 w-4 text-orange-500" /> {selectedDay.caloriesBurned} kcal</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <Button
              size="lg"
              className="w-full text-lg h-14 font-bold tracking-wide"
              onClick={() => handleStartWorkout(selectedDay)}
              disabled={startingDay === selectedDay.day}
            >
              {startingDay === selectedDay.day ? "Preparing Station..." : "Start Workout"}
              <PlayIcon className="ml-2 h-5 w-5" />
            </Button>

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Exercises ({selectedDay.exercises.length})</h4>
              {selectedDay.exercises.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectItem("exercise", ex)}
                  className="w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-4 text-left transition hover:border-primary/40 hover:bg-primary/5 group flex items-center gap-4 shadow-sm overflow-hidden"
                >
                  {/* Preload full-size modal image in background */}
                  <img 
                    src={`https://image.pollinations.ai/prompt/gym%20exercise%20${encodeURIComponent(ex.name)}?width=800&height=400&nologo=true`}
                    className="hidden"
                    alt="preload"
                  />
                  
                  <div className="flex-1">
                    <span className="font-bold text-base group-hover:text-primary transition-colors">{ex.name}</span>
                    <div className="font-mono text-xs text-muted-foreground mt-1 flex items-center gap-3">
                      <span className="bg-background/50 px-2 py-1 rounded">Sets: {ex.sets}</span>
                      <span className="bg-background/50 px-2 py-1 rounded">Reps: {ex.reps}</span>
                    </div>
                  </div>
                  
                  <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    View details &gt;
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        </Framed>
      </div>

      {/* Cooldown */}
      {plan.cooldown && plan.cooldown.length > 0 && (
        <div className="mt-6">
          <h4 className="font-display text-md font-bold mb-3 flex items-center gap-2">
            <ZapIcon className="h-4 w-4 text-blue-500" /> Cool-down Routine
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
