import type { DifficultyLevel, HealthStats, UserProfile } from "../types";

export function calculateHealthStats(profile: UserProfile): HealthStats {
  const { age, weight, height, gender, lifestyle, fitnessGoal } = profile;

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let bmiCategory = "";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 25) bmiCategory = "Normal";
  else if (bmi < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obese";

  let bmr: number;
  if (gender === "male") {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  const multipliers: Record<string, number> = {
    student: 1.375,
    office: 1.375,
    wfh: 1.2,
    active: 1.55,
    athlete: 1.725,
  };
  const tdee = bmr * (multipliers[lifestyle] ?? 1.375);

  let targetCalories: number;
  if (fitnessGoal === "weight_loss") targetCalories = tdee - 500;
  else if (fitnessGoal === "muscle_building") targetCalories = tdee + 300;
  else targetCalories = tdee;
  targetCalories = Math.max(targetCalories, 1200);

  const proteinMultiplier =
    fitnessGoal === "weight_loss"
      ? 1.6
      : fitnessGoal === "muscle_building"
        ? 2.0
        : 1.2;
  const protein = weight * proteinMultiplier;
  const fats = (targetCalories * 0.25) / 9;
  const carbs = Math.max((targetCalories - protein * 4 - fats * 9) / 4, 0);

  const fiber = gender === "male" ? 38 : 25;
  const waterLiters = weight * 0.033;
  const waterGlasses = Math.round(waterLiters / 0.25);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
    fiber,
    waterLiters: Math.round(waterLiters * 10) / 10,
    waterGlasses,
  };
}

export function getFitnessLevel(
  profile: UserProfile,
  bmi: number,
): DifficultyLevel {
  if (profile.lifestyle === "athlete") return "Advanced";
  if (profile.lifestyle === "active" && profile.age < 50) return "Intermediate";
  if (profile.age > 60 || bmi > 30) return "Beginner";
  return "Beginner";
}

export function getDumbbellWeight(level: DifficultyLevel): string {
  if (level === "Beginner") return "2–5 kg";
  if (level === "Intermediate") return "5–10 kg";
  return "10–20 kg";
}

export function getSafeBodyWeightTarget(profile: UserProfile): {
  min: number;
  max: number;
} {
  const heightM = profile.height / 100;
  return {
    min: Math.round(18.5 * heightM * heightM),
    max: Math.round(24.9 * heightM * heightM),
  };
}

export function getBmiColor(bmi: number): string {
  if (bmi < 18.5) return "#3AA0FF";
  if (bmi < 25) return "#22c55e";
  if (bmi < 30) return "#FF7A1A";
  return "#ef4444";
}
