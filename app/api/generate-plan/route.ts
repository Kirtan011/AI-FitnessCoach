import { NextResponse } from "next/server"
import type { UserProfile, FitnessPlan } from "@/lib/types"
import { fixAndParseJSON } from "@/lib/json-fixer"
import { buildFitnessPlanPrompt, generateWithPollinations } from "@/lib/ai-client"
import { generateFallbackPlan } from "@/lib/plan-generator"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const profile: UserProfile = body.profile || body
    const isRegenerate: boolean = body.isRegenerate || false

    const exerciseCount = isRegenerate ? 6 : 4
    const prompt = buildFitnessPlanPrompt(profile, exerciseCount)

    let plan: FitnessPlan

    try {
      const text = await generateWithPollinations(prompt)
      plan = fixAndParseJSON(text)
    } catch (parseError) {
      console.log("AI parsing failed, generating profile-based plan")
      plan = generateFallbackPlan(profile, isRegenerate)
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Error generating plan:", error)
    return NextResponse.json({ error: "Failed to generate plan. Please try again." }, { status: 500 })
  }
}
