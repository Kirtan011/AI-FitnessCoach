"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Exercise } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Target, Flame, RefreshCcw, Info } from "lucide-react";
import { DumbbellIcon } from "@/components/icons";

interface ExerciseModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseModal({ exercise, isOpen, onClose }: ExerciseModalProps) {
  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <DumbbellIcon className="h-5 w-5 text-primary" />
            {exercise.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Generated Exercise Image */}
          <div className="w-full h-48 rounded-lg overflow-hidden border border-border bg-secondary/30 relative">
            <img 
              src={`https://image.pollinations.ai/prompt/gym%20exercise%20${encodeURIComponent(exercise.name)}?width=800&height=400&nologo=true`}
              alt={exercise.name}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
            />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Sets x Reps</p>
              <p className="font-semibold text-lg">{exercise.sets} x {exercise.reps}</p>
            </div>
            <div className="rounded-lg border bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Rest Time</p>
              <p className="font-semibold text-lg">{exercise.restTime}</p>
            </div>
            
            {exercise.difficulty && (
              <div className="rounded-lg border bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Difficulty</p>
                <p className="font-semibold capitalize text-sm">{exercise.difficulty}</p>
              </div>
            )}
            
            {exercise.calories && (
              <div className="rounded-lg border bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-primary" /> Est. Calories
                </p>
                <p className="font-semibold text-sm">{exercise.calories} kcal</p>
              </div>
            )}
          </div>

          {/* Video Demo Link */}
          {exercise.videoUrl && (
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600/10 text-red-600 hover:bg-red-600/20 px-4 py-3 text-sm font-medium transition-colors"
            >
              <PlayCircle className="h-5 w-5" />
              Watch Video Demonstration
            </a>
          )}

          {/* Instructions */}
          {exercise.instructions && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-sm">
                <Info className="h-4 w-4 text-primary" /> How to perform
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exercise.instructions}
              </p>
            </div>
          )}

          {/* Target Muscles */}
          {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-sm">
                <Target className="h-4 w-4 text-primary" /> Target Muscles
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="capitalize">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Substitutions */}
          {exercise.substitutions && exercise.substitutions.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-sm">
                <RefreshCcw className="h-4 w-4 text-primary" /> Alternatives
              </h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {exercise.substitutions.map((sub) => (
                  <li key={sub}>{sub}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {exercise.notes && (
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <p className="text-sm text-primary font-medium">Trainer Note:</p>
              <p className="text-sm text-primary/80 mt-1">{exercise.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
