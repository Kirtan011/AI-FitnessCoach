import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { date, workoutName, duration, calories, exercises } = await req.json();

    if (!workoutName || !exercises || !Array.isArray(exercises)) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId: session.user.id,
        date: date ? new Date(date) : new Date(),
        workoutName,
        duration: duration ? Number(duration) : null,
        calories: calories ? Number(calories) : null,
        completed: true,
        records: {
          create: exercises.map((ex: any) => ({
            exerciseName: ex.name,
            sets: ex.sets || 1,
            reps: ex.reps || "10",
            weight: ex.weight || null,
          })),
        },
      },
    });

    return NextResponse.json(workoutSession);
  } catch (error) {
    console.error("Error logging workout:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
