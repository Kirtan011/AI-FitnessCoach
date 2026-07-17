"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DumbbellIcon, FlameIcon, ClockIcon, PlayIcon, CheckIcon } from "@/components/icons";
import { Info, Target, RefreshCcw, PlayCircle, AlertCircle } from "lucide-react";
import type { Exercise, WorkoutDay } from "@/lib/types";
import { WorkoutSummaryModal } from "@/components/workout-summary-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

function VideoModalContent({ exerciseName }: { exerciseName: string }) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/video-search?q=${encodeURIComponent(exerciseName)}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setVideoId(data.videoId);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [exerciseName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center absolute inset-0">
        <RefreshCcw className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-white font-medium">Finding best tutorial...</p>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center mt-8 sm:mt-0 relative z-10">
        <PlayCircle className="h-12 w-12 text-red-500 mb-4 opacity-80" />
        <h3 className="font-bold text-lg mb-2 text-white">Find {exerciseName} Tutorials</h3>
        <p className="text-sm text-gray-400 mb-6 max-w-sm">
          We couldn't automatically load the video. Click below to view the best demonstrations directly on YouTube.
        </p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold px-8">
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + " tutorial")}`} target="_blank" rel="noopener noreferrer">
            Search on YouTube
          </a>
        </Button>
      </div>
    );
  }

  return (
    <iframe
      className="absolute inset-0 w-full h-full pt-8 sm:pt-0"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      title={`${exerciseName} Demonstration`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

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
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div>
          <h2 className="font-display font-bold text-base">{sessionData.workoutName}</h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{currentSection} ({currentGlobalIndex}/{totalExercises})</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-primary font-bold">
          <ClockIcon className="h-5 w-5" />
          {formatTime(workoutDuration)}
        </div>
      </div>

      <Progress value={progressPercentage} className="h-1 rounded-none" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6">
        <div className="max-w-xl mx-auto space-y-4">
          
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-display text-foreground">{currentExercise.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary/30 border rounded-lg p-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Sets x Reps</p>
                  <p className="font-mono font-bold text-sm">{currentExercise.sets} × {currentExercise.reps || "N/A"}</p>
                </div>
                <div className="bg-secondary/30 border rounded-lg p-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Rest Time</p>
                  <p className="font-mono font-bold text-sm">{currentExercise.restTime || "N/A"}</p>
                </div>
                <div className="bg-secondary/30 border rounded-lg p-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Difficulty</p>
                  <p className="font-bold text-sm capitalize text-primary">{currentExercise.difficulty || "Beginner"}</p>
                </div>
                <div className="bg-secondary/30 border rounded-lg p-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><FlameIcon className="h-3 w-3" /> Est. Calories</p>
                  <p className="font-mono font-bold text-sm">{currentExercise.calories || "N/A"}</p>
                </div>
              </div>

              {/* Video Button */}
              {currentExercise.videoUrl && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20 font-bold h-10 text-sm">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Watch Video Demonstration
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-none">
                    <DialogHeader className="p-4 pb-0 bg-background absolute top-0 left-0 right-0 z-10 hidden">
                      <DialogTitle>{currentExercise.name} Demonstration</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video w-full bg-black relative flex items-center justify-center border-b border-primary/10">
                      <VideoModalContent exerciseName={currentExercise.name} />
                    </div>
                    <div className="p-4 bg-background border-t border-primary/20 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-sm">{currentExercise.name}</h3>
                        <p className="text-xs text-muted-foreground">Video Demonstration</p>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="text-xs">
                        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentExercise.name + " tutorial")}`} target="_blank" rel="noopener noreferrer">
                          Open in YouTube
                        </a>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Instructions */}
              {currentExercise.instructions && (
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-sm mb-2"><Info className="h-4 w-4" /> How to perform</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {currentExercise.instructions}
                  </p>
                </div>
              )}

              {/* Target Muscles */}
              {currentExercise.targetMuscles && currentExercise.targetMuscles.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-sm mb-2"><Target className="h-4 w-4" /> Target Muscles</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.targetMuscles.map(m => (
                      <span key={m} className="bg-primary/20 text-primary font-medium text-xs px-2.5 py-1 rounded-md">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {currentExercise.substitutions && currentExercise.substitutions.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-sm mb-2"><RefreshCcw className="h-4 w-4" /> Alternatives</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {currentExercise.substitutions.map(sub => (
                      <li key={sub}>{sub}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Trainer Notes */}
              {currentExercise.notes && (
                <div className="bg-secondary/40 border rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <h4 className="font-bold text-xs mb-1 flex items-center gap-1.5"><AlertCircle className="h-3 w-3 text-primary" /> Trainer Note:</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{currentExercise.notes}</p>
                </div>
              )}

              {/* Set Tracking */}
              <div className="space-y-2 mt-4 border-t pt-4">
                <h4 className="text-xs font-bold flex items-center justify-between">
                  Track Sets
                  {isResting && (
                    <span className="text-orange-500 font-mono flex items-center gap-1 animate-pulse">
                      <ClockIcon className="h-3 w-3" /> Rest: {formatTime(restTimeLeft)}
                    </span>
                  )}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Array.from({ length: currentExercise.sets || 1 }).map((_, idx) => {
                    const isDone = completedSets.includes(idx);
                    return (
                      <Button
                        key={idx}
                        variant={isDone ? "default" : "outline"}
                        className="w-full justify-between h-10"
                        onClick={() => completeSet(idx)}
                        disabled={isDone || (idx > 0 && !completedSets.includes(idx - 1))}
                      >
                        <span className="font-mono text-sm">Set {idx + 1}</span>
                        {isDone ? <CheckIcon className="h-4 w-4" /> : <span className="text-muted-foreground font-mono text-sm">{currentExercise.reps}</span>}
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
      <div className="p-3 border-t bg-card shrink-0">
        <div className="max-w-xl mx-auto flex gap-3">
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
