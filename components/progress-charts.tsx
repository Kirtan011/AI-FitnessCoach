"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TargetIcon, FlameIcon, ClockIcon } from "@/components/icons";

interface ProgressChartsProps {
  stats: {
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    avgCompletion: number;
    currentStreak: number;
    workoutsThisWeek: number;
    history: any[];
  }
}

export function ProgressCharts({ stats }: ProgressChartsProps) {
  if (!stats || !stats.history || stats.history.length === 0) {
    return (
      <Card className="w-full bg-secondary/20 border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <TargetIcon className="w-12 h-12 mb-4 opacity-20" />
          <p>No workout history available yet.</p>
          <p className="text-sm">Complete your first workout to see your progress here!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-2 rounded-md"><TargetIcon className="w-4 h-4 text-primary" /></div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workouts</p>
            </div>
            <div className="text-3xl font-display font-bold">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.workoutsThisWeek} this week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-orange-500/10 p-2 rounded-md"><FlameIcon className="w-4 h-4 text-orange-500" /></div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Calories</p>
            </div>
            <div className="text-3xl font-display font-bold">{stats.totalCalories}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime burned</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-500/10 p-2 rounded-md"><ClockIcon className="w-4 h-4 text-blue-500" /></div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</p>
            </div>
            <div className="text-3xl font-display font-bold">{stats.totalDuration} <span className="text-sm font-normal text-muted-foreground">min</span></div>
            <p className="text-xs text-muted-foreground mt-1">Total active time</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-500/10 p-2 rounded-md"><TargetIcon className="w-4 h-4 text-green-500" /></div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Completion</p>
            </div>
            <div className="text-3xl font-display font-bold">{stats.avgCompletion}%</div>
            <p className="text-xs text-muted-foreground mt-1">Session thoroughness</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calories Burned Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <FlameIcon className="w-5 h-5 text-orange-500" /> Calories Burned
            </CardTitle>
            <CardDescription>Energy expenditure over your last {stats.history.length} workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Completion % Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <TargetIcon className="w-5 h-5 text-primary" /> Workout Completion
            </CardTitle>
            <CardDescription>How much of the plan you finished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                  />
                  <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
