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
    const { fitnessPlanId, workoutName, workoutType } = body;

    if (!fitnessPlanId || !workoutName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new workout session
    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId: session.user.id,
        fitnessPlanId,
        workoutName,
        workoutType: workoutType || "HOME",
        status: "IN_PROGRESS",
        completed: false, // Legacy field, setting to false initially
        completionPercentage: 0,
      },
    });

    return NextResponse.json({ sessionId: workoutSession.id });
  } catch (error) {
    console.error("Error starting workout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
