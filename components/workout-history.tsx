"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DumbbellIcon, FlameIcon, ClockIcon } from "@/components/icons";
import { Repeat, Trash2, CalendarDays, Search } from "lucide-react";

export interface HistorySession {
  id: string;
  date: Date;
  workoutName: string;
  duration: number; // minutes
  calories: number;
  completionPercentage: number;
  exercises: string[]; // e.g., ["Bench Press", "Squats"]
}

interface WorkoutHistoryProps {
  sessions: HistorySession[];
  onRepeat?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function WorkoutHistory({ sessions, onRepeat, onDelete }: WorkoutHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const filteredAndSortedSessions = useMemo(() => {
    let result = [...sessions];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.workoutName.toLowerCase().includes(query) ||
        s.exercises.some(e => e.toLowerCase().includes(query))
      );
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc": return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "duration-desc": return b.duration - a.duration;
        case "calories-desc": return b.calories - a.calories;
        default: return 0;
      }
    });
    
    return result;
  }, [sessions, searchQuery, sortBy]);

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
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <CalendarDays className="h-5 w-5 text-primary" /> Workout History
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search workouts or exercises..." 
              className="pl-9 h-9 bg-background" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[170px] h-9 bg-background">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="duration-desc">Duration (High to Low)</SelectItem>
              <SelectItem value="calories-desc">Calories (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredAndSortedSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No workouts match your filters.</p>
          </div>
        ) : (
          filteredAndSortedSessions.map((session) => (
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
        )))}
      </CardContent>
    </Card>
  );
}
