import type { UserProfile } from "@/lib/types"

export function buildFitnessPlanPrompt(profile: UserProfile, exerciseCount: number): string {
  const eq = profile.equipment?.length ? `Equipment available: ${profile.equipment.join(", ")}.` : (profile.workoutLocation === "gym" ? "Assume fully equipped gym." : "Bodyweight only.");
  const mus = profile.targetMuscles?.length ? `Target Muscles: ${profile.targetMuscles.join(", ")}.` : "";
  const split = profile.workoutSplit ? `Preferred Split: ${profile.workoutSplit}.` : "";
  const dur = profile.targetDuration ? `Target Duration: ${profile.targetDuration}.` : "";
  const inj = profile.injuries ? `Injuries/Limitations: ${profile.injuries} (Must accommodate safely).` : "";

  return `Generate a premium fitness plan JSON.
Profile:
Name: ${profile.name}, Age: ${profile.age}, Goal: ${profile.fitnessGoal}, Level: ${profile.fitnessLevel}, Location: ${profile.workoutLocation}
Diet: ${profile.dietaryPreference}
${eq}
${mus}
${split}
${dur}
${inj}

Rules for JSON generation:
1. "warmup" and "cooldown" should be arrays of 2-3 exercises.
2. For each exercise, provide:
- "name"
- "sets" (integer)
- "reps" (string)
- "restTime" (string)
- "instructions" (step-by-step text)
- "targetMuscles" (array of strings)
- "difficulty" ("beginner", "intermediate", "advanced")
- "calories" (estimated string)
- "videoUrl" (a YouTube search query URL, e.g. "https://www.youtube.com/results?search_query=Push+Up+Tutorial")
- "substitutions" (array of 2 alternate exercises)
- "notes"

Return ONLY this exact JSON structure (no markdown):
{"warmup":[{"name":"Jumping Jacks","sets":1,"reps":"30s","restTime":"0s","instructions":"...","targetMuscles":["Full Body"],"difficulty":"beginner","calories":"20","videoUrl":"...","substitutions":["High Knees"]}],"workoutPlan":[{"day":"Day 1","focus":"Full Body","duration":"45 min","caloriesBurned":"300","exercises":[{"name":"Exercise","sets":3,"reps":"12","restTime":"60s","instructions":"...","targetMuscles":["Chest"],"difficulty":"beginner","calories":"50","videoUrl":"...","substitutions":["..."],"notes":"..."}]}],"cooldown":[{"name":"Stretching","sets":1,"reps":"1 min","restTime":"0s","instructions":"...","targetMuscles":["Full Body"],"difficulty":"beginner","calories":"10","videoUrl":"...","substitutions":["..."]}],"dietPlan":{"breakfast":{"name":"Meal","description":"desc","calories":"300","protein":"20g","carbs":"30g","fats":"10g"},"midMorningSnack":{"name":"Snack","description":"desc","calories":"150","protein":"10g","carbs":"15g","fats":"5g"},"lunch":{"name":"Lunch","description":"desc","calories":"450","protein":"30g","carbs":"40g","fats":"15g"},"eveningSnack":{"name":"Snack","description":"desc","calories":"150","protein":"10g","carbs":"15g","fats":"5g"},"dinner":{"name":"Dinner","description":"desc","calories":"500","protein":"35g","carbs":"35g","fats":"20g"},"totalCalories":"1550"},"tips":["tip1","tip2"],"motivation":"Stay strong!"}

Create 7 days with ${exerciseCount} exercises each. Output ONLY valid JSON.`
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
