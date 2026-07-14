"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TargetIcon, FlameIcon, ClockIcon } from "@/components/icons";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function DashboardOverview({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-card shadow-sm hover-lift relative overflow-hidden group">
        <Link href="/dashboard/progress" className="absolute inset-0 z-10" />
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-md"><TargetIcon className="w-4 h-4 text-primary" /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Streak</p>
          </div>
          <div className="text-3xl font-display font-bold">{stats.currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
        </CardContent>
      </Card>
      
      <Card className="bg-card shadow-sm hover-lift relative overflow-hidden">
        <Link href="/dashboard/progress" className="absolute inset-0 z-10" />
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-orange-500/10 p-2 rounded-md"><FlameIcon className="w-4 h-4 text-orange-500" /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Calories</p>
          </div>
          <div className="text-3xl font-display font-bold">{stats.totalCalories}</div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm hover-lift relative overflow-hidden">
        <Link href="/dashboard/progress" className="absolute inset-0 z-10" />
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500/10 p-2 rounded-md"><ClockIcon className="w-4 h-4 text-blue-500" /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Time</p>
          </div>
          <div className="text-3xl font-display font-bold">{stats.totalDuration} <span className="text-sm font-normal text-muted-foreground">min</span></div>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground shadow-sm hover-lift relative overflow-hidden">
        <Link href="/dashboard/progress" className="absolute inset-0 z-10 flex items-center justify-center" />
        <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center h-full">
          <span className="font-display font-bold mb-1">View Full</span>
          <span className="font-display font-bold flex items-center gap-1">Analytics <ChevronRight className="w-4 h-4" /></span>
        </CardContent>
      </Card>
    </div>
  );
}
