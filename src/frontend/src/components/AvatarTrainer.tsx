import { useEffect, useRef, useState } from "react";

interface Props {
  muscleGroup: string;
  exerciseName: string;
  isResting?: boolean;
  speed?: number;
}

// ─── Exercise image map ───────────────────────────────────────────────────────
// Maps exercise name keywords to AI-generated human images.
// Each entry can have multiple frames for alternating animation.

interface ExerciseImage {
  frames: string[];
  isFloor?: boolean;
  altText: string;
}

const EXERCISE_IMAGES: Record<string, ExerciseImage> = {
  squat: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-squat.dim_300x500.png",
    ],
    altText: "Trainer doing squats",
  },
  lunge: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-lunge.dim_300x500.png",
    ],
    altText: "Trainer doing lunges",
  },
  jumping_jack: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-jumping-jack.dim_300x500.png",
    ],
    altText: "Trainer doing jumping jacks",
  },
  burpee: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-burpee.dim_300x500.png",
    ],
    altText: "Trainer doing burpees",
  },
  plank: {
    frames: ["/assets/generated/avatar-plank.dim_300x500.png"],
    isFloor: true,
    altText: "Trainer holding plank",
  },
  crunches: {
    frames: ["/assets/generated/avatar-crunch.dim_400x300.png"],
    isFloor: true,
    altText: "Trainer doing crunches",
  },
  leg_raises: {
    frames: ["/assets/generated/avatar-leg-raise.dim_400x300.png"],
    isFloor: true,
    altText: "Trainer doing leg raises",
  },
  pushup: {
    frames: [
      "/assets/generated/avatar-pushup.dim_400x300.png",
      "/assets/generated/avatar-plank.dim_300x500.png",
    ],
    isFloor: true,
    altText: "Trainer doing push-ups",
  },
  bench_press: {
    frames: ["/assets/generated/avatar-pushup.dim_400x300.png"],
    isFloor: true,
    altText: "Trainer doing bench press",
  },
  dumbbell_curl: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-curl.dim_300x500.png",
    ],
    altText: "Trainer doing dumbbell curls",
  },
  hammer_curl: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-curl.dim_300x500.png",
    ],
    altText: "Trainer doing hammer curls",
  },
  shoulder_press: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-shoulder-press.dim_300x500.png",
    ],
    altText: "Trainer doing shoulder press",
  },
  lateral_raise: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-lateral-raise.dim_300x500.png",
    ],
    altText: "Trainer doing lateral raises",
  },
  mountain_climber: {
    frames: ["/assets/generated/avatar-plank.dim_300x500.png"],
    isFloor: true,
    altText: "Trainer doing mountain climbers",
  },
  tricep_dip: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-squat.dim_300x500.png",
    ],
    altText: "Trainer doing tricep dips",
  },
  overhead_ext: {
    frames: [
      "/assets/generated/avatar-stand.dim_300x500.png",
      "/assets/generated/avatar-shoulder-press.dim_300x500.png",
    ],
    altText: "Trainer doing overhead extensions",
  },
  idle: {
    frames: ["/assets/generated/avatar-stand.dim_300x500.png"],
    altText: "Trainer standing ready",
  },
};

// ─── Map exercise name → image key ───────────────────────────────────────────
function getImageKey(muscleGroup: string, exerciseName: string): string {
  const name = exerciseName.toLowerCase();
  if (name.includes("squat")) return "squat";
  if (name.includes("lunge")) return "lunge";
  if (name.includes("jumping") || name.includes("jack")) return "jumping_jack";
  if (name.includes("burpee")) return "burpee";
  if (name.includes("plank")) return "plank";
  if (name.includes("crunch")) return "crunches";
  if (name.includes("leg raise")) return "leg_raises";
  if (name.includes("push")) return "pushup";
  if (name.includes("bench")) return "bench_press";
  if (name.includes("hammer")) return "hammer_curl";
  if (name.includes("curl")) return "dumbbell_curl";
  if (name.includes("shoulder press") || name.includes("overhead press"))
    return "shoulder_press";
  if (name.includes("lateral")) return "lateral_raise";
  if (name.includes("mountain")) return "mountain_climber";
  if (name.includes("tricep dip") || name.includes("dip")) return "tricep_dip";
  if (name.includes("overhead ext") || name.includes("tricep ext"))
    return "overhead_ext";
  // Fallback based on muscle group
  if (muscleGroup === "legs") return "squat";
  if (muscleGroup === "arms") return "dumbbell_curl";
  if (muscleGroup === "chest") return "pushup";
  if (muscleGroup === "shoulders") return "shoulder_press";
  if (muscleGroup === "abs") return "crunches";
  return "idle";
}

// ─── Coach cues ───────────────────────────────────────────────────────────────
const COACH_CUES: Record<string, string> = {
  squat: "Keep your back straight — perfect squat!",
  jumping_jack: "Start with jumping jacks — keep your energy high!",
  plank: "Hold it… don't drop your hips!",
  crunches: "Feel the burn — stay controlled!",
  pushup: "Chest to floor — push strong!",
  bench_press: "Full extension — control the weight!",
  dumbbell_curl: "Squeeze at the top — slow down!",
  hammer_curl: "Neutral grip — power through!",
  shoulder_press: "Press overhead — lock it out!",
  lateral_raise: "Lead with your elbows — controlled!",
  lunge: "Front knee over ankle — drive up!",
  burpee: "Explosive jump — full body power!",
  mountain_climber: "Hips down — drive those knees!",
  leg_raises: "Legs straight — lower slowly!",
  tricep_dip: "Elbows back — full range!",
  overhead_ext: "Triceps engaged — squeeze tight!",
  idle: "Ready to go? Hit Play!",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AvatarTrainer({
  muscleGroup,
  exerciseName,
  isResting = false,
  speed = 1,
}: Props) {
  const imageKey = isResting ? "idle" : getImageKey(muscleGroup, exerciseName);
  const exerciseData = EXERCISE_IMAGES[imageKey] ?? EXERCISE_IMAGES.idle;
  const frames = exerciseData.frames;
  const isFloor = exerciseData.isFloor ?? false;

  const [frameIdx, setFrameIdx] = useState(0);
  const [showCoach, setShowCoach] = useState(false);
  const [coachText, setCoachText] = useState("");
  const [motivationIdx, setMotivationIdx] = useState(0);
  const prevKeyRef = useRef("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const coachTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const motivationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const MOTIVATIONS = [
    "Keep going 💪",
    "Don't stop now!",
    "You're doing great!",
    "Push harder 🔥",
  ];

  // Show coach cue on exercise change
  useEffect(() => {
    if (imageKey !== prevKeyRef.current) {
      prevKeyRef.current = imageKey;
      setCoachText(COACH_CUES[imageKey] ?? "");
      setShowCoach(true);
      setFrameIdx(0);
      if (coachTimerRef.current) clearTimeout(coachTimerRef.current);
      coachTimerRef.current = setTimeout(() => setShowCoach(false), 3500);
    }
    return () => {
      if (coachTimerRef.current) clearTimeout(coachTimerRef.current);
    };
  }, [imageKey]);

  // Animate between frames
  useEffect(() => {
    if (frames.length <= 1 || isResting) {
      setFrameIdx(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const msPerFrame = Math.round(900 / speed);
    intervalRef.current = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frames.length);
    }, msPerFrame);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frames, speed, isResting]);

  // Rotate motivation text every 5s when running
  useEffect(() => {
    if (isResting) {
      if (motivationIntervalRef.current)
        clearInterval(motivationIntervalRef.current);
      return;
    }
    motivationIntervalRef.current = setInterval(() => {
      setMotivationIdx((prev) => (prev + 1) % MOTIVATIONS.length);
    }, 5000);
    return () => {
      if (motivationIntervalRef.current)
        clearInterval(motivationIntervalRef.current);
    };
  }, [isResting]);

  const currentSrc = frames[frameIdx] ?? frames[0];

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Avatar display */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0B0F12 0%, #141B20 60%, #0A1015 100%)",
          minHeight: isFloor ? 220 : 340,
        }}
      >
        {/* Gym background elements */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(255,122,26,0.06) 0%, transparent 65%)," +
              "radial-gradient(ellipse at 20% 80%, rgba(37,99,235,0.05) 0%, transparent 55%)",
          }}
        />

        {/* Floor line */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: isFloor ? "18%" : "15%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,122,26,0.35) 30%, rgba(255,122,26,0.35) 70%, transparent 100%)",
          }}
        />

        {/* Barbell rack silhouette */}
        <div
          className="absolute right-3 top-8 bottom-16"
          style={{
            width: 18,
            background: "transparent",
          }}
        >
          <div
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: 3,
              bottom: 0,
              background: "rgba(30,38,46,0.9)",
              borderRadius: 2,
            }}
          />
          <div
            className="absolute"
            style={{
              left: 10,
              top: 0,
              width: 3,
              bottom: 0,
              background: "rgba(30,38,46,0.9)",
              borderRadius: 2,
            }}
          />
          <div
            className="absolute"
            style={{
              left: -3,
              top: "20%",
              width: 24,
              height: 3,
              background: "rgba(30,38,46,0.9)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: -3,
              top: "50%",
              width: 24,
              height: 3,
              background: "rgba(30,38,46,0.9)",
            }}
          />
        </div>

        {/* Ground shadow under figure */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: isFloor ? "16%" : "13%",
            width: isFloor ? "65%" : "45%",
            height: 16,
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 80%)",
            borderRadius: "50%",
          }}
        />

        {/* Human image — animated between frames */}
        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ paddingBottom: isFloor ? "14%" : "12%" }}
        >
          <img
            key={currentSrc}
            src={currentSrc}
            alt={exerciseData.altText}
            className="object-contain select-none"
            style={{
              maxHeight: isFloor ? 200 : 300,
              maxWidth: "90%",
              animation:
                frames.length > 1 ? "avatarPop 0.12s ease-out" : undefined,
              imageRendering: "auto",
              filter: isResting ? "brightness(0.5) grayscale(0.4)" : "none",
              transition: "filter 0.4s ease",
            }}
            draggable={false}
          />
        </div>

        {/* Coach bubble */}
        {showCoach && coachText && (
          <div
            className="absolute top-3 left-3 right-10 rounded-xl px-3 py-2 text-xs font-semibold leading-snug"
            style={{
              background: "rgba(20,27,32,0.92)",
              border: "1px solid rgba(255,122,26,0.55)",
              color: "#F2F4F6",
              animation: "coachFadeIn 0.35s ease-out",
              maxWidth: 220,
            }}
          >
            <span style={{ color: "#FF7A1A" }}>💬 </span>
            {coachText}
          </div>
        )}

        {/* Rest overlay */}
        {isResting && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ background: "rgba(11,15,18,0.68)" }}
          >
            <p className="font-black text-3xl" style={{ color: "#FF7A1A" }}>
              REST
            </p>
            <p className="text-sm" style={{ color: "#9AA4AD" }}>
              Take a breath
            </p>
          </div>
        )}

        {/* Motivation text */}
        {!isResting && (
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <p
              key={motivationIdx}
              className="text-xs font-bold uppercase tracking-wider"
              style={{
                color: "#FF7A1A",
                textShadow: "0 0 10px rgba(255,122,26,0.5)",
                animation: "coachFadeIn 0.4s ease-out",
              }}
            >
              {MOTIVATIONS[motivationIdx]}
            </p>
          </div>
        )}
      </div>

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes avatarPop {
          0%   { opacity: 0.6; transform: scale(0.97); }
          100% { opacity: 1;   transform: scale(1); }
        }
        @keyframes coachFadeIn {
          0%   { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <p className="text-[#FF7A1A] font-bold text-sm uppercase tracking-wider">
        {isResting ? "Rest Period" : exerciseName}
      </p>
      <p className="text-[#9AA4AD] text-xs capitalize">
        {muscleGroup.replace("_", " ")} workout
      </p>
    </div>
  );
}
