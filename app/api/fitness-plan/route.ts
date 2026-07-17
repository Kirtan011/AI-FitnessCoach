import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const planId = searchParams.get("id")

    let plan;
    if (planId) {
      plan = await prisma.fitnessPlan.findUnique({
        where: { id: planId, userId: session.user.id },
      })
    } else {
      plan = await prisma.fitnessPlan.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      })
    }

    if (!plan) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: plan.id,
      profile: plan.profile,
      plan: plan.plan,
    })
  } catch (error) {
    console.error("Error fetching fitness plan:", error)
    return NextResponse.json({ error: "Failed to fetch fitness plan" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const planId = searchParams.get("id")

    if (planId) {
      await prisma.fitnessPlan.deleteMany({
        where: { id: planId, userId: session.user.id },
      })
    } else {
      await prisma.fitnessPlan.deleteMany({
        where: { userId: session.user.id },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting fitness plans:", error)
    return NextResponse.json({ error: "Failed to delete fitness plans" }, { status: 500 })
  }
}
