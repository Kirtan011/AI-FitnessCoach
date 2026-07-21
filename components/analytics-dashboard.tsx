"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DumbbellIcon, FlameIcon, ClockIcon, ZapIcon, TargetIcon } from "@/components/icons";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import type { HistorySession } from "./workout-history";

// Extend HistorySession to include feedback for analytics
interface AnalyticsSession extends HistorySession {
  feedback?: {
    difficulty: "Easy" | "Moderate" | "Hard";
    energyLevel: number;
    sorenessLevel: number;
  };
}

interface AnalyticsDashboardProps {
  sessions: AnalyticsSession[];
}

export function AnalyticsDashboard({ sessions }: AnalyticsDashboardProps) {
  if (!sessions || sessions.length === 0) return null;

  // Calculate high-level stats
  const totalWorkouts = sessions.length;
  const totalDuration = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalCalories = sessions.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  let currentStreak = 0;
  if (sessions.length > 0) {
    const dates = sessions.map(s => new Date(s.date).setHours(0,0,0,0)).sort((a,b) => b - a);
    const uniqueDates = Array.from(new Set(dates));
    const today = new Date().setHours(0,0,0,0);
    const yesterday = today - 86400000;
    
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;
      let expectedNextDate = uniqueDates[0] - 86400000;
      for (let i = 1; i < uniqueDates.length; i++) {
        if (uniqueDates[i] === expectedNextDate) {
          currentStreak++;
          expectedNextDate -= 86400000;
        } else {
          break;
        }
      }
    }
  }

  const averageAdherence = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0) / sessions.length)
    : 0;

  // Prepare chart data (reverse to show chronological order)
  const chartData = [...sessions].reverse().map(session => {
    // Map difficulty to a numeric value for plotting
    let difficultyScore = 0;
    if (session.feedback?.difficulty === "Easy") difficultyScore = 1;
    if (session.feedback?.difficulty === "Moderate") difficultyScore = 3;
    if (session.feedback?.difficulty === "Hard") difficultyScore = 5;

    return {
      name: new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      calories: session.calories || 0,
      duration: session.duration || 0,
      energy: session.feedback?.energyLevel || null,
      difficulty: difficultyScore || null,
      adherence: session.completionPercentage || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-secondary/20 border-primary/10">
          <CardContent className="flex items-center p-6 gap-4">
            <div className="bg-primary/20 p-3 rounded-xl text-primary">
              <DumbbellIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Workouts</p>
              <h3 className="text-3xl font-display font-bold">{totalWorkouts}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/20 border-primary/10">
          <CardContent className="flex items-center p-6 gap-4">
            <div className="bg-blue-500/20 p-3 rounded-xl text-blue-500">
              <ClockIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Active Time</p>
              <h3 className="text-3xl font-display font-bold">
                {totalDuration > 60 ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m` : `${totalDuration}m`}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 border-primary/10">
          <CardContent className="flex items-center p-6 gap-4">
            <div className="bg-orange-500/20 p-3 rounded-xl text-orange-500">
              <FlameIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Calories</p>
              <h3 className="text-3xl font-display font-bold">{totalCalories}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 border-primary/10">
          <CardContent className="flex items-center p-6 gap-4">
            <div className="bg-purple-500/20 p-3 rounded-xl text-purple-500">
              <ZapIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Streak</p>
              <h3 className="text-3xl font-display font-bold">{currentStreak} <span className="text-lg font-normal text-muted-foreground">days</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 border-primary/10">
          <CardContent className="flex items-center p-6 gap-4">
            <div className="bg-green-500/20 p-3 rounded-xl text-green-500">
              <TargetIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Adherence</p>
              <h3 className="text-3xl font-display font-bold">{averageAdherence}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calories Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Calorie Burn Trend</CardTitle>
            <CardDescription>Your energy expenditure over recent workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCaloriesBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'var(--secondary)'}}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="calories" fill="url(#colorCaloriesBar)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Energy vs Difficulty Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Energy vs Difficulty</CardTitle>
            <CardDescription>How you felt (1-5) vs how hard the workout was (1-5)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" name="Energy Level" dataKey="energy" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Difficulty" dataKey="difficulty" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Adherence Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Plan Adherence</CardTitle>
            <CardDescription>Your workout completion rate (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    formatter={(value) => [`${value}%`, 'Completion']}
                  />
                  <Line type="monotone" name="Completion Rate" dataKey="adherence" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
