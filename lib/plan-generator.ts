import type { UserProfile, FitnessPlan } from "@/lib/types"
import {
  HOME_EXERCISES,
  GYM_EXERCISES,
  OUTDOOR_EXERCISES,
  VEGETARIAN_DIET,
  NON_VEGETARIAN_DIET,
  VEGAN_DIET,
} from "@/lib/fallback-data"

const DAY_FOCUS = [
  "Chest & Triceps",
  "Back & Biceps",
  "Legs & Glutes",
  "Shoulders & Core",
  "Full Body HIIT",
  "Lower Body Focus",
  "Active Recovery",
]

function generateTips(profile: UserProfile, isRegenerate: boolean): string[] {
  const tips = [
    `Drink at least 3-4 liters of water daily, ${profile.name}!`,
    `Get ${profile.sleepHours || 7}-8 hours of quality sleep every night`,
    "Consistency beats intensity - show up every day",
    `Focus on progressive overload for ${profile.fitnessGoal.replace("-", " ")}`,
    "Track your meals and workouts in a journal",
    "Rest days are growth days - don't skip them",
    "Warm up for 5-10 minutes before every workout",
    "Cool down and stretch after each session",
  ]
  return tips.slice(0, isRegenerate ? 8 : 5)
}

function generateMotivation(profile: UserProfile): string {
  const motivations = [
    `${profile.name}, you are stronger than you think. Every rep, every set, every meal is building the best version of yourself. Keep pushing!`,
    `The only bad workout is the one that didn't happen. ${profile.name}, you've got this - your ${profile.fitnessGoal.replace("-", " ")} goal is within reach!`,
    `${profile.name}, remember why you started. That vision of yourself is waiting. One day at a time, one workout at a time!`,
    `Champions are made when no one is watching. ${profile.name}, put in the work today and watch the magic unfold!`,
    `Your body can do it, ${profile.name}. It's your mind you need to convince. Stay focused on your ${profile.fitnessGoal.replace("-", " ")} journey!`,
  ]
  return motivations[Math.floor(Math.random() * motivations.length)]
}

function getExercisesForLocation(location: string) {
  switch (location) {
    case "gym":
      return GYM_EXERCISES
    case "outdoor":
      return OUTDOOR_EXERCISES
    default:
      return HOME_EXERCISES
  }
}

function getDietPlan(dietaryPreference: string) {
  switch (dietaryPreference) {
    case "vegan":
      return VEGAN_DIET
    case "vegetarian":
      return VEGETARIAN_DIET
    default:
      return NON_VEGETARIAN_DIET
  }
}

function getDuration(fitnessLevel: string): string {
  switch (fitnessLevel) {
    case "beginner":
      return "30 min"
    case "intermediate":
      return "45 min"
    default:
      return "60 min"
  }
}

function getCaloriesBurned(fitnessLevel: string): string {
  switch (fitnessLevel) {
    case "beginner":
      return "250 cal"
    case "intermediate":
      return "350 cal"
    default:
      return "450 cal"
  }
}

export function generateFallbackPlan(profile: UserProfile, isRegenerate: boolean): FitnessPlan {
  const exerciseCount = isRegenerate ? 6 : 4
  const exercises = getExercisesForLocation(profile.workoutLocation)

  const workoutPlan = DAY_FOCUS.map((focus, i) => ({
    day: `Day ${i + 1}`,
    focus: focus,
    exercises: exercises.slice(0, exerciseCount).map((e) => ({ ...e })),
    duration: getDuration(profile.fitnessLevel),
    caloriesBurned: getCaloriesBurned(profile.fitnessLevel),
  }))

  workoutPlan.forEach(() => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, exerciseCount)
  })

  return {
    workoutPlan,
    dietPlan: getDietPlan(profile.dietaryPreference),
    tips: generateTips(profile, isRegenerate),
    motivation: generateMotivation(profile),
  }
}
