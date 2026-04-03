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

const MOTIVATIONS = [
  "Keep going 💪",
  "Don't stop now!",
  "You're doing great!",
  "Push harder 🔥",
];

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
  const [motivationIdx, setMotivationIdx] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const motivationRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  // Rotate motivation text every 5s when running and not resting
  useEffect(() => {
    if (!isRunning || isResting) {
      if (motivationRef.current) {
        clearInterval(motivationRef.current);
        motivationRef.current = null;
      }
      return;
    }
    motivationRef.current = setInterval(() => {
      setMotivationIdx((prev) => (prev + 1) % MOTIVATIONS.length);
    }, 5000);
    return () => {
      if (motivationRef.current) {
        clearInterval(motivationRef.current);
        motivationRef.current = null;
      }
    };
  }, [isRunning, isResting]);

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
          🏋️ <span className="text-[#FF7A1A]">AI Trainer</span>
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
        <>
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
                      {s === 0.5
                        ? "🐢 Slow"
                        : s === 1
                          ? "🚶 Normal"
                          : "🔥 Fast"}
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

              {/* Motivational text card */}
              {isRunning && !isResting && (
                <div
                  className="rounded-2xl p-3 text-center border border-[#FF7A1A]/25 bg-[#141B20]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(20,27,32,1) 0%, rgba(30,20,10,0.7) 100%)",
                  }}
                >
                  <p
                    className="font-bold text-sm tracking-wide"
                    style={{
                      background: "linear-gradient(90deg, #FF7A1A, #FFB366)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {MOTIVATIONS[motivationIdx]}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Sets",
                    value: `${currentExercise.sets}`,
                    icon: "🔄",
                  },
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
                    <p className="text-[#FF7A1A] font-bold text-lg">
                      {d.value}
                    </p>
                    <p className="text-[#9AA4AD] text-xs">{d.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Before / After comparison panel */}
          <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
            <h3 className="text-[#F2F4F6] font-bold text-base mb-1">
              Before &amp; After Progress
            </h3>
            <p className="text-[#9AA4AD] text-xs mb-4">
              Body shape updates as you log daily weight and measurements
            </p>
            <div className="flex gap-4 justify-center">
              {/* Before silhouette */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="rounded-xl overflow-hidden border border-[#263038] p-3"
                  style={{ background: "#0F161A" }}
                >
                  <svg
                    width="88"
                    height="160"
                    viewBox="0 0 88 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Before body silhouette side profile"
                  >
                    {/* Before — slightly heavier side silhouette */}
                    {/* Head */}
                    <ellipse
                      cx="62"
                      cy="22"
                      rx="14"
                      ry="16"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.5"
                    />
                    {/* Neck */}
                    <rect
                      x="52"
                      y="36"
                      width="9"
                      height="10"
                      rx="3"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.2"
                    />
                    {/* Torso (wider — before) */}
                    <path
                      d="M28 48 Q22 52 22 72 Q22 92 30 96 L56 96 Q64 92 66 72 Q68 52 60 48 Z"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.5"
                    />
                    {/* Back arm */}
                    <path
                      d="M28 50 Q16 62 18 80 Q19 86 24 86"
                      stroke="#FF7A1A"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.5"
                    />
                    {/* Front arm */}
                    <path
                      d="M58 50 Q70 62 68 80 Q67 86 62 86"
                      stroke="#FF7A1A"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.8"
                    />
                    {/* Hips (wider) */}
                    <ellipse
                      cx="44"
                      cy="97"
                      rx="22"
                      ry="9"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.2"
                    />
                    {/* Back leg */}
                    <path
                      d="M32 106 Q28 120 30 138 Q31 146 34 148"
                      stroke="#FF7A1A"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.5"
                    />
                    {/* Front leg */}
                    <path
                      d="M52 106 Q56 120 54 138 Q53 146 50 148"
                      stroke="#FF7A1A"
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.85"
                    />
                    {/* Feet */}
                    <ellipse
                      cx="36"
                      cy="150"
                      rx="9"
                      ry="4"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <ellipse
                      cx="52"
                      cy="150"
                      rx="11"
                      ry="5"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
                <span className="text-[#9AA4AD] text-xs font-semibold uppercase tracking-wider">
                  Before
                </span>
              </div>

              {/* VS divider */}
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[#263038] to-transparent" />
                <span
                  className="text-xs font-black tracking-widest px-2 py-1 rounded-full border border-[#FF7A1A]/40"
                  style={{
                    background: "rgba(255,122,26,0.08)",
                    color: "#FF7A1A",
                  }}
                >
                  VS
                </span>
                <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[#263038] to-transparent" />
              </div>

              {/* After silhouette */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="rounded-xl overflow-hidden border border-[#FF7A1A]/40 p-3"
                  style={{
                    background: "#0F161A",
                    boxShadow: "0 0 18px rgba(255,122,26,0.10)",
                  }}
                >
                  <svg
                    width="88"
                    height="160"
                    viewBox="0 0 88 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Current body silhouette side profile"
                  >
                    {/* After — slimmer, more athletic side silhouette */}
                    {/* Head */}
                    <ellipse
                      cx="62"
                      cy="22"
                      rx="13"
                      ry="15"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.5"
                    />
                    {/* Neck */}
                    <rect
                      x="54"
                      y="35"
                      width="8"
                      height="10"
                      rx="3"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.2"
                    />
                    {/* Torso (slimmer — after, slightly tapered) */}
                    <path
                      d="M34 47 Q30 51 30 65 Q30 80 33 88 L55 88 Q60 80 60 65 Q60 51 56 47 Z"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.5"
                    />
                    {/* Back arm */}
                    <path
                      d="M34 50 Q24 60 26 76 Q27 82 32 82"
                      stroke="#FF7A1A"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.5"
                    />
                    {/* Front arm */}
                    <path
                      d="M56 50 Q66 60 64 76 Q63 82 58 82"
                      stroke="#FF7A1A"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.85"
                    />
                    {/* Hips (narrower) */}
                    <ellipse
                      cx="44"
                      cy="89"
                      rx="17"
                      ry="8"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.2"
                    />
                    {/* Back leg */}
                    <path
                      d="M36 97 Q32 112 34 132 Q35 140 38 142"
                      stroke="#FF7A1A"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.5"
                    />
                    {/* Front leg */}
                    <path
                      d="M52 97 Q56 112 54 132 Q53 140 50 142"
                      stroke="#FF7A1A"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.88"
                    />
                    {/* Feet */}
                    <ellipse
                      cx="39"
                      cy="144"
                      rx="8"
                      ry="4"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <ellipse
                      cx="51"
                      cy="144"
                      rx="10"
                      ry="4.5"
                      fill="#1A2228"
                      stroke="#FF7A1A"
                      strokeWidth="1.2"
                    />
                    {/* Orange accent glow on torso */}
                    <path
                      d="M44 52 L44 84"
                      stroke="rgba(255,122,26,0.3)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#FF7A1A" }}
                >
                  Current
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
