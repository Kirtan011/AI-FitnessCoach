export interface Exercise {
  name: string
  sets: number
  reps: string
  restTime: string
  notes: string
}

export const HOME_EXERCISES: Exercise[] = [
  { name: "Push-ups", sets: 3, reps: "15", restTime: "45s", notes: "Keep core tight" },
  { name: "Squats", sets: 4, reps: "20", restTime: "60s", notes: "Go deep" },
  { name: "Lunges", sets: 3, reps: "12 each leg", restTime: "45s", notes: "Keep balance" },
  { name: "Plank", sets: 3, reps: "45 seconds", restTime: "30s", notes: "Engage abs" },
  { name: "Burpees", sets: 3, reps: "10", restTime: "60s", notes: "Full range motion" },
  { name: "Mountain Climbers", sets: 3, reps: "20", restTime: "45s", notes: "Fast pace" },
  { name: "Jumping Jacks", sets: 3, reps: "30", restTime: "30s", notes: "Warm up" },
  { name: "Tricep Dips", sets: 3, reps: "12", restTime: "45s", notes: "Use chair" },
]

export const GYM_EXERCISES: Exercise[] = [
  { name: "Bench Press", sets: 4, reps: "10", restTime: "90s", notes: "Control the weight" },
  { name: "Deadlifts", sets: 4, reps: "8", restTime: "120s", notes: "Keep back straight" },
  { name: "Lat Pulldown", sets: 3, reps: "12", restTime: "60s", notes: "Squeeze at bottom" },
  { name: "Leg Press", sets: 4, reps: "12", restTime: "90s", notes: "Full range" },
  { name: "Shoulder Press", sets: 3, reps: "10", restTime: "60s", notes: "Don't lock elbows" },
  { name: "Cable Rows", sets: 3, reps: "12", restTime: "60s", notes: "Pull to chest" },
  { name: "Leg Curls", sets: 3, reps: "12", restTime: "45s", notes: "Control movement" },
  { name: "Bicep Curls", sets: 3, reps: "12", restTime: "45s", notes: "No swinging" },
]

export const OUTDOOR_EXERCISES: Exercise[] = [
  { name: "Running", sets: 1, reps: "20 minutes", restTime: "0s", notes: "Steady pace" },
  { name: "Sprint Intervals", sets: 6, reps: "30 seconds", restTime: "60s", notes: "Maximum effort" },
  { name: "Park Bench Push-ups", sets: 3, reps: "15", restTime: "45s", notes: "Incline variation" },
  { name: "Step-ups", sets: 3, reps: "12 each", restTime: "45s", notes: "Use bench" },
  { name: "Walking Lunges", sets: 3, reps: "20 steps", restTime: "60s", notes: "Long strides" },
  { name: "Pull-ups (bar)", sets: 3, reps: "8", restTime: "60s", notes: "Full extension" },
  { name: "Box Jumps", sets: 3, reps: "10", restTime: "60s", notes: "Land soft" },
  { name: "Bear Crawls", sets: 3, reps: "30 feet", restTime: "45s", notes: "Stay low" },
]

export interface DietMeal {
  name: string
  description: string
  calories: string
  protein: string
  carbs: string
  fats: string
}

export interface DietPlan {
  breakfast: DietMeal
  midMorningSnack: DietMeal
  lunch: DietMeal
  eveningSnack: DietMeal
  dinner: DietMeal
  totalCalories: string
}

export const VEGETARIAN_DIET: DietPlan = {
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

export const NON_VEGETARIAN_DIET: DietPlan = {
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

export const VEGAN_DIET: DietPlan = {
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
