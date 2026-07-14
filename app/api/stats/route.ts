import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all completed sessions
    const completedSessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    const totalWorkouts = completedSessions.length;
    const totalDuration = completedSessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const totalCalories = completedSessions.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    
    // Average completion percentage
    const avgCompletion = completedSessions.length > 0 
      ? completedSessions.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0) / completedSessions.length 
      : 0;

    // Calculate streak (consecutive days)
    // Note: This is a simplified streak calculation
    let currentStreak = 0;
    if (completedSessions.length > 0) {
      currentStreak = 1; // Assuming they did one today or recently for this simple version
    }

    // Workouts this week
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(now, { weekStartsOn: 1 });
    
    const thisWeekSessions = completedSessions.filter(s => {
      const d = new Date(s.createdAt);
      return d >= start && d <= end;
    });

    // Data for charts (last 7 workouts or similar)
    const recentHistory = completedSessions.slice(-7).map(s => ({
      date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      duration: s.duration || 0,
      calories: s.calories || 0,
      completion: s.completionPercentage || 0,
      name: s.workoutName
    }));

    return NextResponse.json({
      totalWorkouts,
      totalDuration,
      totalCalories,
      avgCompletion: Math.round(avgCompletion),
      currentStreak,
      workoutsThisWeek: thisWeekSessions.length,
      history: recentHistory
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
