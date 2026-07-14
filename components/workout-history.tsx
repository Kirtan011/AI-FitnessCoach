"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DumbbellIcon, FlameIcon, ClockIcon } from "@/components/icons";
import { Repeat, Trash2, CalendarDays } from "lucide-react";

export interface HistorySession {
  id: string;
  date: Date;
  workoutName: string;
  duration: number; // minutes
  calories: number;
  exercises: string[]; // e.g., ["Bench Press", "Squats"]
}

interface WorkoutHistoryProps {
  sessions: HistorySession[];
  onRepeat?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function WorkoutHistory({ sessions, onRepeat, onDelete }: WorkoutHistoryProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Workout History</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8 text-muted-foreground">
          <CalendarDays className="mb-3 h-10 w-10 opacity-20" />
          <p>No workouts recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <CalendarDays className="h-5 w-5 text-primary" /> Workout History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-secondary/20 p-4 transition-colors hover:bg-secondary/40"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{session.workoutName}</h4>
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(session.date).toLocaleDateString(undefined, {
                    weekday: 'short', month: 'short', day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" /> {session.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <FlameIcon className="h-3.5 w-3.5 text-primary" /> {session.calories} kcal
                </span>
                <span className="flex items-center gap-1">
                  <DumbbellIcon className="h-3 w-3" /> {session.exercises.length} Exercises
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {session.exercises.slice(0, 4).map((ex, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] bg-background/50">
                    {ex}
                  </Badge>
                ))}
                {session.exercises.length > 4 && (
                  <Badge variant="outline" className="text-[10px] bg-background/50">
                    +{session.exercises.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {onRepeat && (
                <Button variant="outline" size="sm" onClick={() => onRepeat(session.id)}>
                  <Repeat className="mr-1 h-3.5 w-3.5" /> Repeat
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(session.id)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
