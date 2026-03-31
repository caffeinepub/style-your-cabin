import { useCallback, useEffect, useRef, useState } from "react";
import type { UserProfile } from "../types";
import { EXERCISE_DB, MUSCLE_LABELS } from "../utils/workoutData";
import AvatarTrainer from "./AvatarTrainer";

interface Props {
  profile: UserProfile;
}

const MUSCLE_ICONS: Record<string, string> = {
  abs: "🔥",
  arms: "💪",
  chest: "🏋️",
  shoulders: "🎯",
  legs: "🦵",
  full_body: "⚡",
};

const EXERCISE_DURATION = 30;
const REST_DURATION = 10;

export default function AvatarPage({ profile }: Props) {
  const allMuscles = Object.keys(MUSCLE_LABELS);
  const [selectedMuscle, setSelectedMuscle] = useState(
    profile.muscleTargets[0] ?? "full_body",
  );
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION);
  const [isResting, setIsResting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [speed, setSpeed] = useState(1);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exercises = EXERCISE_DB[selectedMuscle] ?? [];
  const currentExercise = exercises[exerciseIdx];

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advanceExercise = useCallback(() => {
    setExerciseIdx((prev) => {
      const next = prev + 1;
      if (next >= exercises.length) {
        setRound((r) => r + 1);
        return 0;
      }
      return next;
    });
  }, [exercises.length]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (isResting) {
            setIsResting(false);
            advanceExercise();
            return EXERCISE_DURATION;
          }
          setIsResting(true);
          return REST_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [isRunning, isResting, advanceExercise, stopTimer]);

  const handleMuscleChange = (m: string) => {
    stopTimer();
    setSelectedMuscle(
      m as "abs" | "arms" | "chest" | "shoulders" | "legs" | "full_body",
    );
    setExerciseIdx(0);
    setTimeLeft(EXERCISE_DURATION);
    setIsResting(false);
    setIsRunning(false);
    setRound(1);
  };

  const handlePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    stopTimer();
    setIsRunning(false);
    setExerciseIdx(0);
    setTimeLeft(EXERCISE_DURATION);
    setIsResting(false);
    setRound(1);
  };

  const totalDuration = isResting ? REST_DURATION : EXERCISE_DURATION;
  const progressPct = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <h2 className="text-[#F2F4F6] font-bold text-xl mb-1">
          🏃 <span className="text-[#FF7A1A]">Stickman Trainer</span>
        </h2>
        <p className="text-[#9AA4AD] text-sm">
          Select a muscle group and hit Play to start your auto-routine.
        </p>
      </div>

      {/* Muscle group selector */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-3">
          Muscle Group
        </p>
        <div className="flex flex-wrap gap-2">
          {allMuscles.map((m) => (
            <button
              key={m}
              type="button"
              data-ocid="avatar.tab"
              onClick={() => handleMuscleChange(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedMuscle === m
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

      {/* Main workout area */}
      {currentExercise && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left: Exercise list + speed control */}
          <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-4 md:col-span-1">
            <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-3">
              Exercises
            </p>
            <div className="space-y-2">
              {exercises.map((ex, idx) => (
                <button
                  key={ex.name}
                  type="button"
                  data-ocid={`avatar.item.${idx + 1}`}
                  onClick={() => {
                    handleReset();
                    setExerciseIdx(idx);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                    idx === exerciseIdx
                      ? "bg-[#FF7A1A]/15 border border-[#FF7A1A]/60 text-[#FF7A1A]"
                      : "bg-[#1A2228] border border-transparent text-[#9AA4AD] hover:border-[#263038]"
                  }`}
                >
                  <span className="text-base">{ex.emoji}</span>
                  <span className="font-medium">{ex.name}</span>
                  {idx === exerciseIdx && !isResting && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#FF7A1A] animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Speed control */}
            <div className="mt-4 pt-4 border-t border-[#263038]">
              <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-2">
                Speed:{" "}
                {speed === 0.5 ? "Slow" : speed === 1 ? "Normal" : "Fast"}
              </p>
              <div className="flex gap-2">
                {([0.5, 1, 1.8] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-ocid="avatar.toggle"
                    onClick={() => setSpeed(s)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      speed === s
                        ? "bg-[#FF7A1A] text-white"
                        : "bg-[#1A2228] border border-[#263038] text-[#9AA4AD] hover:border-[#FF7A1A]/40"
                    }`}
                  >
                    {s === 0.5 ? "🐢 Slow" : s === 1 ? "🚶 Normal" : "🔥 Fast"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Avatar + timer */}
          <div className="md:col-span-2 space-y-4">
            {/* Timer */}
            <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p
                      className="font-bold tabular-nums leading-none"
                      style={{
                        fontSize: 36,
                        color: isResting ? "#9AA4AD" : "#FF7A1A",
                      }}
                    >
                      {String(timeLeft).padStart(2, "0")}
                    </p>
                    <p className="text-[#9AA4AD] text-xs mt-0.5">
                      {isResting ? "REST" : "SEC"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#F2F4F6] font-semibold text-sm">
                      {isResting ? "Rest Period" : currentExercise.name}
                    </p>
                    <p className="text-[#9AA4AD] text-xs">
                      Round {round} &middot;{" "}
                      {isResting
                        ? `Next: ${exercises[(exerciseIdx + 1) % exercises.length]?.name}`
                        : `${currentExercise.sets} sets · ${currentExercise.reps}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-ocid="avatar.primary_button"
                    onClick={handlePlayPause}
                    className="flex items-center gap-1.5 bg-[#FF7A1A] hover:bg-[#D85F16] text-white font-bold px-4 py-2 rounded-full transition-colors text-sm"
                  >
                    {isRunning ? "Pause" : "Play"}
                  </button>
                  <button
                    type="button"
                    data-ocid="avatar.secondary_button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 bg-[#1A2228] border border-[#263038] hover:border-[#FF7A1A]/40 text-[#9AA4AD] font-medium px-3 py-2 rounded-full transition-colors text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="w-full bg-[#1A2228] rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${progressPct}%`,
                    background: isResting
                      ? "linear-gradient(90deg, #263038, #9AA4AD)"
                      : "linear-gradient(90deg, #FF7A1A, #FFB366)",
                  }}
                />
              </div>
            </div>

            {/* Avatar */}
            <div className="bg-[#141B20] border border-[#FF7A1A]/20 rounded-2xl p-5">
              <AvatarTrainer
                muscleGroup={selectedMuscle}
                exerciseName={currentExercise.name}
                isResting={isResting}
                speed={speed}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Sets", value: `${currentExercise.sets}`, icon: "🔄" },
                { label: "Reps", value: currentExercise.reps, icon: "📊" },
                {
                  label: "Rest",
                  value: `${currentExercise.restSeconds}s`,
                  icon: "⏱️",
                },
              ].map((d) => (
                <div
                  key={d.label}
                  className="bg-[#141B20] border border-[#263038] rounded-xl p-3 text-center"
                >
                  <p className="text-xl mb-1">{d.icon}</p>
                  <p className="text-[#FF7A1A] font-bold text-lg">{d.value}</p>
                  <p className="text-[#9AA4AD] text-xs">{d.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
