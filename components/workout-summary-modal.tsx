"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FlameIcon, ClockIcon, TargetIcon, ZapIcon } from "@/components/icons";

interface WorkoutSummaryModalProps {
  sessionId: string;
  duration: number; // in seconds
  completionPercentage: number;
  skippedExercises: string[];
  calories: number;
}

export function WorkoutSummaryModal({
  sessionId,
  duration,
  completionPercentage,
  skippedExercises,
  calories,
}: WorkoutSummaryModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [difficulty, setDifficulty] = useState<"Easy" | "Moderate" | "Hard">("Moderate");
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [sorenessLevel, setSorenessLevel] = useState<number>(1);
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/workout-session/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          duration: Math.round(duration / 60), // in minutes
          completionPercentage,
          calories,
          skippedExercises,
          feedback: {
            difficulty,
            energyLevel,
            sorenessLevel,
            notes,
          }
        }),
      });

      if (response.ok) {
        router.push("/dashboard/history");
      } else {
        alert("Failed to save workout session.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error saving workout session.");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return `${m} min`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-lg border-primary/20 shadow-xl shadow-primary/5 animate-in fade-in zoom-in-95 mt-8 mb-8">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <ZapIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-display">Workout Complete!</CardTitle>
          <CardDescription>Great job! Let's log how you felt to help the AI improve your next session.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3 text-center border">
              <ClockIcon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-lg font-mono font-bold">{formatTime(duration)}</div>
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Time</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center border">
              <TargetIcon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-lg font-mono font-bold">{completionPercentage}%</div>
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Completion</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center border">
              <FlameIcon className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <div className="text-lg font-mono font-bold">{calories}</div>
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Calories</div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="space-y-4 pt-4 border-t">
            
            <div className="space-y-2">
              <label className="text-sm font-bold">How difficult was it?</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Easy", "Moderate", "Hard"] as const).map(level => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    onClick={() => setDifficulty(level)}
                    className="h-10"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex justify-between">
                <span>Energy Level</span>
                <span className="text-muted-foreground font-mono">{energyLevel}/5</span>
              </label>
              <input 
                type="range" min="1" max="5" 
                value={energyLevel} onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full accent-primary" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Exhausted</span>
                <span>Energized</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex justify-between">
                <span>Muscle Soreness</span>
                <span className="text-muted-foreground font-mono">{sorenessLevel}/5</span>
              </label>
              <input 
                type="range" min="1" max="5" 
                value={sorenessLevel} onChange={(e) => setSorenessLevel(parseInt(e.target.value))}
                className="w-full accent-primary" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>None</span>
                <span>Severe</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Notes (Optional)</label>
              <Textarea 
                placeholder="Felt great on bench press, but shoulder hurt during laterals..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
              />
            </div>

          </div>

          <Button 
            className="w-full h-12 text-lg" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Finish"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
