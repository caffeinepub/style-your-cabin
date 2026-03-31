import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Target,
  User,
} from "lucide-react";
import { useState } from "react";
import type {
  FitnessGoal,
  Gender,
  Lifestyle,
  MuscleTarget,
  UserProfile,
} from "../types";
import {
  calculateHealthStats,
  getSafeBodyWeightTarget,
} from "../utils/calculations";

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const LIFESTYLE_OPTIONS: { value: Lifestyle; label: string; icon: string }[] = [
  { value: "student", label: "Student", icon: "🎓" },
  { value: "wfh", label: "Work From Home", icon: "🏠" },
  { value: "office", label: "Office Worker", icon: "🏢" },
  { value: "active", label: "Active Job", icon: "🚴" },
  { value: "athlete", label: "Athlete", icon: "🏆" },
];

const GOAL_OPTIONS: {
  value: FitnessGoal;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    value: "weight_loss",
    label: "Weight Loss",
    icon: "🔥",
    desc: "Burn fat, lean down",
  },
  {
    value: "muscle_building",
    label: "Muscle Building",
    icon: "💪",
    desc: "Build strength & mass",
  },
  {
    value: "maintain",
    label: "Maintain Fitness",
    icon: "⚙️",
    desc: "Stay healthy & fit",
  },
];

const MUSCLE_OPTIONS: { value: MuscleTarget; label: string; icon: string }[] = [
  { value: "abs", label: "Abs", icon: "🔥" },
  { value: "biceps", label: "Biceps", icon: "💪" },
  { value: "triceps", label: "Triceps", icon: "🔨" },
  { value: "chest", label: "Chest", icon: "🏥" },
  { value: "shoulders", label: "Shoulders", icon: "🏐" },
  { value: "legs", label: "Legs", icon: "🦵" },
  { value: "full_body", label: "Full Body", icon: "⚡" },
];

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [lifestyle, setLifestyle] = useState<Lifestyle>("student");
  const [goal, setGoal] = useState<FitnessGoal>("maintain");
  const [muscles, setMuscles] = useState<MuscleTarget[]>(["full_body"]);

  const toggleMuscle = (m: MuscleTarget) => {
    setMuscles((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };

  const buildProfile = (): UserProfile => ({
    age: Number(age),
    weight: Number(weight),
    height: Number(height),
    gender,
    lifestyle,
    fitnessGoal: goal,
    muscleTargets: muscles.length > 0 ? muscles : ["full_body"],
  });

  const stats =
    step === 4 && age && weight && height
      ? calculateHealthStats(buildProfile())
      : null;
  const safeWeight =
    step === 4 && age && weight && height
      ? getSafeBodyWeightTarget(buildProfile())
      : null;

  const canNext1 =
    age &&
    weight &&
    height &&
    Number(age) > 5 &&
    Number(weight) > 20 &&
    Number(height) > 100;

  const handleFinish = () => {
    if (!canNext1) return;
    onComplete(buildProfile());
  };

  return (
    <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#FF7A1A] rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-[#FF7A1A] uppercase tracking-wide">
              FitAI
            </span>
          </div>
          <p className="text-[#9AA4AD] text-sm">
            Your AI-Powered Fitness Coach
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  s <= step ? "bg-[#FF7A1A]" : "bg-[#263038]"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-6 shadow-2xl">
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-[#FF7A1A]/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-[#FF7A1A]" />
                </div>
                <div>
                  <h2 className="text-[#F2F4F6] font-bold text-lg">
                    Personal Info
                  </h2>
                  <p className="text-[#9AA4AD] text-xs">Step 1 of 4</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    gender === "male"
                      ? "border-[#FF7A1A] bg-[#FF7A1A]/10"
                      : "border-[#263038] bg-[#1A2228]"
                  }`}
                >
                  <div className="text-2xl mb-1">👦</div>
                  <div className="text-[#F2F4F6] font-medium">Male</div>
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    gender === "female"
                      ? "border-[#FF7A1A] bg-[#FF7A1A]/10"
                      : "border-[#263038] bg-[#1A2228]"
                  }`}
                >
                  <div className="text-2xl mb-1">👧</div>
                  <div className="text-[#F2F4F6] font-medium">Female</div>
                </button>
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-2"
                >
                  Age (years)
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full bg-[#1A2228] border border-[#263038] rounded-xl px-4 py-3 text-[#F2F4F6] placeholder-[#6F7A84] focus:outline-none focus:border-[#FF7A1A] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="weight"
                    className="block text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-2"
                  >
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full bg-[#1A2228] border border-[#263038] rounded-xl px-4 py-3 text-[#F2F4F6] placeholder-[#6F7A84] focus:outline-none focus:border-[#FF7A1A] transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="height"
                    className="block text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-2"
                  >
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full bg-[#1A2228] border border-[#263038] rounded-xl px-4 py-3 text-[#F2F4F6] placeholder-[#6F7A84] focus:outline-none focus:border-[#FF7A1A] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-[#FF7A1A]/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#FF7A1A]" />
                </div>
                <div>
                  <h2 className="text-[#F2F4F6] font-bold text-lg">
                    Your Lifestyle
                  </h2>
                  <p className="text-[#9AA4AD] text-xs">Step 2 of 4</p>
                </div>
              </div>
              {LIFESTYLE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setLifestyle(opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    lifestyle === opt.value
                      ? "border-[#FF7A1A] bg-[#FF7A1A]/10"
                      : "border-[#263038] bg-[#1A2228] hover:border-[#FF7A1A]/40"
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-[#F2F4F6] font-medium">
                    {opt.label}
                  </span>
                  {lifestyle === opt.value && (
                    <div className="ml-auto w-5 h-5 bg-[#FF7A1A] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-[#FF7A1A]/20 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#FF7A1A]" />
                </div>
                <div>
                  <h2 className="text-[#F2F4F6] font-bold text-lg">
                    Goals & Targets
                  </h2>
                  <p className="text-[#9AA4AD] text-xs">Step 3 of 4</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-3">
                  Fitness Goal
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {GOAL_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setGoal(opt.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        goal === opt.value
                          ? "border-[#FF7A1A] bg-[#FF7A1A]/10"
                          : "border-[#263038] bg-[#1A2228] hover:border-[#FF7A1A]/40"
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-[#F2F4F6] text-xs font-medium text-center leading-tight">
                        {opt.label}
                      </span>
                      <span className="text-[#9AA4AD] text-xs text-center leading-tight hidden sm:block">
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-3">
                  Muscle Targets (multi-select)
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {MUSCLE_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => toggleMuscle(opt.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                        muscles.includes(opt.value)
                          ? "border-[#FF7A1A] bg-[#FF7A1A]/10"
                          : "border-[#263038] bg-[#1A2228] hover:border-[#FF7A1A]/40"
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-[#F2F4F6] text-xs font-medium">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && stats && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-[#FF7A1A]/20 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-[#FF7A1A]" />
                </div>
                <div>
                  <h2 className="text-[#F2F4F6] font-bold text-lg">
                    Your Health Summary
                  </h2>
                  <p className="text-[#9AA4AD] text-xs">Step 4 of 4</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "BMI",
                    value: `${stats.bmi}`,
                    sub: stats.bmiCategory,
                  },
                  { label: "BMR", value: `${stats.bmr}`, sub: "kcal base" },
                  {
                    label: "Daily Calories",
                    value: `${stats.targetCalories}`,
                    sub: "kcal target",
                  },
                  {
                    label: "Water Intake",
                    value: `${stats.waterGlasses} glasses`,
                    sub: `${stats.waterLiters}L daily`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#1A2228] border border-[#263038] rounded-xl p-4"
                  >
                    <p className="text-xs text-[#9AA4AD] uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-xl font-bold text-[#FF7A1A]">
                      {item.value}
                    </p>
                    <p className="text-xs text-[#6F7A84]">{item.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#1A2228] border border-[#263038] rounded-xl p-4">
                <p className="text-xs text-[#9AA4AD] uppercase tracking-wider mb-3">
                  Daily Macros
                </p>
                <div className="flex gap-4">
                  {[
                    {
                      label: "Protein",
                      value: `${stats.protein}g`,
                      color: "#FF7A1A",
                    },
                    {
                      label: "Carbs",
                      value: `${stats.carbs}g`,
                      color: "#3AA0FF",
                    },
                    {
                      label: "Fats",
                      value: `${stats.fats}g`,
                      color: "#22c55e",
                    },
                    {
                      label: "Fiber",
                      value: `${stats.fiber}g`,
                      color: "#a855f7",
                    },
                  ].map((m) => (
                    <div key={m.label} className="flex-1 text-center">
                      <p
                        className="text-lg font-bold"
                        style={{ color: m.color }}
                      >
                        {m.value}
                      </p>
                      <p className="text-xs text-[#9AA4AD]">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {safeWeight && (
                <div className="bg-[#1A2228] border border-[#263038] rounded-xl p-4">
                  <p className="text-xs text-[#9AA4AD] uppercase tracking-wider mb-1">
                    Safe Weight Range
                  </p>
                  <p className="text-[#F2F4F6]">
                    <span className="text-[#FF7A1A] font-bold">
                      {safeWeight.min}–{safeWeight.max} kg
                    </span>
                    <span className="text-[#9AA4AD] text-sm ml-2">
                      (Healthy BMI range)
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-5 py-3 bg-[#1A2228] border border-[#263038] rounded-full text-[#F2F4F6] font-medium hover:border-[#FF7A1A]/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !canNext1}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#FF7A1A] hover:bg-[#D85F16] disabled:bg-[#263038] disabled:text-[#6F7A84] rounded-full text-white font-bold transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#FF7A1A] hover:bg-[#D85F16] rounded-full text-white font-bold transition-colors"
              >
                Start My Journey 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
