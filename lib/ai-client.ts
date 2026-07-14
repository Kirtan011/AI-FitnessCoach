import type { UserProfile } from "@/lib/types"

export function buildFitnessPlanPrompt(profile: UserProfile, exerciseCount: number): string {
  return `Generate a fitness plan JSON for:
Name: ${profile.name}, Age: ${profile.age}, Goal: ${profile.fitnessGoal}, Level: ${profile.fitnessLevel}, Location: ${profile.workoutLocation}, Diet: ${profile.dietaryPreference}

Return ONLY this JSON structure (no other text):
{"workoutPlan":[{"day":"Day 1","focus":"Full Body","exercises":[{"name":"Exercise","sets":3,"reps":"12","restTime":"60s","notes":"tip"}],"duration":"45 min","caloriesBurned":"300"}],"dietPlan":{"breakfast":{"name":"Meal","description":"desc","calories":"300","protein":"20g","carbs":"30g","fats":"10g"},"midMorningSnack":{"name":"Snack","description":"desc","calories":"150","protein":"10g","carbs":"15g","fats":"5g"},"lunch":{"name":"Lunch","description":"desc","calories":"450","protein":"30g","carbs":"40g","fats":"15g"},"eveningSnack":{"name":"Snack","description":"desc","calories":"150","protein":"10g","carbs":"15g","fats":"5g"},"dinner":{"name":"Dinner","description":"desc","calories":"500","protein":"35g","carbs":"35g","fats":"20g"},"totalCalories":"1550"},"tips":["tip1","tip2","tip3","tip4","tip5"],"motivation":"Stay strong!"}

Create 7 days with ${exerciseCount} exercises each. Make it specific to their profile. Diet should be ${profile.dietaryPreference}. Output ONLY valid JSON.`
}

export async function generateWithGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("Missing GROQ_API_KEY")

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq failed: ${response.status}`)
  }

  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error("Groq returned no text")

  return text
}

export async function generateWithPollinations(prompt: string): Promise<string> {
  const response = await fetch("https://text.pollinations.ai/" + encodeURIComponent(prompt), {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to generate text")
  }

  return response.text()
}
