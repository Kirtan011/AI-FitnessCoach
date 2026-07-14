"use client";

import { useMemo } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DumbbellIcon } from "@/components/icons";

interface WorkoutCalendarProps {
  // An array of dates (ISO strings or Date objects) when the user worked out
  workoutDates: (string | Date)[];
}

export function WorkoutCalendar({ workoutDates }: WorkoutCalendarProps) {
  const data: Activity[] = useMemo(() => {
    // We need to generate a full year of data up to today for the calendar
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const counts: Record<string, number> = {};
    workoutDates.forEach((d) => {
      const dateStr = new Date(d).toISOString().split("T")[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    const activities: Activity[] = [];
    let current = new Date(oneYearAgo);
    
    while (current <= today) {
      const dateStr = current.toISOString().split("T")[0];
      const count = counts[dateStr] || 0;
      
      let level = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count === 3) level = 3;
      else if (count >= 4) level = 4;

      activities.push({
        date: dateStr,
        count,
        level: level as Activity["level"],
      });
      current.setDate(current.getDate() + 1);
    }
    
    return activities;
  }, [workoutDates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <DumbbellIcon className="h-5 w-5 text-primary" /> Workout Consistency
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center overflow-x-auto pb-6">
        <div className="min-w-[700px]">
          <ActivityCalendar
            data={data}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            colorScheme="dark" // Or auto depending on next-themes, but standard GitHub is green
            labels={{
              legend: {
                less: "Less",
                more: "More",
              },
              months: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
              ],
              totalCount: "{{count}} workouts in the last year",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
