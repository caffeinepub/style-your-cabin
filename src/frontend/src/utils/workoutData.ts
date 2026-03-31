import type { Exercise } from "../types";

export const EXERCISE_DB: Record<string, Exercise[]> = {
  abs: [
    {
      name: "Crunches",
      muscleGroup: "Abs",
      sets: 3,
      reps: "15–20",
      restSeconds: 30,
      difficulty: "Beginner",
      emoji: "🔥",
    },
    {
      name: "Leg Raises",
      muscleGroup: "Abs",
      sets: 3,
      reps: "12–15",
      restSeconds: 30,
      difficulty: "Intermediate",
      emoji: "🦵",
    },
    {
      name: "Plank",
      muscleGroup: "Abs",
      sets: 3,
      reps: "30–45 sec",
      restSeconds: 45,
      difficulty: "Beginner",
      emoji: "⚡",
    },
  ],
  arms: [
    {
      name: "Dumbbell Curl",
      muscleGroup: "Arms",
      sets: 3,
      reps: "12–15",
      restSeconds: 45,
      difficulty: "Beginner",
      emoji: "💪",
    },
    {
      name: "Hammer Curl",
      muscleGroup: "Arms",
      sets: 3,
      reps: "10–12",
      restSeconds: 45,
      difficulty: "Intermediate",
      emoji: "🔨",
    },
    {
      name: "Tricep Dips",
      muscleGroup: "Arms",
      sets: 3,
      reps: "12–15",
      restSeconds: 30,
      difficulty: "Beginner",
      emoji: "🪑",
    },
    {
      name: "Overhead Extension",
      muscleGroup: "Arms",
      sets: 3,
      reps: "10–12",
      restSeconds: 45,
      difficulty: "Intermediate",
      emoji: "⬆️",
    },
  ],
  chest: [
    {
      name: "Push-ups",
      muscleGroup: "Chest",
      sets: 3,
      reps: "15–20",
      restSeconds: 30,
      difficulty: "Beginner",
      emoji: "🏋️",
    },
    {
      name: "Bench Press",
      muscleGroup: "Chest",
      sets: 3,
      reps: "10–12",
      restSeconds: 60,
      difficulty: "Intermediate",
      emoji: "⚖️",
    },
  ],
  shoulders: [
    {
      name: "Shoulder Press",
      muscleGroup: "Shoulders",
      sets: 3,
      reps: "12–15",
      restSeconds: 45,
      difficulty: "Intermediate",
      emoji: "🎯",
    },
    {
      name: "Lateral Raises",
      muscleGroup: "Shoulders",
      sets: 3,
      reps: "15–20",
      restSeconds: 30,
      difficulty: "Beginner",
      emoji: "↔️",
    },
  ],
  legs: [
    {
      name: "Squats",
      muscleGroup: "Legs",
      sets: 3,
      reps: "15–20",
      restSeconds: 45,
      difficulty: "Beginner",
      emoji: "🦵",
    },
    {
      name: "Lunges",
      muscleGroup: "Legs",
      sets: 3,
      reps: "12–15 each",
      restSeconds: 30,
      difficulty: "Beginner",
      emoji: "🚶",
    },
  ],
  full_body: [
    {
      name: "Jumping Jacks",
      muscleGroup: "Full Body",
      sets: 3,
      reps: "20–30",
      restSeconds: 30,
      difficulty: "Beginner",
      emoji: "⭐",
    },
    {
      name: "Burpees",
      muscleGroup: "Full Body",
      sets: 3,
      reps: "10–15",
      restSeconds: 60,
      difficulty: "Advanced",
      emoji: "🔥",
    },
    {
      name: "Mountain Climbers",
      muscleGroup: "Full Body",
      sets: 3,
      reps: "20–30",
      restSeconds: 45,
      difficulty: "Intermediate",
      emoji: "⛰️",
    },
  ],
};

export function getExercisesForTargets(targets: string[]): Exercise[] {
  const result: Exercise[] = [];
  for (const t of targets) {
    const exercises = EXERCISE_DB[t];
    if (exercises) result.push(...exercises);
  }
  return result;
}

export const MUSCLE_LABELS: Record<string, string> = {
  abs: "Abs",
  arms: "Arms",
  chest: "Chest",
  shoulders: "Shoulders",
  legs: "Legs",
  full_body: "Full Body",
};
