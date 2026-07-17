import type { UserProfile } from "@/lib/types"

export function buildFitnessPlanPrompt(profile: UserProfile, exerciseCount: number, pastWorkouts: string = ""): string {
  const eq = profile.equipment?.length ? `Equipment available: ${profile.equipment.join(", ")}.` : (profile.workoutLocation === "gym" ? "Assume fully equipped gym." : "Bodyweight only.");
  const mus = profile.targetMuscles?.length ? `Target Muscles: ${profile.targetMuscles.join(", ")}.` : "";
  const split = profile.workoutSplit ? `Preferred Split: ${profile.workoutSplit}.` : "";
  const dur = profile.targetDuration ? `Target Duration: ${profile.targetDuration}.` : "";
  const inj = profile.injuries ? `Injuries/Limitations: ${profile.injuries} (Must accommodate safely).` : "";

  const historyContext = pastWorkouts ? `\nRecent Workout History & Feedback:\n${pastWorkouts}\n\nCRITICAL: Apply Progressive Overload based on the feedback above. If the user rated a workout 'Easy', increase the reps, sets, or difficulty for those muscle groups. If 'Hard' or they have high soreness, reduce volume or focus on recovery.` : "";

  return `Generate a premium fitness plan JSON.
Profile:
Name: ${profile.name}, Age: ${profile.age}, Goal: ${profile.fitnessGoal}, Level: ${profile.fitnessLevel}, Location: ${profile.workoutLocation}
Diet: ${profile.dietaryPreference}
${eq}
${mus}
${split}
${dur}
${inj}
${historyContext}

Rules for JSON generation:
1. "warmup" and "cooldown" should be arrays of 2-3 exercises.
2. For each exercise, provide:
- "name"
- "sets" (integer)
- "reps" (string)
- "restTime" (string)
- "instructions" (A step-by-step numbered list explaining how to perform the exercise, with each step on a new line using \\n)
- "targetMuscles" (array of strings)
- "difficulty" ("beginner", "intermediate", "advanced")
- "calories" (estimated string)
- "videoUrl" (a YouTube search query URL, e.g. "https://www.youtube.com/results?search_query=Push+Up+Tutorial")
- "substitutions" (array of 2 alternate exercises that strictly use the available equipment or bodyweight)
- "notes" (A concise, personalized string with actionable guidance on form, breathing, common mistakes, and safety precautions)

CRITICAL: Do NOT prescribe exercises requiring equipment the user does not have. Use the substitutions array for alternative variations based on the same muscle group.
CRITICAL: You MUST include the "dietPlan", "tips", and "motivation" fields exactly as shown in the structure. They must not be empty or omitted under any circumstances.

Return ONLY this exact JSON structure (no markdown):
{"warmup":[{"name":"Jumping Jacks","sets":1,"reps":"30s","restTime":"0s","instructions":"1. Stand tall\\n2. Jump...","targetMuscles":["Full Body"],"difficulty":"beginner","calories":"20","videoUrl":"...","substitutions":["High Knees"]}],"workoutPlan":[{"day":"Day 1","focus":"Full Body","duration":"45 min","caloriesBurned":"300","exercises":[{"name":"Exercise","sets":3,"reps":"12","restTime":"60s","instructions":"1. Step one\\n2. Step two","targetMuscles":["Chest"],"difficulty":"beginner","calories":"50","videoUrl":"...","substitutions":["..."],"notes":"..."}]}],"cooldown":[{"name":"Stretching","sets":1,"reps":"1 min","restTime":"0s","instructions":"1. Stretch","targetMuscles":["Full Body"],"difficulty":"beginner","calories":"10","videoUrl":"...","substitutions":["..."]}],"dietPlan":{"breakfast":{"name":"Meal","description":"desc","calories":"300","protein":"20g","carbs":"30g","fats":"10g","ingredients":["Item 1","Item 2"],"instructions":["Step 1","Step 2"],"servingSize":"1 bowl","prepTime":"10 min"},"midMorningSnack":{"name":"Snack","description":"desc","calories":"150","protein":"10g","carbs":"15g","fats":"5g","ingredients":["Item 1"],"instructions":["Step 1"],"servingSize":"1 piece","prepTime":"2 min"},"lunch":{"name":"Lunch","description":"desc","calories":"450","protein":"30g","carbs":"40g","fats":"15g","ingredients":["Item 1"],"instructions":["Step 1"],"servingSize":"1 plate","prepTime":"15 min"},"eveningSnack":{"name":"Snack","description":"desc","calories":"150","protein":"10g","carbs":"15g","fats":"5g","ingredients":["Item 1"],"instructions":["Step 1"],"servingSize":"1 piece","prepTime":"2 min"},"dinner":{"name":"Dinner","description":"desc","calories":"500","protein":"35g","carbs":"35g","fats":"20g","ingredients":["Item 1"],"instructions":["Step 1"],"servingSize":"1 plate","prepTime":"20 min"},"totalCalories":"1550"},"tips":["tip1","tip2"],"motivation":"Stay strong!"}

Create 7 days with ${exerciseCount} exercises each. Output ONLY valid JSON.`
}

export function buildMealSwapPrompt(currentMealName: string, calories: string, preference: "veg" | "non-veg"): string {
  return `Generate a new single meal JSON to replace "${currentMealName}".
Dietary Preference: ${preference === "veg" ? "Vegetarian (No meat)" : "Non-vegetarian (Can include meat)"}.
Target Calories: Around ${calories}.

Return ONLY this exact JSON structure (no markdown):
{"name":"New Meal Name","description":"A short delicious description","calories":"${calories}","protein":"20g","carbs":"30g","fats":"10g","ingredients":["Item 1","Item 2"],"instructions":["Step 1","Step 2"],"servingSize":"1 bowl","prepTime":"10 min"}

Output ONLY valid JSON.`;
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
      max_tokens: 4000,
      temperature: 0.2,
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
