export interface UserProfile {
  name: string
  age: number
  gender: "male" | "female" | "other"
  height: number
  weight: number
  fitnessGoal: "weight-loss" | "muscle-gain" | "maintenance" | "endurance" | "flexibility"
  fitnessLevel: "beginner" | "intermediate" | "advanced"
  workoutLocation: "home" | "gym" | "outdoor"
  dietaryPreference: "veg" | "non-veg" | "vegan" | "keto"
  medicalHistory?: string
  stressLevel?: "low" | "medium" | "high"
  sleepHours?: number
  equipment?: string[]
  targetMuscles?: string[]
  workoutSplit?: string
  targetDuration?: string
  injuries?: string
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  restTime: string
  instructions?: string
  targetMuscles?: string[]
  difficulty?: "beginner" | "intermediate" | "advanced"
  calories?: string
  videoUrl?: string
  substitutions?: string[]
  notes?: string
}

export interface WorkoutDay {
  day: string
  focus: string
  exercises: Exercise[]
  duration: string
  caloriesBurned: string
}

export interface Meal {
  name: string
  description: string
  calories: string
  protein: string
  carbs: string
  fats: string
  ingredients?: string[]
  instructions?: string[]
  servingSize?: string
  prepTime?: string
}

export interface DietDay {
  breakfast: Meal
  midMorningSnack: Meal
  lunch: Meal
  eveningSnack: Meal
  dinner: Meal
  totalCalories: string
}

export interface FitnessPlan {
  workoutPlan: WorkoutDay[]
  dietPlan: DietDay
  tips: string[]
  motivation: string
  warmup?: Exercise[]
  cooldown?: Exercise[]
}
