import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, duration, completionPercentage, calories, skippedExercises, feedback } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // 1. Update the WorkoutSession
    const updatedSession = await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        completed: true,
        duration,
        calories,
        completionPercentage,
      },
    });

    // 2. Create UserFeedback
    if (feedback) {
      await prisma.userFeedback.create({
        data: {
          workoutSessionId: sessionId,
          difficulty: feedback.difficulty,
          energyLevel: feedback.energyLevel,
          sorenessLevel: feedback.sorenessLevel,
          notes: feedback.notes,
        }
      });
    }

    // 3. Mark skipped exercises in ExerciseLog/Record
    // In a full implementation, we'd log every set/rep for every exercise.
    // Since this is a streamlined version, we just log skipped ones.
    if (skippedExercises && skippedExercises.length > 0) {
      const recordsToCreate = skippedExercises.map((exName: string) => ({
        workoutSessionId: sessionId,
        exerciseName: exName,
        sets: 0,
        reps: "0",
        skipped: true,
      }));

      await prisma.exerciseRecord.createMany({
        data: recordsToCreate
      });
    }

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error("Error finishing workout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
