import { AlertTriangle, CheckCircle, Dumbbell, Shield } from "lucide-react";
import { useState } from "react";
import type {
  DailyLog,
  HealthStats,
  MuscleTarget,
  UserProfile,
} from "../types";
import { getDumbbellWeight, getFitnessLevel } from "../utils/calculations";
import { EXERCISE_DB, MUSCLE_LABELS } from "../utils/workoutData";

interface Props {
  profile: UserProfile;
  stats: HealthStats;
  log: DailyLog;
  onUpdateLog: (log: DailyLog) => void;
}

const MUSCLE_ICONS: Record<string, string> = {
  abs: "🔥",
  biceps: "💪",
  triceps: "🔨",
  chest: "🏥",
  shoulders: "🏐",
  legs: "🦵",
  full_body: "⚡",
};

const DIFF_COLORS: Record<string, string> = {
  Beginner: "#22c55e",
  Intermediate: "#f59e0b",
  Advanced: "#ef4444",
};

const SAFETY_WARNINGS_BASE = [
  "Warm-up required before every session",
  "Stop immediately if you feel pain or discomfort",
];

export default function WorkoutTab({
  profile,
  stats,
  log,
  onUpdateLog,
}: Props) {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(
    profile.muscleTargets as string[],
  );
  const [completedToast, setCompletedToast] = useState("");

  const fitnessLevel = getFitnessLevel(profile, stats.bmi);
  const dumbbellWeight = getDumbbellWeight(fitnessLevel);
  const allMuscles = Object.keys(MUSCLE_LABELS) as MuscleTarget[];

  const toggleMuscle = (m: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };

  const exercises = selectedMuscles.flatMap((m) => EXERCISE_DB[m] ?? []);

  const markComplete = (exName: string) => {
    if (log.workoutsCompleted.includes(exName)) return;
    onUpdateLog({
      ...log,
      workoutsCompleted: [...log.workoutsCompleted, exName],
    });
    setCompletedToast(`${exName} completed!`);
    setTimeout(() => setCompletedToast(""), 2000);
  };

  const extraWarnings: string[] = [];
  if (profile.age > 60)
    extraWarnings.push("Consult a doctor before starting new exercises");
  if (stats.bmi > 30)
    extraWarnings.push(
      "Start with low-impact exercises to protect your joints",
    );
  if (profile.fitnessGoal === "muscle_building")
    extraWarnings.push("Start with light weight to build proper form");
  if (fitnessLevel === "Beginner")
    extraWarnings.push(
      "Start light weight — form is more important than weight",
    );

  const allWarnings = [...SAFETY_WARNINGS_BASE, ...extraWarnings];

  return (
    <div className="space-y-4">
      {completedToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#22c55e] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          ✓ {completedToast}
        </div>
      )}

      {/* Safety Warnings */}
      <div className="bg-[#141B20] border border-[#FF7A1A]/40 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-[#FF7A1A]" />
          <p className="text-xs font-semibold text-[#FF7A1A] uppercase tracking-wider">
            Safety System
          </p>
        </div>
        <div className="space-y-2">
          {allWarnings.map((w) => (
            <div key={w} className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF7A1A] mt-0.5 shrink-0" />
              <p className="text-[#F2F4F6] text-sm">{w}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Weight Suggestion */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Dumbbell className="w-5 h-5 text-[#FF7A1A]" />
          <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider">
            Smart Weight Suggestion
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-[#1A2228] rounded-xl p-4">
            <p className="text-[#9AA4AD] text-xs mb-1">Your Level</p>
            <p
              className="font-bold text-xl"
              style={{ color: DIFF_COLORS[fitnessLevel] }}
            >
              {fitnessLevel}
            </p>
          </div>
          <div className="flex-1 bg-[#1A2228] rounded-xl p-4">
            <p className="text-[#9AA4AD] text-xs mb-1">Safe Dumbbell Weight</p>
            <p className="font-bold text-xl text-[#FF7A1A]">{dumbbellWeight}</p>
          </div>
        </div>
        <p className="text-[#6F7A84] text-xs mt-3">
          Based on BMI ({stats.bmi}), age ({profile.age}), lifestyle (
          {profile.lifestyle})
        </p>
      </div>

      {/* Muscle Group Selector */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-3">
          Select Muscle Groups
        </p>
        <div className="flex flex-wrap gap-2">
          {allMuscles.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMuscle(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedMuscles.includes(m)
                  ? "bg-[#FF7A1A] text-white"
                  : "bg-[#1A2228] border border-[#263038] text-[#9AA4AD] hover:border-[#FF7A1A]/50"
              }`}
            >
              <span>{MUSCLE_ICONS[m]}</span>
              <span>{MUSCLE_LABELS[m]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards */}
      {exercises.length === 0 ? (
        <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-8 text-center">
          <p className="text-[#9AA4AD]">
            Select muscle groups above to generate your workout
          </p>
        </div>
      ) : (
        <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider">
              Your Workout Plan ({exercises.length} exercises)
            </p>
            <p className="text-[#FF7A1A] text-sm font-medium">
              {log.workoutsCompleted.length}/{exercises.length} done
            </p>
          </div>
          <div className="space-y-3">
            {exercises.map((ex) => {
              const done = log.workoutsCompleted.includes(ex.name);
              return (
                <div
                  key={`${ex.name}-${ex.muscleGroup}`}
                  className={`border rounded-xl p-4 transition-all ${
                    done
                      ? "border-[#22c55e]/40 bg-[#22c55e]/5"
                      : "border-[#263038] bg-[#1A2228]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{ex.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[#F2F4F6] font-bold">{ex.name}</h3>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${DIFF_COLORS[ex.difficulty]}20`,
                            color: DIFF_COLORS[ex.difficulty],
                          }}
                        >
                          {ex.difficulty}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#263038] text-[#9AA4AD]">
                          {ex.muscleGroup}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-[#FF7A1A] text-sm font-semibold">
                          {ex.sets} Sets
                        </span>
                        <span className="text-[#9AA4AD] text-sm">
                          × {ex.reps} Reps
                        </span>
                        <span className="text-[#9AA4AD] text-sm">
                          🕒 {ex.restSeconds}s rest
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => markComplete(ex.name)}
                      className={`shrink-0 transition-all ${done ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
                    >
                      <CheckCircle
                        className={`w-6 h-6 ${done ? "text-[#22c55e]" : "text-[#263038]"}`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateLog({
                ...log,
                workoutsCompleted: exercises.map((e) => e.name),
              })
            }
            className="mt-4 w-full bg-[#FF7A1A] hover:bg-[#D85F16] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Mark All Complete ★
          </button>
        </div>
      )}

      {/* Home Workout Suggestions */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-4">
          🏠 Home Workout Suggestions
        </p>
        <div className="space-y-2">
          {[
            {
              name: "7-Minute HIIT",
              desc: "No equipment needed, full body burn",
              icon: "🔥",
            },
            {
              name: "Morning Stretch Routine",
              desc: "10 min, flexibility & posture",
              icon: "🧘",
            },
            {
              name: "Bodyweight Circuit",
              desc: "Push-ups, Squats, Lunges, Planks",
              icon: "💪",
            },
            {
              name: "Yoga Flow",
              desc: "20 min, low impact, stress relief",
              icon: "🥏",
            },
          ].map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 p-3 bg-[#1A2228] rounded-xl"
            >
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-[#F2F4F6] font-medium text-sm">{s.name}</p>
                <p className="text-[#9AA4AD] text-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
