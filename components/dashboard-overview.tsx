"use client";

import Link from "next/link";
import { TrendingUp, Activity, Timer, ArrowUpRight } from "lucide-react";
import { Framed, DotGrid } from "@/components/shared";
import { Button } from "@/components/ui/button";

export function DashboardOverview({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <div className="mb-14 relative group/overview">
      <Framed className="p-6 md:p-8 bg-card/60 backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden relative border-none ring-1 ring-border/50">
        <DotGrid className="absolute inset-0 opacity-[0.15] pointer-events-none transition-opacity group-hover/overview:opacity-[0.25] duration-700" />
        
        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border/50">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Lifetime Metrics
              <span className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded-md uppercase tracking-wider">Overall</span>
            </h3>
            <p className="text-muted-foreground mt-2 text-sm max-w-sm">
              Your cumulative progress across all completed workouts.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 bg-background/50 hover:bg-primary hover:text-primary-foreground border-transparent hover:border-transparent transition-all shadow-sm">
            <Link href="/dashboard/progress">
              Full Analytics <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
        
        {/* Metrics Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-border/50">
          
          {/* STREAK */}
          <div className="md:pr-8 group cursor-default">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2.5 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-sm transition-transform group-hover:scale-110 duration-300">
                 <TrendingUp className="w-5 h-5" />
               </div>
               <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-primary">Current Streak</span>
            </div>
            <div className="flex items-baseline gap-2 pl-1">
              <span className="text-6xl font-display font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
                {stats.currentStreak}
              </span>
              <span className="text-muted-foreground font-medium text-sm">days</span>
            </div>
          </div>
          
          {/* CALORIES */}
          <div className="md:px-8 group cursor-default">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl ring-1 ring-orange-500/20 shadow-sm transition-transform group-hover:scale-110 duration-300">
                 <Activity className="w-5 h-5" />
               </div>
               <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-orange-500">Calories Burned</span>
            </div>
            <div className="flex items-baseline gap-2 pl-1">
              <span className="text-6xl font-display font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 group-hover:from-orange-500 group-hover:to-orange-500/70 transition-all duration-300">
                {stats.totalCalories}
              </span>
              <span className="text-muted-foreground font-medium text-sm">kcal</span>
            </div>
          </div>
          
          {/* DURATION */}
          <div className="md:pl-8 group cursor-default">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl ring-1 ring-emerald-500/20 shadow-sm transition-transform group-hover:scale-110 duration-300">
                 <Timer className="w-5 h-5" />
               </div>
               <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-emerald-500">Active Time</span>
            </div>
            <div className="flex items-baseline gap-2 pl-1">
              <span className="text-6xl font-display font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 group-hover:from-emerald-500 group-hover:to-emerald-500/70 transition-all duration-300">
                {stats.totalDuration}
              </span>
              <span className="text-muted-foreground font-medium text-sm">min</span>
            </div>
          </div>
          
        </div>
      </Framed>
    </div>
  );
}


