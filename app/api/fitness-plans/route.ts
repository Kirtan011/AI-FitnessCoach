import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const plans = await prisma.fitnessPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        profile: true,
      }
    })

    const formattedPlans = plans.map(plan => {
      // safely extract fitness goal from profile JSON
      const profile = plan.profile as any;
      const title = profile?.fitnessGoal || "Fitness Plan";
      return {
        id: plan.id,
        createdAt: plan.createdAt,
        title: title
      }
    });

    return NextResponse.json(formattedPlans)
  } catch (error) {
    console.error("Error fetching fitness plans:", error)
    return NextResponse.json({ error: "Failed to fetch fitness plans" }, { status: 500 })
  }
}
