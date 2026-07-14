import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        records: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const formattedSessions = sessions.map((s: any) => ({
      id: s.id,
      date: s.date,
      workoutName: s.workoutName,
      duration: s.duration || 0,
      calories: s.calories || 0,
      exercises: s.records.map((r: any) => r.exerciseName),
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
