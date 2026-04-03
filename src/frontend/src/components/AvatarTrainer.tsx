import { useEffect, useRef } from "react";

interface Props {
  muscleGroup: string;
  exerciseName: string;
  isResting?: boolean;
  speed?: number;
}

// ─── Pose type ───────────────────────────────────────────────────────────────
// All joint positions are (x, y) offsets from the hip centre.
// Side-view: x = forward/backward (right = forward), y = up/down (negative = up).
type P = { x: number; y: number };

interface Pose {
  bY: number; // hip centre vertical offset from baseline
  head: P;
  neck: P;
  lSho: P; // "left" = back shoulder in side view
  lElb: P;
  lHnd: P;
  rSho: P; // "right" = front shoulder (protrudes a bit forward)
  rElb: P;
  rHnd: P;
  lHip: P;
  lKne: P;
  lFot: P;
  rHip: P;
  rKne: P;
  rFot: P;
  tiltDeg?: number; // torso rotation for floor poses (degrees from vertical)
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

// ─── Pose definitions (side-view, figure faces RIGHT) ────────────────────────

const STAND: Pose = {
  bY: 0,
  head: { x: 8, y: -100 },
  neck: { x: 4, y: -85 },
  lSho: { x: -10, y: -76 },
  lElb: { x: -12, y: -52 },
  lHnd: { x: -11, y: -26 },
  rSho: { x: 12, y: -76 },
  rElb: { x: 14, y: -52 },
  rHnd: { x: 13, y: -26 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -8, y: 34 },
  lFot: { x: -9, y: 72 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 8, y: 34 },
  rFot: { x: 9, y: 72 },
};

const IDLE_UP: Pose = { ...STAND, bY: -2 };
const IDLE_DOWN: Pose = { ...STAND, bY: 2 };

const SQUAT_LOW: Pose = {
  bY: 28,
  head: { x: 14, y: -88 },
  neck: { x: 10, y: -74 },
  lSho: { x: -8, y: -66 },
  lElb: { x: -28, y: -46 },
  lHnd: { x: -40, y: -30 },
  rSho: { x: 14, y: -66 },
  rElb: { x: 34, y: -46 },
  rHnd: { x: 46, y: -30 },
  lHip: { x: -9, y: 0 },
  lKne: { x: -28, y: 22 },
  lFot: { x: -26, y: 52 },
  rHip: { x: 9, y: 0 },
  rKne: { x: 28, y: 22 },
  rFot: { x: 26, y: 52 },
  tiltDeg: 18,
};

const CURL_UP: Pose = {
  bY: 0,
  head: { x: 8, y: -100 },
  neck: { x: 4, y: -85 },
  lSho: { x: -10, y: -76 },
  lElb: { x: -12, y: -52 },
  lHnd: { x: -14, y: -82 },
  rSho: { x: 12, y: -76 },
  rElb: { x: 14, y: -52 },
  rHnd: { x: 16, y: -82 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -8, y: 34 },
  lFot: { x: -9, y: 72 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 8, y: 34 },
  rFot: { x: 9, y: 72 },
};

const SPRESS_UP: Pose = {
  bY: 0,
  head: { x: 8, y: -100 },
  neck: { x: 4, y: -85 },
  lSho: { x: -10, y: -76 },
  lElb: { x: -22, y: -104 },
  lHnd: { x: -14, y: -128 },
  rSho: { x: 12, y: -76 },
  rElb: { x: 24, y: -104 },
  rHnd: { x: 16, y: -128 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -8, y: 34 },
  lFot: { x: -9, y: 72 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 8, y: 34 },
  rFot: { x: 9, y: 72 },
};

const SPRESS_DOWN: Pose = {
  bY: 0,
  head: { x: 8, y: -100 },
  neck: { x: 4, y: -85 },
  lSho: { x: -10, y: -76 },
  lElb: { x: -30, y: -76 },
  lHnd: { x: -30, y: -56 },
  rSho: { x: 12, y: -76 },
  rElb: { x: 32, y: -76 },
  rHnd: { x: 32, y: -56 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -8, y: 34 },
  lFot: { x: -9, y: 72 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 8, y: 34 },
  rFot: { x: 9, y: 72 },
};

const LAT_UP: Pose = {
  bY: 0,
  head: { x: 8, y: -100 },
  neck: { x: 4, y: -85 },
  lSho: { x: -10, y: -76 },
  lElb: { x: -38, y: -72 },
  lHnd: { x: -58, y: -68 },
  rSho: { x: 12, y: -76 },
  rElb: { x: 40, y: -72 },
  rHnd: { x: 60, y: -68 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -8, y: 34 },
  lFot: { x: -9, y: 72 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 8, y: 34 },
  rFot: { x: 9, y: 72 },
};

const JJ_OPEN: Pose = {
  bY: -4,
  head: { x: 8, y: -102 },
  neck: { x: 4, y: -87 },
  lSho: { x: -10, y: -76 },
  lElb: { x: -32, y: -94 },
  lHnd: { x: -44, y: -110 },
  rSho: { x: 12, y: -76 },
  rElb: { x: 34, y: -94 },
  rHnd: { x: 46, y: -110 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -26, y: 30 },
  lFot: { x: -34, y: 66 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 26, y: 30 },
  rFot: { x: 34, y: 66 },
};

const LUNGE: Pose = {
  bY: 12,
  head: { x: 8, y: -98 },
  neck: { x: 4, y: -83 },
  lSho: { x: -10, y: -74 },
  lElb: { x: -12, y: -52 },
  lHnd: { x: -11, y: -28 },
  rSho: { x: 12, y: -74 },
  rElb: { x: 14, y: -52 },
  rHnd: { x: 13, y: -28 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -20, y: 20 },
  lFot: { x: -24, y: 56 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 24, y: -8 },
  rFot: { x: 30, y: 54 },
};

// ─── FLOOR POSES (horizontal) ────────────────────────────────────────────────

// Lying flat on back — side view (head to the RIGHT of canvas, feet to LEFT)
const FLOOR_FLAT: Pose = {
  bY: 42,
  tiltDeg: 90,
  head: { x: 75, y: -5 },
  neck: { x: 58, y: -4 },
  lSho: { x: 42, y: -11 },
  lElb: { x: 22, y: -22 },
  lHnd: { x: 6, y: -22 },
  rSho: { x: 40, y: 7 },
  rElb: { x: 20, y: 18 },
  rHnd: { x: 4, y: 18 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -32, y: -10 },
  lFot: { x: -64, y: -14 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -32, y: 10 },
  rFot: { x: -64, y: 14 },
};

const CRUNCH_SIT: Pose = {
  bY: 42,
  tiltDeg: 90,
  head: { x: 50, y: -50 },
  neck: { x: 38, y: -40 },
  lSho: { x: 22, y: -34 },
  lElb: { x: 8, y: -50 },
  lHnd: { x: -8, y: -58 },
  rSho: { x: 20, y: -26 },
  rElb: { x: 6, y: -42 },
  rHnd: { x: -10, y: -50 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -32, y: -10 },
  lFot: { x: -64, y: -14 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -32, y: 10 },
  rFot: { x: -64, y: 14 },
};

const LEGRAISE_UP: Pose = {
  bY: 42,
  tiltDeg: 90,
  head: { x: 75, y: -5 },
  neck: { x: 58, y: -4 },
  lSho: { x: 42, y: -11 },
  lElb: { x: 22, y: -8 },
  lHnd: { x: 6, y: 20 },
  rSho: { x: 40, y: 7 },
  rElb: { x: 20, y: 4 },
  rHnd: { x: 4, y: 26 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -14, y: -46 },
  lFot: { x: -22, y: -84 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -14, y: -38 },
  rFot: { x: -22, y: -74 },
};

const PUSHUP_UP: Pose = {
  bY: 34,
  tiltDeg: 90,
  head: { x: 72, y: -6 },
  neck: { x: 55, y: -5 },
  lSho: { x: 40, y: -10 },
  lElb: { x: 40, y: 26 },
  lHnd: { x: 38, y: 56 },
  rSho: { x: 36, y: 6 },
  rElb: { x: 36, y: 24 },
  rHnd: { x: 34, y: 54 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -34, y: -4 },
  lFot: { x: -66, y: -4 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -34, y: 6 },
  rFot: { x: -66, y: 6 },
};

const PUSHUP_DOWN: Pose = {
  bY: 46,
  tiltDeg: 90,
  head: { x: 68, y: -6 },
  neck: { x: 52, y: -5 },
  lSho: { x: 37, y: -10 },
  lElb: { x: 22, y: 14 },
  lHnd: { x: 38, y: 38 },
  rSho: { x: 33, y: 6 },
  rElb: { x: 18, y: 14 },
  rHnd: { x: 34, y: 36 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -34, y: -4 },
  lFot: { x: -66, y: -4 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -34, y: 6 },
  rFot: { x: -66, y: 6 },
};

const BENCH_UP: Pose = {
  bY: 42,
  tiltDeg: 90,
  head: { x: 75, y: -5 },
  neck: { x: 58, y: -4 },
  lSho: { x: 42, y: -11 },
  lElb: { x: 42, y: -38 },
  lHnd: { x: 42, y: -68 },
  rSho: { x: 40, y: 7 },
  rElb: { x: 40, y: 34 },
  rHnd: { x: 40, y: 64 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -32, y: -10 },
  lFot: { x: -64, y: -14 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -32, y: 10 },
  rFot: { x: -64, y: 14 },
};

const BENCH_DOWN: Pose = {
  bY: 42,
  tiltDeg: 90,
  head: { x: 75, y: -5 },
  neck: { x: 58, y: -4 },
  lSho: { x: 42, y: -11 },
  lElb: { x: 26, y: -28 },
  lHnd: { x: 42, y: -14 },
  rSho: { x: 40, y: 7 },
  rElb: { x: 24, y: 24 },
  rHnd: { x: 40, y: 10 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -32, y: -10 },
  lFot: { x: -64, y: -14 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -32, y: 10 },
  rFot: { x: -64, y: 14 },
};

const PLANK: Pose = {
  bY: 34,
  tiltDeg: 90,
  head: { x: 72, y: -6 },
  neck: { x: 55, y: -5 },
  lSho: { x: 40, y: -10 },
  lElb: { x: 18, y: 10 },
  lHnd: { x: 16, y: 38 },
  rSho: { x: 36, y: 6 },
  rElb: { x: 14, y: 10 },
  rHnd: { x: 12, y: 36 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -34, y: -4 },
  lFot: { x: -66, y: -4 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -34, y: 6 },
  rFot: { x: -66, y: 6 },
};

const PLANK_BREATHE: Pose = { ...PLANK, bY: PLANK.bY + 2 };

const MC_FWD: Pose = {
  bY: 50,
  tiltDeg: 90,
  head: { x: 72, y: -6 },
  neck: { x: 55, y: -5 },
  lSho: { x: 40, y: -10 },
  lElb: { x: 18, y: 10 },
  lHnd: { x: 16, y: 38 },
  rSho: { x: 36, y: 6 },
  rElb: { x: 14, y: 10 },
  rHnd: { x: 12, y: 36 },
  lHip: { x: 0, y: -5 },
  lKne: { x: 20, y: -32 },
  lFot: { x: 28, y: -10 },
  rHip: { x: 0, y: 5 },
  rKne: { x: -34, y: 6 },
  rFot: { x: -66, y: 6 },
};

const MC_BACK: Pose = {
  bY: 50,
  tiltDeg: 90,
  head: { x: 72, y: -6 },
  neck: { x: 55, y: -5 },
  lSho: { x: 40, y: -10 },
  lElb: { x: 18, y: 10 },
  lHnd: { x: 16, y: 38 },
  rSho: { x: 36, y: 6 },
  rElb: { x: 14, y: 10 },
  rHnd: { x: 12, y: 36 },
  lHip: { x: 0, y: -5 },
  lKne: { x: -34, y: -4 },
  lFot: { x: -66, y: -4 },
  rHip: { x: 0, y: 5 },
  rKne: { x: 20, y: -28 },
  rFot: { x: 28, y: -6 },
};

const OVERHEAD_UP: Pose = { ...SPRESS_UP };
const OVERHEAD_DOWN: Pose = {
  bY: 0,
  head: { x: 8, y: -100 },
  neck: { x: 4, y: -85 },
  lSho: { x: -10, y: -76 },
  lElb: { x: -6, y: -108 },
  lHnd: { x: -4, y: -84 },
  rSho: { x: 12, y: -76 },
  rElb: { x: 8, y: -108 },
  rHnd: { x: 6, y: -84 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -8, y: 34 },
  lFot: { x: -9, y: 72 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 8, y: 34 },
  rFot: { x: 9, y: 72 },
};

const TRICEP_DIP_DOWN: Pose = {
  bY: 18,
  head: { x: 8, y: -96 },
  neck: { x: 4, y: -81 },
  lSho: { x: -10, y: -72 },
  lElb: { x: -12, y: -52 },
  lHnd: { x: -13, y: -36 },
  rSho: { x: 12, y: -72 },
  rElb: { x: 14, y: -52 },
  rHnd: { x: 15, y: -36 },
  lHip: { x: -7, y: 0 },
  lKne: { x: -8, y: 28 },
  lFot: { x: -9, y: 62 },
  rHip: { x: 7, y: 0 },
  rKne: { x: 8, y: 28 },
  rFot: { x: 9, y: 62 },
};

// ─── Animation keyframes ──────────────────────────────────────────────────────
type Keyframe = [Pose, number];

const ANIMS: Record<string, Keyframe[]> = {
  idle: [
    [IDLE_UP, 0],
    [IDLE_DOWN, 0.5],
    [IDLE_UP, 1],
  ],
  squat: [
    [STAND, 0],
    [SQUAT_LOW, 0.5],
    [STAND, 1],
  ],
  jumping_jack: [
    [STAND, 0],
    [JJ_OPEN, 0.5],
    [STAND, 1],
  ],
  dumbbell_curl: [
    [STAND, 0],
    [CURL_UP, 0.5],
    [STAND, 1],
  ],
  hammer_curl: [
    [STAND, 0],
    [CURL_UP, 0.5],
    [STAND, 1],
  ],
  shoulder_press: [
    [SPRESS_DOWN, 0],
    [SPRESS_UP, 0.5],
    [SPRESS_DOWN, 1],
  ],
  lateral_raise: [
    [STAND, 0],
    [LAT_UP, 0.5],
    [STAND, 1],
  ],
  lunge: [
    [STAND, 0],
    [LUNGE, 0.5],
    [STAND, 1],
  ],
  burpee: [
    [STAND, 0],
    [SQUAT_LOW, 0.25],
    [PUSHUP_DOWN, 0.5],
    [SQUAT_LOW, 0.75],
    [STAND, 1],
  ],
  tricep_dip: [
    [STAND, 0],
    [TRICEP_DIP_DOWN, 0.5],
    [STAND, 1],
  ],
  overhead_ext: [
    [OVERHEAD_UP, 0],
    [OVERHEAD_DOWN, 0.5],
    [OVERHEAD_UP, 1],
  ],
  // Floor exercises
  crunches: [
    [FLOOR_FLAT, 0],
    [CRUNCH_SIT, 0.5],
    [FLOOR_FLAT, 1],
  ],
  leg_raises: [
    [FLOOR_FLAT, 0],
    [LEGRAISE_UP, 0.5],
    [FLOOR_FLAT, 1],
  ],
  pushup: [
    [PUSHUP_UP, 0],
    [PUSHUP_DOWN, 0.5],
    [PUSHUP_UP, 1],
  ],
  bench_press: [
    [BENCH_UP, 0],
    [BENCH_DOWN, 0.5],
    [BENCH_UP, 1],
  ],
  plank: [
    [PLANK, 0],
    [PLANK_BREATHE, 0.5],
    [PLANK, 1],
  ],
  mountain_climber: [
    [MC_FWD, 0],
    [MC_BACK, 0.5],
    [MC_FWD, 1],
  ],
};

const FLOOR_KEYS = new Set([
  "crunches",
  "leg_raises",
  "pushup",
  "bench_press",
  "plank",
  "mountain_climber",
]);

// ─── Key resolver ─────────────────────────────────────────────────────────────
function getAnimKey(muscleGroup: string, exerciseName: string): string {
  const n = exerciseName.toLowerCase();
  if (n.includes("crunch")) return "crunches";
  if (n.includes("leg raise")) return "leg_raises";
  if (n.includes("plank")) return "plank";
  if (n.includes("dumbbell curl")) return "dumbbell_curl";
  if (n.includes("hammer curl")) return "hammer_curl";
  if (n.includes("push")) return "pushup";
  if (n.includes("bench press")) return "bench_press";
  if (n.includes("shoulder press")) return "shoulder_press";
  if (n.includes("lateral")) return "lateral_raise";
  if (n.includes("squat")) return "squat";
  if (n.includes("lunge")) return "lunge";
  if (n.includes("jumping jack")) return "jumping_jack";
  if (n.includes("burpee")) return "burpee";
  if (n.includes("mountain")) return "mountain_climber";
  if (n.includes("tricep dip")) return "tricep_dip";
  if (n.includes("overhead")) return "overhead_ext";
  const fallbacks: Record<string, string> = {
    abs: "crunches",
    arms: "dumbbell_curl",
    chest: "pushup",
    shoulders: "lateral_raise",
    legs: "squat",
  };
  return fallbacks[muscleGroup] ?? "jumping_jack";
}

// ─── Lerp helpers ─────────────────────────────────────────────────────────────
function lerpP(a: P, b: P, t: number): P {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const s = 0.5 - Math.cos(t * Math.PI) / 2;
  return {
    bY: a.bY + (b.bY - a.bY) * s,
    tiltDeg: (a.tiltDeg ?? 0) + ((b.tiltDeg ?? 0) - (a.tiltDeg ?? 0)) * s,
    head: lerpP(a.head, b.head, s),
    neck: lerpP(a.neck, b.neck, s),
    lSho: lerpP(a.lSho, b.lSho, s),
    lElb: lerpP(a.lElb, b.lElb, s),
    lHnd: lerpP(a.lHnd, b.lHnd, s),
    rSho: lerpP(a.rSho, b.rSho, s),
    rElb: lerpP(a.rElb, b.rElb, s),
    rHnd: lerpP(a.rHnd, b.rHnd, s),
    lHip: lerpP(a.lHip, b.lHip, s),
    lKne: lerpP(a.lKne, b.lKne, s),
    lFot: lerpP(a.lFot, b.lFot, s),
    rHip: lerpP(a.rHip, b.rHip, s),
    rKne: lerpP(a.rKne, b.rKne, s),
    rFot: lerpP(a.rFot, b.rFot, s),
  };
}

function getPoseAtT(animKey: string, t: number): Pose {
  const frames = ANIMS[animKey] ?? ANIMS.idle;
  const cycleT = t % 1.0;
  for (let i = 0; i < frames.length - 1; i++) {
    const [pA, fA] = frames[i];
    const [pB, fB] = frames[i + 1];
    if (cycleT >= fA && cycleT <= fB) {
      const localT = fB === fA ? 0 : (cycleT - fA) / (fB - fA);
      return lerpPose(pA, pB, localT);
    }
  }
  return frames[frames.length - 1][0];
}

// ─── Canvas drawing utilities ─────────────────────────────────────────────────

function capsule(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  r: number,
  fill: string,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.001) {
    ctx.beginPath();
    ctx.arc(ax, ay, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    return;
  }
  const angle = Math.atan2(dy, dx);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  ctx.beginPath();
  ctx.arc(ax, ay, r, angle + Math.PI / 2, angle - Math.PI / 2);
  ctx.arc(bx, by, r, angle - Math.PI / 2, angle + Math.PI / 2);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  // subtle highlight
  ctx.beginPath();
  ctx.arc(ax - cos * r * 0.3, ay - sin * r * 0.3, r * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
}

function drawHumanSideProfile(
  ctx: CanvasRenderingContext2D,
  pose: Pose,
  cx: number,
  baseHipY: number,
) {
  const hx = cx;
  const hy = baseHipY + pose.bY;

  const pt = (p: P) => ({ x: hx + p.x, y: hy + p.y });

  const head = pt(pose.head);
  const neck = pt(pose.neck);
  const lSho = pt(pose.lSho);
  const lElb = pt(pose.lElb);
  const lHnd = pt(pose.lHnd);
  const rSho = pt(pose.rSho);
  const rElb = pt(pose.rElb);
  const rHnd = pt(pose.rHnd);
  const lHip = pt(pose.lHip);
  const lKne = pt(pose.lKne);
  const lFot = pt(pose.lFot);
  const rHip = pt(pose.rHip);
  const rKne = pt(pose.rKne);
  const rFot = pt(pose.rFot);

  // Colours
  const SKIN = "#C8956C";
  const SKIN_DARK = "#A0704A";
  const SHIRT = "#1E2C3A"; // dark navy t-shirt
  const SHIRT_MID = "#253545";
  const PANTS = "#1A2535"; // dark slate track pants
  const PANTS_LIGHT = "#243040";
  const SHADOW = "rgba(0,0,0,0.3)";

  // ── Shadow under figure ───────────────────────────────────────────────────
  const footMidX = (lFot.x + rFot.x) / 2;
  const footMidY = Math.max(lFot.y, rFot.y) + 10;
  const shadowG = ctx.createRadialGradient(
    footMidX,
    footMidY,
    2,
    footMidX,
    footMidY,
    40,
  );
  shadowG.addColorStop(0, "rgba(0,0,0,0.45)");
  shadowG.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.ellipse(footMidX, footMidY, 40, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = shadowG;
  ctx.fill();

  // ── Back arm (left — appears behind torso) ────────────────────────────────
  capsule(ctx, lSho.x, lSho.y, lElb.x, lElb.y, 5.5, SKIN_DARK);
  capsule(ctx, lElb.x, lElb.y, lHnd.x, lHnd.y, 4.5, SKIN_DARK);
  // hand
  ctx.beginPath();
  ctx.ellipse(
    lHnd.x,
    lHnd.y,
    5,
    4,
    Math.atan2(lHnd.y - lElb.y, lHnd.x - lElb.x),
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = SKIN_DARK;
  ctx.fill();

  // ── Back leg (left — appears behind front leg) ────────────────────────────
  capsule(ctx, lHip.x, lHip.y, lKne.x, lKne.y, 9, PANTS);
  capsule(ctx, lKne.x, lKne.y, lFot.x, lFot.y, 7.5, PANTS);
  // shoe back
  const lFootAngle = Math.atan2(lFot.y - lKne.y, lFot.x - lKne.x);
  ctx.beginPath();
  ctx.ellipse(
    lFot.x + Math.cos(lFootAngle) * 6,
    lFot.y + Math.sin(lFootAngle) * 4,
    11,
    4.5,
    lFootAngle,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "#111";
  ctx.fill();

  // ── Torso ─────────────────────────────────────────────────────────────────
  const hipMidX = (lHip.x + rHip.x) / 2;
  const hipMidY = (lHip.y + rHip.y) / 2;
  const shoulderMidX = (lSho.x + rSho.x) / 2;
  const shoulderMidY = (lSho.y + rSho.y) / 2;

  // main torso capsule
  capsule(ctx, shoulderMidX, shoulderMidY, hipMidX, hipMidY, 13, SHIRT);
  // chest highlight
  const cHiliteX = shoulderMidX + (rSho.x - lSho.x) * 0.25;
  capsule(ctx, cHiliteX, shoulderMidY, cHiliteX + 1, hipMidY - 6, 5, SHIRT_MID);

  // hips / waistband
  capsule(ctx, lHip.x, lHip.y, rHip.x, rHip.y, 10, PANTS_LIGHT);
  // waistband stripe
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,122,26,0.55)";
  ctx.lineWidth = 2;
  ctx.moveTo(lHip.x - 4, lHip.y);
  ctx.lineTo(rHip.x + 4, rHip.y);
  ctx.stroke();

  // ── Front leg (right) ─────────────────────────────────────────────────────
  capsule(ctx, rHip.x, rHip.y, rKne.x, rKne.y, 10, PANTS_LIGHT);
  capsule(ctx, rKne.x, rKne.y, rFot.x, rFot.y, 8, PANTS_LIGHT);
  // kneecap dot
  ctx.beginPath();
  ctx.arc(rKne.x, rKne.y, 6, 0, Math.PI * 2);
  ctx.fillStyle = PANTS;
  ctx.fill();
  // shoe front
  const rFootAngle = Math.atan2(rFot.y - rKne.y, rFot.x - rKne.x);
  ctx.beginPath();
  ctx.ellipse(
    rFot.x + Math.cos(rFootAngle) * 7,
    rFot.y + Math.sin(rFootAngle) * 4,
    13,
    5,
    rFootAngle,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "#1A1A2E";
  ctx.fill();
  // shoe highlight
  ctx.beginPath();
  ctx.ellipse(
    rFot.x + Math.cos(rFootAngle) * 6,
    rFot.y + Math.sin(rFootAngle) * 2 - 2,
    6,
    2,
    rFootAngle,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();

  // ── Front arm (right — more visible) ─────────────────────────────────────
  capsule(ctx, rSho.x, rSho.y, rElb.x, rElb.y, 6, SKIN);
  capsule(ctx, rElb.x, rElb.y, rHnd.x, rHnd.y, 5, SKIN);
  // hand
  ctx.beginPath();
  ctx.ellipse(
    rHnd.x,
    rHnd.y,
    6,
    4.5,
    Math.atan2(rHnd.y - rElb.y, rHnd.x - rElb.x),
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = SKIN;
  ctx.fill();

  // ── Shoulder collar ───────────────────────────────────────────────────────
  capsule(ctx, lSho.x, lSho.y, rSho.x, rSho.y, 7, SHIRT);

  // ── Neck ──────────────────────────────────────────────────────────────────
  capsule(
    ctx,
    neck.x,
    neck.y,
    head.x + (head.x - neck.x) * 0.2,
    head.y + (head.y - neck.y) * 0.3,
    5.5,
    SKIN,
  );

  // ── Head ──────────────────────────────────────────────────────────────────
  // skull
  ctx.beginPath();
  ctx.ellipse(head.x, head.y, 13, 15, 0, 0, Math.PI * 2);
  ctx.fillStyle = SKIN;
  ctx.fill();
  // ear
  ctx.beginPath();
  ctx.ellipse(head.x - 4, head.y + 3, 4, 5.5, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = SKIN_DARK;
  ctx.fill();
  // jaw line
  ctx.beginPath();
  ctx.moveTo(head.x - 8, head.y + 8);
  ctx.quadraticCurveTo(head.x + 2, head.y + 20, head.x + 10, head.y + 5);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = SKIN_DARK;
  ctx.stroke();
  // hair (dark silhouette on top of head)
  ctx.beginPath();
  ctx.ellipse(head.x + 2, head.y - 9, 11, 9, -0.15, Math.PI, Math.PI * 2);
  ctx.fillStyle = "#1A0E00";
  ctx.fill();
  // subtle side of face (nose ridge)
  ctx.beginPath();
  ctx.moveTo(head.x + 10, head.y - 2);
  ctx.quadraticCurveTo(head.x + 14, head.y + 1, head.x + 11, head.y + 5);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = SKIN_DARK;
  ctx.stroke();

  // shirt logo/stripe accents
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#FF7A1A";
  const stripeX = (shoulderMidX + hipMidX) / 2;
  const stripeY = (shoulderMidY + hipMidY) / 2;
  ctx.fillRect(stripeX - 2, stripeY - 14, 4, 28);
  ctx.globalAlpha = 1;
  ctx.restore();

  // ── Body outline glow (orange edge) ──────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.strokeStyle = "#FF7A1A";
  ctx.lineWidth = 10;
  ctx.shadowColor = "#FF7A1A";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(head.x, head.y, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // ── Overlay: shadow on back side ──────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = SHADOW;
  capsule(
    ctx,
    shoulderMidX - 3,
    shoulderMidY,
    hipMidX - 3,
    hipMidY,
    11,
    SHADOW,
  );
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Dark wall fill
  ctx.fillStyle = "#0B0F12";
  ctx.fillRect(0, 0, W, H);

  // Back wall rectangle (slightly lighter)
  ctx.fillStyle = "#10161A";
  ctx.fillRect(0, 0, W, H * 0.82);

  // Floor
  const floorY = H * 0.84;
  ctx.fillStyle = "#161D22";
  ctx.fillRect(0, floorY, W, H - floorY);

  // Floor highlight line
  const floorLine = ctx.createLinearGradient(0, floorY, W, floorY);
  floorLine.addColorStop(0, "rgba(255,122,26,0)");
  floorLine.addColorStop(0.3, "rgba(255,122,26,0.35)");
  floorLine.addColorStop(0.7, "rgba(255,122,26,0.35)");
  floorLine.addColorStop(1, "rgba(255,122,26,0)");
  ctx.beginPath();
  ctx.strokeStyle = floorLine;
  ctx.lineWidth = 1.5;
  ctx.moveTo(0, floorY);
  ctx.lineTo(W, floorY);
  ctx.stroke();

  // Barbell rack silhouette (right edge)
  const rackX = W - 22;
  ctx.fillStyle = "#1C262E";
  // two vertical posts
  ctx.fillRect(rackX - 2, H * 0.2, 4, H * 0.62);
  ctx.fillRect(rackX + 10, H * 0.2, 4, H * 0.62);
  // horizontal cross bar
  ctx.fillRect(rackX - 4, H * 0.25, 20, 3);
  ctx.fillRect(rackX - 4, H * 0.45, 20, 3);
  // barbell on hooks
  ctx.fillRect(rackX - 8, H * 0.27, 28, 5);
  // plate
  ctx.fillStyle = "#263038";
  ctx.beginPath();
  ctx.ellipse(rackX + 12, H * 0.295, 4, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ambient orange glow from floor
  const glowGrad = ctx.createRadialGradient(
    W * 0.45,
    floorY,
    5,
    W * 0.45,
    floorY,
    100,
  );
  glowGrad.addColorStop(0, "rgba(255,122,26,0.10)");
  glowGrad.addColorStop(1, "rgba(255,122,26,0)");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, floorY - 60, W, 100);

  // Floor mat for floor exercises (drawn separately as needed)
}

function drawFloorMat(ctx: CanvasRenderingContext2D, cx: number, matY: number) {
  const matW = 160;
  const matH = 12;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cx - matW / 2, matY - matH / 2, matW, matH, 4);
  const matGrad = ctx.createLinearGradient(cx - matW / 2, 0, cx + matW / 2, 0);
  matGrad.addColorStop(0, "rgba(255,122,26,0)");
  matGrad.addColorStop(0.15, "rgba(40,55,66,0.9)");
  matGrad.addColorStop(0.85, "rgba(40,55,66,0.9)");
  matGrad.addColorStop(1, "rgba(255,122,26,0)");
  ctx.fillStyle = matGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,122,26,0.4)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawCoachBubble(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  topY: number,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = "bold 10px 'Plus Jakarta Sans', sans-serif";
  const maxW = 190;
  // Word wrap
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW - 16) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const lineH = 14;
  const bw = maxW;
  const bh = lines.length * lineH + 14;
  const bx = cx - bw / 2;
  const by = topY;

  // Bubble background
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 8);
  ctx.fillStyle = "rgba(20,27,32,0.92)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,122,26,0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pointer triangle
  ctx.beginPath();
  ctx.moveTo(cx - 8, by + bh);
  ctx.lineTo(cx + 8, by + bh);
  ctx.lineTo(cx, by + bh + 8);
  ctx.closePath();
  ctx.fillStyle = "rgba(20,27,32,0.92)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,122,26,0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Text
  ctx.fillStyle = "#F2F4F6";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], cx, by + 7 + i * lineH);
  }

  ctx.restore();
}

function drawMotivation(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  t: number,
) {
  ctx.save();
  const pulse = 0.8 + Math.sin(t * Math.PI * 1.5) * 0.2;
  ctx.globalAlpha = pulse;
  ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FF7A1A";
  ctx.shadowColor = "#FF7A1A";
  ctx.shadowBlur = 8;
  ctx.fillText(text, cx, y);
  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AvatarTrainer({
  muscleGroup,
  exerciseName,
  isResting = false,
  speed = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    t: 0,
    animKey: "idle",
    speed: 1,
    isResting: false,
    lastTime: 0,
    rafId: 0,
    coachText: "",
    coachTimer: 0, // seconds since exercise started
    motivationIdx: 0,
    motivationTimer: 0,
    prevAnimKey: "",
  });

  const MOTIVATIONS = [
    "Keep going 💪",
    "Don't stop now!",
    "You're doing great!",
    "Push harder 🔥",
  ];

  const newAnimKey = isResting ? "idle" : getAnimKey(muscleGroup, exerciseName);

  // Detect exercise change → reset coach cue
  if (newAnimKey !== stateRef.current.prevAnimKey) {
    stateRef.current.coachText = COACH_CUES[newAnimKey] ?? "";
    stateRef.current.coachTimer = 0;
    stateRef.current.prevAnimKey = newAnimKey;
  }

  stateRef.current.animKey = newAnimKey;
  stateRef.current.speed = speed;
  stateRef.current.isResting = isResting;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const loop = (timestamp: number) => {
      const state = stateRef.current;
      const dt = state.lastTime
        ? Math.min((timestamp - state.lastTime) / 1000, 0.05)
        : 0.016;
      state.lastTime = timestamp;
      state.t += dt * state.speed;

      // Coach bubble timer
      if (state.coachTimer < 3.5) {
        state.coachTimer += dt;
      }

      // Motivation rotation (every 5s when not resting)
      if (!state.isResting) {
        state.motivationTimer += dt;
        if (state.motivationTimer >= 5) {
          state.motivationTimer = 0;
          state.motivationIdx = (state.motivationIdx + 1) % MOTIVATIONS.length;
        }
      }

      // ── Draw background ────────────────────────────────────────────────
      drawBackground(ctx, W, H);

      const isFloor = FLOOR_KEYS.has(state.animKey);
      const hipCanvasY = isFloor ? H * 0.72 : H * 0.66;
      const avatarCX = W * 0.44; // slightly left of centre, figure faces right

      // Floor mat
      if (isFloor) {
        const matY = hipCanvasY + (state.animKey === "bench_press" ? 44 : 40);
        drawFloorMat(ctx, avatarCX, matY);
      }

      // ── Draw avatar ────────────────────────────────────────────────────
      const pose = getPoseAtT(state.animKey, state.t);
      drawHumanSideProfile(ctx, pose, avatarCX, hipCanvasY);

      // ── Coach cue bubble ───────────────────────────────────────────────
      if (state.coachText && state.coachTimer < 3.5) {
        const fadeIn = Math.min(state.coachTimer / 0.4, 1);
        const fadeOut =
          state.coachTimer > 3.0 ? 1 - (state.coachTimer - 3.0) / 0.5 : 1;
        const alpha = Math.min(fadeIn, fadeOut);
        drawCoachBubble(ctx, state.coachText, avatarCX + 20, 14, alpha);
      }

      // ── Motivation text ────────────────────────────────────────────────
      if (!state.isResting) {
        drawMotivation(
          ctx,
          MOTIVATIONS[state.motivationIdx],
          avatarCX,
          H - 14,
          state.t,
        );
      }

      // ── Rest overlay ───────────────────────────────────────────────────
      if (state.isResting) {
        ctx.fillStyle = "rgba(11,15,18,0.62)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#FF7A1A";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("REST", W / 2, H / 2);
        ctx.font = "15px sans-serif";
        ctx.fillStyle = "#9AA4AD";
        ctx.fillText("Take a breath", W / 2, H / 2 + 34);
      }

      state.rafId = requestAnimationFrame(loop);
    };

    stateRef.current.rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(stateRef.current.rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <canvas
        ref={canvasRef}
        width={320}
        height={340}
        className="rounded-2xl w-full max-w-sm"
        style={{ maxHeight: 340 }}
      />
      <p className="text-[#FF7A1A] font-bold text-sm uppercase tracking-wider">
        {isResting ? "Rest Period" : exerciseName}
      </p>
      <p className="text-[#9AA4AD] text-xs capitalize">
        {muscleGroup.replace("_", " ")} workout
      </p>
    </div>
  );
}
