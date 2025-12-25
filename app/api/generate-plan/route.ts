import { NextResponse } from "next/server"
import type { UserProfile, FitnessPlan } from "@/lib/types"

function fixAndParseJSON(text: string): any {
  let cleaned = text.trim()

  // Extract JSON from response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }

  // Remove markdown
  cleaned = cleaned.replace(/```json\n?|\n?```/g, "").trim()

  // Fix common JSON issues
  cleaned = cleaned
    .replace(/,\s*}/g, "}") // Remove trailing commas before }
    .replace(/,\s*]/g, "]") // Remove trailing commas before ]
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure keys are quoted
    .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double
    .replace(/\n/g, " ") // Remove newlines
    .replace(/\t/g, " ") // Remove tabs
    .replace(/\r/g, "") // Remove carriage returns

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    // If still fails, try to build a minimal valid structure
    throw new Error("Could not parse JSON response")
  }
}

async function generateWithPollinations(prompt: string): Promise<string> {
  const response = await fetch("https://text.pollinations.ai/" + encodeURIComponent(prompt), {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to generate text")
  }

  return response.text()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const profile: UserProfile = body.profile || body
    const isRegenerate: boolean = body.isRegenerate || false

    const exerciseCount = isRegenerate ? 6 : 4

    const prompt = `Generate a fitness plan JSON for:
Name: ${profile.name}, Age: ${profile.age}, Goal: ${profile.fitnessGoal}, Level: ${profile.fitnessLevel}, Location: ${profile.workoutLocation}, Diet: ${profile.dietaryPreference}

Return ONLY this JSON structure (no other text):
{"workoutPlan":[{"day":"Day 1","focus":"Full Body","exercises":[{"name":"Exercise","sets":3,"reps":"12","restTime":"60s","notes":"tip"}],"duration":"45 min","caloriesBurned":"300"}],"dietPlan":{"breakfast":{"name":"Meal","description":"desc","calories":"300","protein":"20g","carbs":"30g","fats":"10g"},"midMorningSnack":{"name":"Snack","description":"desc","calories":"150","protein":"10g","carbs":"15g","fats":"5g"},"lunch":{"name":"Lunch","description":"desc","calories":"450","protein":"30g","carbs":"40g","fats":"15g"},"eveningSnack":{"name":"Snack","description":"desc","calories":"150","protein":"10g","carbs":"15g","fats":"5g"},"dinner":{"name":"Dinner","description":"desc","calories":"500","protein":"35g","carbs":"35g","fats":"20g"},"totalCalories":"1550"},"tips":["tip1","tip2","tip3","tip4","tip5"],"motivation":"Stay strong!"}

Create 7 days with ${exerciseCount} exercises each. Make it specific to their profile. Diet should be ${profile.dietaryPreference}. Output ONLY valid JSON.`

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

function generateFallbackPlan(profile: UserProfile, isRegenerate: boolean): FitnessPlan {
  const exerciseCount = isRegenerate ? 6 : 4

  // Define exercises based on location and goal
  const homeExercises = [
    { name: "Push-ups", sets: 3, reps: "15", restTime: "45s", notes: "Keep core tight" },
    { name: "Squats", sets: 4, reps: "20", restTime: "60s", notes: "Go deep" },
    { name: "Lunges", sets: 3, reps: "12 each leg", restTime: "45s", notes: "Keep balance" },
    { name: "Plank", sets: 3, reps: "45 seconds", restTime: "30s", notes: "Engage abs" },
    { name: "Burpees", sets: 3, reps: "10", restTime: "60s", notes: "Full range motion" },
    { name: "Mountain Climbers", sets: 3, reps: "20", restTime: "45s", notes: "Fast pace" },
    { name: "Jumping Jacks", sets: 3, reps: "30", restTime: "30s", notes: "Warm up" },
    { name: "Tricep Dips", sets: 3, reps: "12", restTime: "45s", notes: "Use chair" },
  ]

  const gymExercises = [
    { name: "Bench Press", sets: 4, reps: "10", restTime: "90s", notes: "Control the weight" },
    { name: "Deadlifts", sets: 4, reps: "8", restTime: "120s", notes: "Keep back straight" },
    { name: "Lat Pulldown", sets: 3, reps: "12", restTime: "60s", notes: "Squeeze at bottom" },
    { name: "Leg Press", sets: 4, reps: "12", restTime: "90s", notes: "Full range" },
    { name: "Shoulder Press", sets: 3, reps: "10", restTime: "60s", notes: "Don't lock elbows" },
    { name: "Cable Rows", sets: 3, reps: "12", restTime: "60s", notes: "Pull to chest" },
    { name: "Leg Curls", sets: 3, reps: "12", restTime: "45s", notes: "Control movement" },
    { name: "Bicep Curls", sets: 3, reps: "12", restTime: "45s", notes: "No swinging" },
  ]

  const outdoorExercises = [
    { name: "Running", sets: 1, reps: "20 minutes", restTime: "0s", notes: "Steady pace" },
    { name: "Sprint Intervals", sets: 6, reps: "30 seconds", restTime: "60s", notes: "Maximum effort" },
    { name: "Park Bench Push-ups", sets: 3, reps: "15", restTime: "45s", notes: "Incline variation" },
    { name: "Step-ups", sets: 3, reps: "12 each", restTime: "45s", notes: "Use bench" },
    { name: "Walking Lunges", sets: 3, reps: "20 steps", restTime: "60s", notes: "Long strides" },
    { name: "Pull-ups (bar)", sets: 3, reps: "8", restTime: "60s", notes: "Full extension" },
    { name: "Box Jumps", sets: 3, reps: "10", restTime: "60s", notes: "Land soft" },
    { name: "Bear Crawls", sets: 3, reps: "30 feet", restTime: "45s", notes: "Stay low" },
  ]

  const exercises =
    profile.workoutLocation === "gym"
      ? gymExercises
      : profile.workoutLocation === "outdoor"
        ? outdoorExercises
        : homeExercises

  const dayFocus = [
    "Chest & Triceps",
    "Back & Biceps",
    "Legs & Glutes",
    "Shoulders & Core",
    "Full Body HIIT",
    "Lower Body Focus",
    "Active Recovery",
  ]

  const workoutPlan = dayFocus.map((focus, i) => ({
    day: `Day ${i + 1}`,
    focus: focus,
    exercises: exercises.slice(0, exerciseCount).map((e) => ({ ...e })),
    duration:
      profile.fitnessLevel === "beginner" ? "30 min" : profile.fitnessLevel === "intermediate" ? "45 min" : "60 min",
    caloriesBurned:
      profile.fitnessLevel === "beginner" ? "250 cal" : profile.fitnessLevel === "intermediate" ? "350 cal" : "450 cal",
  }))

  // Shuffle exercises for each day
  workoutPlan.forEach((day, i) => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5)
    day.exercises = shuffled.slice(0, exerciseCount)
  })

  // Diet based on preference
  const vegDiet = {
    breakfast: {
      name: "Oatmeal with Fruits",
      description: "Whole grain oats with berries, banana and honey",
      calories: "380 cal",
      protein: "12g",
      carbs: "65g",
      fats: "8g",
    },
    midMorningSnack: {
      name: "Greek Yogurt Parfait",
      description: "High protein yogurt with granola and nuts",
      calories: "220 cal",
      protein: "18g",
      carbs: "25g",
      fats: "8g",
    },
    lunch: {
      name: "Quinoa Buddha Bowl",
      description: "Quinoa with roasted vegetables, chickpeas and tahini",
      calories: "520 cal",
      protein: "22g",
      carbs: "68g",
      fats: "18g",
    },
    eveningSnack: {
      name: "Protein Smoothie",
      description: "Plant protein with almond milk and banana",
      calories: "280 cal",
      protein: "25g",
      carbs: "35g",
      fats: "6g",
    },
    dinner: {
      name: "Paneer Tikka with Roti",
      description: "Grilled cottage cheese with whole wheat bread",
      calories: "550 cal",
      protein: "28g",
      carbs: "52g",
      fats: "24g",
    },
    totalCalories: "1950 cal",
  }

  const nonVegDiet = {
    breakfast: {
      name: "Egg White Omelette",
      description: "6 egg whites with spinach and mushrooms",
      calories: "320 cal",
      protein: "36g",
      carbs: "8g",
      fats: "12g",
    },
    midMorningSnack: {
      name: "Chicken Breast Strips",
      description: "Grilled chicken with hummus",
      calories: "250 cal",
      protein: "32g",
      carbs: "12g",
      fats: "8g",
    },
    lunch: {
      name: "Grilled Salmon Salad",
      description: "Fresh greens with salmon and olive oil dressing",
      calories: "480 cal",
      protein: "42g",
      carbs: "18g",
      fats: "26g",
    },
    eveningSnack: {
      name: "Whey Protein Shake",
      description: "Whey protein with banana and peanut butter",
      calories: "320 cal",
      protein: "35g",
      carbs: "28g",
      fats: "10g",
    },
    dinner: {
      name: "Chicken Tikka with Rice",
      description: "Lean grilled chicken with brown rice",
      calories: "580 cal",
      protein: "45g",
      carbs: "55g",
      fats: "18g",
    },
    totalCalories: "1950 cal",
  }

  const veganDiet = {
    breakfast: {
      name: "Tofu Scramble",
      description: "Spiced tofu with vegetables and avocado toast",
      calories: "420 cal",
      protein: "22g",
      carbs: "38g",
      fats: "22g",
    },
    midMorningSnack: {
      name: "Trail Mix",
      description: "Mixed nuts, seeds and dried fruits",
      calories: "280 cal",
      protein: "8g",
      carbs: "28g",
      fats: "18g",
    },
    lunch: {
      name: "Lentil Curry Bowl",
      description: "Red lentils with brown rice and vegetables",
      calories: "520 cal",
      protein: "24g",
      carbs: "78g",
      fats: "12g",
    },
    eveningSnack: {
      name: "Pea Protein Shake",
      description: "Plant protein with oat milk and berries",
      calories: "260 cal",
      protein: "28g",
      carbs: "22g",
      fats: "6g",
    },
    dinner: {
      name: "Chickpea Stir Fry",
      description: "Spiced chickpeas with quinoa and greens",
      calories: "480 cal",
      protein: "22g",
      carbs: "62g",
      fats: "16g",
    },
    totalCalories: "1960 cal",
  }

  const dietPlan =
    profile.dietaryPreference === "vegan"
      ? veganDiet
      : profile.dietaryPreference === "vegetarian"
        ? vegDiet
        : nonVegDiet

  const tips = [
    `Drink at least 3-4 liters of water daily, ${profile.name}!`,
    `Get ${profile.sleepHours || 7}-8 hours of quality sleep every night`,
    "Consistency beats intensity - show up every day",
    `Focus on progressive overload for ${profile.fitnessGoal.replace("-", " ")}`,
    "Track your meals and workouts in a journal",
    "Rest days are growth days - don't skip them",
    "Warm up for 5-10 minutes before every workout",
    "Cool down and stretch after each session",
  ].slice(0, isRegenerate ? 8 : 5)

  const motivations = [
    `${profile.name}, you are stronger than you think. Every rep, every set, every meal is building the best version of yourself. Keep pushing!`,
    `The only bad workout is the one that didn't happen. ${profile.name}, you've got this - your ${profile.fitnessGoal.replace("-", " ")} goal is within reach!`,
    `${profile.name}, remember why you started. That vision of yourself is waiting. One day at a time, one workout at a time!`,
    `Champions are made when no one is watching. ${profile.name}, put in the work today and watch the magic unfold!`,
    `Your body can do it, ${profile.name}. It's your mind you need to convince. Stay focused on your ${profile.fitnessGoal.replace("-", " ")} journey!`,
  ]

  return {
    workoutPlan,
    dietPlan,
    tips,
    motivation: motivations[Math.floor(Math.random() * motivations.length)],
  }
}
