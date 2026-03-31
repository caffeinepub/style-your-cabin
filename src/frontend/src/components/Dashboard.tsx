import {
  AlertTriangle,
  CheckCircle,
  Droplets,
  Lightbulb,
  Plus,
  Volume2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type {
  DailyLog,
  Exercise,
  HealthStats,
  Meal,
  UserProfile,
} from "../types";
import { CircularProgress } from "./CircularProgress";

interface Props {
  profile: UserProfile;
  stats: HealthStats;
  log: DailyLog;
  meals: Meal[];
  exercises: Exercise[];
  onUpdateLog: (log: DailyLog) => void;
  onTabChange: (tab: string) => void;
}

const AI_TIPS: Record<string, string> = {
  weight_loss:
    "Eating protein with every meal helps preserve muscle while losing fat.",
  muscle_building:
    "Compound lifts like squats and deadlifts stimulate the most muscle growth.",
  maintain:
    "Consistency beats perfection — even 20 mins of movement daily makes a difference.",
};

const MOTIVATION_MSGS = [
  "Keep going! You're crushing it! 💪",
  "You're getting stronger every rep!",
  "Don't quit today — your future self will thank you!",
  "Push through! Champions are made here! 🏆",
  "Every rep counts. Every drop of sweat matters!",
];

export default function Dashboard({
  profile,
  stats,
  log,
  meals,
  exercises,
  onUpdateLog,
  onTabChange,
}: Props) {
  const [showWaterToast, setShowWaterToast] = useState(false);
  const [lastMotivation, setLastMotivation] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const addWater = () => {
    if (log.waterGlasses < stats.waterGlasses + 2) {
      onUpdateLog({ ...log, waterGlasses: log.waterGlasses + 1 });
      setShowWaterToast(true);
      setTimeout(() => setShowWaterToast(false), 2000);
    }
  };

  const speakMotivation = () => {
    if (!window.speechSynthesis) return;
    const msg =
      MOTIVATION_MSGS[Math.floor(Math.random() * MOTIVATION_MSGS.length)];
    setLastMotivation(msg);
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(msg);
    utt.rate = 0.95;
    utt.pitch = 1.1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const goalLabel =
    profile.fitnessGoal === "weight_loss"
      ? "Weight Loss"
      : profile.fitnessGoal === "muscle_building"
        ? "Muscle Building"
        : "Maintain Fitness";

  return (
    <div className="space-y-4">
      {showWaterToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#3AA0FF] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-fade-in">
          💧 Water logged!
        </div>
      )}

      {/* Welcome */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <h2 className="text-[#F2F4F6] text-xl font-bold mb-1">
          Welcome to <span className="text-[#FF7A1A]">Spark Fit!</span>
        </h2>
        <p className="text-[#9AA4AD] text-sm mb-4">
          Goal: {goalLabel} •{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-[#FF7A1A]/10 border border-[#FF7A1A]/30 rounded-full px-3 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF7A1A]" />
            <span className="text-[#FF7A1A] text-xs font-semibold">
              SAFETY:
            </span>
            <span className="text-[#F2F4F6] text-xs">
              Warm-up required before exercise
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#3AA0FF]/10 border border-[#3AA0FF]/30 rounded-full px-3 py-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-[#3AA0FF]" />
            <span className="text-[#3AA0FF] text-xs font-semibold">
              AI TIP:
            </span>
            <span className="text-[#F2F4F6] text-xs">
              {AI_TIPS[profile.fitnessGoal]}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Coach Card */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#FF7A1A]/20 rounded-full flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <p className="text-[#F2F4F6] font-semibold">
              Voice Motivation Coach
            </p>
            <p className="text-[#9AA4AD] text-xs">
              Your personal AI pep-talk machine
            </p>
          </div>
        </div>
        <button
          type="button"
          data-ocid="dashboard.primary_button"
          onClick={speakMotivation}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            speaking
              ? "bg-[#FF7A1A]/30 border border-[#FF7A1A] text-[#FF7A1A]"
              : "bg-[#FF7A1A] hover:bg-[#D85F16] text-white"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          {speaking ? "Speaking..." : "💪 Motivate Me!"}
        </button>
        {lastMotivation && (
          <div className="mt-3 bg-[#1A2228] border border-[#FF7A1A]/20 rounded-xl px-4 py-3">
            <p className="text-[#F2F4F6] text-sm italic">“{lastMotivation}”</p>
          </div>
        )}
      </div>

      {/* Progress Rings */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-4">
          Daily Goal Progress
        </p>
        <div className="grid grid-cols-3 gap-4">
          <CircularProgress
            value={log.totalCaloriesConsumed}
            max={stats.targetCalories}
            label="Calories"
            sublabel={`${log.totalCaloriesConsumed}/${stats.targetCalories} kcal`}
            color="#FF7A1A"
          />
          <CircularProgress
            value={log.totalProteinConsumed}
            max={stats.protein}
            label="Protein"
            sublabel={`${log.totalProteinConsumed}/${stats.protein}g`}
            color="#3AA0FF"
          />
          <CircularProgress
            value={log.waterGlasses}
            max={stats.waterGlasses}
            label="Water"
            sublabel={`${log.waterGlasses}/${stats.waterGlasses} glasses`}
            color="#22c55e"
          />
        </div>
      </div>

      {/* Water Tracker */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#3AA0FF]" />
            <span className="text-[#F2F4F6] font-semibold">Water Tracker</span>
          </div>
          <button
            type="button"
            data-ocid="dashboard.secondary_button"
            onClick={addWater}
            className="flex items-center gap-1.5 bg-[#3AA0FF]/20 hover:bg-[#3AA0FF]/30 border border-[#3AA0FF]/40 text-[#3AA0FF] rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Glass
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: stats.waterGlasses }).map((_, i) => (
            <div
              key={`water-${i}-${stats.waterGlasses}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                i < log.waterGlasses
                  ? "bg-[#3AA0FF] text-white"
                  : "bg-[#1A2228] border border-[#263038] text-[#6F7A84]"
              }`}
            >
              💧
            </div>
          ))}
        </div>
        <p className="text-[#9AA4AD] text-xs mt-2">
          Target: {stats.waterLiters}L ({stats.waterGlasses} glasses) based on
          your {profile.weight}kg weight
        </p>
      </div>

      {/* Workout Completion */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FF7A1A]" />
            <span className="text-[#F2F4F6] font-semibold">
              Today's Workout
            </span>
          </div>
          <button
            type="button"
            data-ocid="dashboard.workout.link"
            onClick={() => onTabChange("workout")}
            className="text-[#FF7A1A] text-xs font-medium hover:underline"
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {exercises.slice(0, 3).map((ex) => (
            <div
              key={ex.name}
              className="flex items-center gap-3 p-3 bg-[#1A2228] rounded-xl"
            >
              <span className="text-xl">{ex.emoji}</span>
              <div className="flex-1">
                <p className="text-[#F2F4F6] font-medium text-sm">{ex.name}</p>
                <p className="text-[#9AA4AD] text-xs">
                  {ex.sets} sets × {ex.reps} • {ex.muscleGroup}
                </p>
              </div>
              {log.workoutsCompleted.includes(ex.name) ? (
                <CheckCircle className="w-5 h-5 text-[#22c55e]" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#263038]" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[#9AA4AD] text-xs">
            {log.workoutsCompleted.length}/{exercises.length} completed
          </p>
          <div className="flex-1 mx-3 h-1.5 bg-[#263038] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF7A1A] rounded-full transition-all"
              style={{
                width: `${exercises.length > 0 ? (log.workoutsCompleted.length / exercises.length) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-[#FF7A1A] text-xs font-semibold">
            {exercises.length > 0
              ? Math.round(
                  (log.workoutsCompleted.length / exercises.length) * 100,
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Today's Meals Summary */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider">
            Today's Meals
          </p>
          <button
            type="button"
            data-ocid="dashboard.nutrition.link"
            onClick={() => onTabChange("nutrition")}
            className="text-[#FF7A1A] text-xs font-medium hover:underline"
          >
            View Plan
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-[#1A2228] border border-[#263038] rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">
                  {meal.type === "breakfast"
                    ? "🌃"
                    : meal.type === "lunch"
                      ? "☀️"
                      : meal.type === "dinner"
                        ? "🌙"
                        : "🍎"}
                </span>
                <span className="text-[#F2F4F6] text-sm font-medium capitalize">
                  {meal.type}
                </span>
                {log.mealsConsumed.includes(meal.id) && (
                  <CheckCircle className="w-4 h-4 text-[#22c55e] ml-auto" />
                )}
              </div>
              <p className="text-[#FF7A1A] font-bold text-sm">
                {meal.calories} kcal
              </p>
              <p className="text-[#9AA4AD] text-xs">
                P: {meal.protein}g • C: {meal.carbs}g
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Health Stats */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-4">
          Health Stats
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "BMI",
              value: String(stats.bmi),
              sub: stats.bmiCategory,
              icon: "📊",
            },
            {
              label: "BMR",
              value: `${stats.bmr}`,
              sub: "kcal base",
              icon: "🔥",
            },
            {
              label: "TDEE",
              value: `${stats.tdee}`,
              sub: "kcal maintenance",
              icon: "⚡",
            },
            {
              label: "Protein",
              value: `${stats.protein}g`,
              sub: "daily target",
              icon: "💪",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#1A2228] rounded-xl p-3 text-center"
            >
              <p className="text-lg mb-0.5">{s.icon}</p>
              <p className="text-[#FF7A1A] font-bold text-lg">{s.value}</p>
              <p className="text-[#9AA4AD] text-xs">{s.label}</p>
              <p className="text-[#6F7A84] text-xs">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Macros */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-4">
          Daily Macro Targets
        </p>
        <div className="space-y-3">
          {[
            {
              label: "Protein",
              value: stats.protein,
              unit: "g",
              color: "#FF7A1A",
            },
            {
              label: "Carbohydrates",
              value: stats.carbs,
              unit: "g",
              color: "#3AA0FF",
            },
            { label: "Fats", value: stats.fats, unit: "g", color: "#22c55e" },
            { label: "Fiber", value: stats.fiber, unit: "g", color: "#a855f7" },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between mb-1">
                <span className="text-[#F2F4F6] text-sm">{m.label}</span>
                <span className="text-[#9AA4AD] text-sm">
                  {m.value}
                  {m.unit}
                </span>
              </div>
              <div className="h-2 bg-[#263038] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "100%",
                    backgroundColor: m.color,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
