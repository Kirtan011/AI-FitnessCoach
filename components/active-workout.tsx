"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DumbbellIcon, FlameIcon, ClockIcon, PlayIcon, CheckIcon } from "@/components/icons";
import type { Exercise, WorkoutDay } from "@/lib/types";
import { WorkoutSummaryModal } from "@/components/workout-summary-modal";

interface ActiveWorkoutProps {
  sessionData: any;
  workoutDay: WorkoutDay;
  warmup: Exercise[];
  cooldown: Exercise[];
}

export function ActiveWorkout({ sessionData, workoutDay, warmup, cooldown }: ActiveWorkoutProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<"warmup" | "main" | "cooldown">(warmup.length > 0 ? "warmup" : "main");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [skippedExercises, setSkippedExercises] = useState<string[]>([]);
  
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const activeList = 
    currentSection === "warmup" ? warmup :
    currentSection === "main" ? workoutDay.exercises :
    cooldown;

  const currentExercise = activeList[exerciseIndex];
  const totalExercises = warmup.length + workoutDay.exercises.length + cooldown.length;
  
  const currentGlobalIndex = 
    (currentSection === "warmup" ? exerciseIndex :
     currentSection === "main" ? warmup.length + exerciseIndex :
     warmup.length + workoutDay.exercises.length + exerciseIndex) + 1;

  const progressPercentage = (currentGlobalIndex / totalExercises) * 100;

  // Workout duration stopwatch
  useEffect(() => {
    const timer = setInterval(() => setWorkoutDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest timer
  useEffect(() => {
    let timer: any;
    if (isResting && restTimeLeft > 0) {
      timer = setInterval(() => setRestTimeLeft(prev => prev - 1), 1000);
    } else if (isResting && restTimeLeft <= 0) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, restTimeLeft]);

  const parseRestTime = (timeStr: string) => {
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 60;
  };

  const completeSet = (setIdx: number) => {
    if (!completedSets.includes(setIdx)) {
      setCompletedSets(prev => [...prev, setIdx]);
      // Start rest timer if not the last set
      if (setIdx < (currentExercise.sets || 1) - 1) {
        setIsResting(true);
        setRestTimeLeft(parseRestTime(currentExercise.restTime || "60s"));
      }
    }
  };

  const nextExercise = (skipped = false) => {
    if (skipped) {
      setSkippedExercises(prev => [...prev, currentExercise.name]);
    }
    
    setIsResting(false);
    setCompletedSets([]);

    if (exerciseIndex < activeList.length - 1) {
      setExerciseIndex(prev => prev + 1);
    } else {
      // Move to next section
      if (currentSection === "warmup") {
        setCurrentSection("main");
        setExerciseIndex(0);
      } else if (currentSection === "main" && cooldown.length > 0) {
        setCurrentSection("cooldown");
        setExerciseIndex(0);
      } else {
        // Finish workout
        setShowSummary(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (showSummary) {
    return (
      <WorkoutSummaryModal 
        sessionId={sessionData.id}
        duration={workoutDuration}
        completionPercentage={Math.round(((totalExercises - skippedExercises.length) / totalExercises) * 100)}
        skippedExercises={skippedExercises}
        calories={parseInt(workoutDay.caloriesBurned) || 0}
      />
    );
  }

  if (!currentExercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div>
          <h2 className="font-display font-bold text-lg">{sessionData.workoutName}</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{currentSection} ({currentGlobalIndex}/{totalExercises})</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-primary font-bold">
          <ClockIcon className="h-5 w-5" />
          {formatTime(workoutDuration)}
        </div>
      </div>

      <Progress value={progressPercentage} className="h-1 rounded-none" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl font-display">{currentExercise.name}</CardTitle>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground mt-2">
                <span className="bg-secondary px-2 py-1 rounded">Sets: {currentExercise.sets || 1}</span>
                <span className="bg-secondary px-2 py-1 rounded">Reps: {currentExercise.reps || "N/A"}</span>
                <span className="bg-secondary px-2 py-1 rounded">Rest: {currentExercise.restTime || "N/A"}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentExercise.instructions && (
                <div className="text-sm text-foreground/80 leading-relaxed">
                  {currentExercise.instructions}
                </div>
              )}

              {currentExercise.targetMuscles && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Target Muscles</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.targetMuscles.map(m => (
                      <span key={m} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Set Tracking */}
              <div className="space-y-3 mt-6 border-t pt-6">
                <h4 className="text-sm font-bold flex items-center justify-between">
                  Track Sets
                  {isResting && (
                    <span className="text-orange-500 font-mono flex items-center gap-1 animate-pulse">
                      <ClockIcon className="h-4 w-4" /> Rest: {formatTime(restTimeLeft)}
                    </span>
                  )}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: currentExercise.sets || 1 }).map((_, idx) => {
                    const isDone = completedSets.includes(idx);
                    return (
                      <Button
                        key={idx}
                        variant={isDone ? "default" : "outline"}
                        className="w-full justify-between h-12"
                        onClick={() => completeSet(idx)}
                        disabled={isDone || (idx > 0 && !completedSets.includes(idx - 1))}
                      >
                        <span className="font-mono">Set {idx + 1}</span>
                        {isDone ? <CheckIcon className="h-5 w-5" /> : <span className="text-muted-foreground font-mono">{currentExercise.reps}</span>}
                      </Button>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => nextExercise(true)}>
            Skip Exercise
          </Button>
          <Button className="flex-1" onClick={() => nextExercise(false)} disabled={completedSets.length < (currentExercise.sets || 1)}>
            {currentGlobalIndex === totalExercises ? "Finish Workout" : "Next Exercise"}
          </Button>
        </div>
      </div>
    </div>
  );
}
