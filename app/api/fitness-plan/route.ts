import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const latestPlan = await prisma.fitnessPlan.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    if (!latestPlan) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      profile: latestPlan.profile,
      plan: latestPlan.plan,
    })
  } catch (error) {
    console.error("Error fetching fitness plan:", error)
    return NextResponse.json({ error: "Failed to fetch fitness plan" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.fitnessPlan.deleteMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting fitness plans:", error)
    return NextResponse.json({ error: "Failed to delete fitness plans" }, { status: 500 })
  }
}
