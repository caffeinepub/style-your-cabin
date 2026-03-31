export type Gender = "male" | "female";
export type Lifestyle = "student" | "wfh" | "office" | "active" | "athlete";
export type FitnessGoal = "weight_loss" | "muscle_building" | "maintain";
export type MuscleTarget =
  | "abs"
  | "biceps"
  | "triceps"
  | "chest"
  | "shoulders"
  | "legs"
  | "full_body";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type ActiveTab = "dashboard" | "nutrition" | "workout" | "progress";

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  lifestyle: Lifestyle;
  fitnessGoal: FitnessGoal;
  muscleTargets: MuscleTarget[];
}

export interface HealthStats {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  waterLiters: number;
  waterGlasses: number;
}

export interface DailyLog {
  date: string;
  mealsConsumed: string[];
  totalCaloriesConsumed: number;
  totalProteinConsumed: number;
  waterGlasses: number;
  workoutsCompleted: string[];
}

export interface Meal {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  vitamins: string;
}

export interface Exercise {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  difficulty: DifficultyLevel;
  emoji: string;
}

export interface FoodScanResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  vitamins: string;
}

export interface AlternativeFood {
  name: string;
  quantity: string;
  calories: number;
}

export interface WeeklyLogEntry {
  date: string;
  calories: number;
  water: number;
  workouts: number;
  weight: number;
}
