import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { buildMealSwapPrompt, generateWithGroq, generateWithPollinations } from "@/lib/ai-client"
import { fixAndParseJSON } from "@/lib/json-fixer"
import type { Meal, FitnessPlan } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const body = await request.json()
    const { planId, mealType, currentMeal, preference } = body

    if (!mealType || !currentMeal || !preference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const prompt = buildMealSwapPrompt(currentMeal.name, currentMeal.calories, preference)
    let newMeal: Meal | null = null

    try {
      const text = await generateWithGroq(prompt)
      newMeal = fixAndParseJSON(text) as Meal
    } catch (groqError) {
      console.log("⚠️ Groq failed for meal swap, falling back to Pollinations:", (groqError as Error).message)
      try {
        const text = await generateWithPollinations(prompt)
        newMeal = fixAndParseJSON(text) as Meal
      } catch (pollinationsError) {
        console.error("⚠️ AI providers failed for meal swap")
        return NextResponse.json({ error: "Failed to generate alternative meal." }, { status: 500 })
      }
    }

    if (!newMeal || !newMeal.name) {
      return NextResponse.json({ error: "Invalid generated meal format." }, { status: 500 })
    }

    // Try to update in DB if planId exists and user is logged in
    let updatedPlanData = null
    if (planId && session?.user?.id) {
      try {
        const existingRecord = await prisma.fitnessPlan.findUnique({
          where: { id: planId, userId: session.user.id }
        })

        if (existingRecord) {
          const plan = existingRecord.plan as unknown as FitnessPlan
          if (plan.dietPlan && (plan.dietPlan as any)[mealType]) {
            (plan.dietPlan as any)[mealType] = newMeal
            
            const updatedRecord = await prisma.fitnessPlan.update({
              where: { id: planId },
              data: { plan: plan as any }
            })
            updatedPlanData = updatedRecord.plan
          }
        }
      } catch (dbError) {
        console.error("❌ Failed to update plan in database:", dbError)
      }
    }

    return NextResponse.json({ 
      meal: newMeal, 
      updatedPlan: updatedPlanData 
    })
    
  } catch (error) {
    console.error("Error swapping meal:", error)
    return NextResponse.json({ error: "Failed to swap meal." }, { status: 500 })
  }
}
