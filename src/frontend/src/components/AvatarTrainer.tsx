import { useEffect, useRef } from "react";

interface Props {
  muscleGroup: string;
  exerciseName: string;
  isResting?: boolean;
  speed?: number;
}

type P = { x: number; y: number };

interface Pose {
  bY: number;
  head: P;
  neck: P;
  lSho: P;
  lElb: P;
  lHnd: P;
  rSho: P;
  rElb: P;
  rHnd: P;
  lHip: P;
  lKne: P;
  lFot: P;
  rHip: P;
  rKne: P;
  rFot: P;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

const STAND: Pose = {
  bY: 0,
  head: { x: 0, y: -95 },
  neck: { x: 0, y: -80 },
  lSho: { x: -18, y: -72 },
  lElb: { x: -22, y: -48 },
  lHnd: { x: -20, y: -20 },
  rSho: { x: 18, y: -72 },
  rElb: { x: 22, y: -48 },
  rHnd: { x: 20, y: -20 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -12, y: 30 },
  lFot: { x: -14, y: 64 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 12, y: 30 },
  rFot: { x: 14, y: 64 },
};

const SQUAT_LOW: Pose = {
  bY: 25,
  head: { x: 0, y: -88 },
  neck: { x: 0, y: -73 },
  lSho: { x: -20, y: -66 },
  lElb: { x: -38, y: -50 },
  lHnd: { x: -50, y: -36 },
  rSho: { x: 20, y: -66 },
  rElb: { x: 38, y: -50 },
  rHnd: { x: 50, y: -36 },
  lHip: { x: -14, y: 0 },
  lKne: { x: -30, y: 20 },
  lFot: { x: -28, y: 50 },
  rHip: { x: 14, y: 0 },
  rKne: { x: 30, y: 20 },
  rFot: { x: 28, y: 50 },
};

// --- FLOOR / HORIZONTAL POSES ---

// Lying flat on back — starting position for crunches & leg raises
const FLOOR_FLAT: Pose = {
  bY: 45,
  head: { x: -80, y: -4 },
  neck: { x: -63, y: -4 },
  lSho: { x: -48, y: -10 },
  lElb: { x: -54, y: -26 },
  lHnd: { x: -72, y: -22 },
  rSho: { x: -48, y: 6 },
  rElb: { x: -54, y: 22 },
  rHnd: { x: -72, y: 18 },
  lHip: { x: 0, y: -4 },
  rHip: { x: 0, y: 4 },
  lKne: { x: 32, y: -10 },
  lFot: { x: 58, y: -14 },
  rKne: { x: 32, y: 10 },
  rFot: { x: 58, y: 14 },
};

// Crunch up — upper body lifts off floor (torso at ~45°)
const CRUNCH_SIT: Pose = {
  bY: 45,
  head: { x: -52, y: -48 },
  neck: { x: -42, y: -37 },
  lSho: { x: -30, y: -30 },
  lElb: { x: -24, y: -46 },
  lHnd: { x: -40, y: -58 },
  rSho: { x: -24, y: -22 },
  rElb: { x: -20, y: -38 },
  rHnd: { x: -36, y: -50 },
  lHip: { x: 0, y: -4 },
  rHip: { x: 0, y: 4 },
  lKne: { x: 32, y: -10 },
  lFot: { x: 58, y: -14 },
  rKne: { x: 32, y: 10 },
  rFot: { x: 58, y: 14 },
};

// Leg raise — legs lifted straight up
const LEGRAISE_UP: Pose = {
  bY: 45,
  head: { x: -80, y: -4 },
  neck: { x: -63, y: -4 },
  lSho: { x: -48, y: -10 },
  lElb: { x: -54, y: -6 },
  lHnd: { x: -56, y: 22 },
  rSho: { x: -48, y: 6 },
  rElb: { x: -54, y: 4 },
  rHnd: { x: -56, y: 28 },
  lHip: { x: 0, y: -4 },
  rHip: { x: 0, y: 4 },
  lKne: { x: 18, y: -44 },
  lFot: { x: 26, y: -80 },
  rKne: { x: 18, y: -36 },
  rFot: { x: 26, y: -70 },
};

// Push-up up — body horizontal, arms extended, face down
const PUSHUP_HORIZ_UP: Pose = {
  bY: 36,
  head: { x: -82, y: -4 },
  neck: { x: -66, y: -4 },
  lSho: { x: -50, y: -9 },
  lElb: { x: -48, y: 22 },
  lHnd: { x: -46, y: 50 },
  rSho: { x: -44, y: 5 },
  rElb: { x: -42, y: 22 },
  rHnd: { x: -40, y: 50 },
  lHip: { x: 0, y: -4 },
  rHip: { x: 0, y: 4 },
  lKne: { x: 36, y: -3 },
  lFot: { x: 68, y: -3 },
  rKne: { x: 36, y: 6 },
  rFot: { x: 68, y: 6 },
};

// Push-up down — arms bent, chest near floor
const PUSHUP_HORIZ_DOWN: Pose = {
  bY: 48,
  head: { x: -78, y: -4 },
  neck: { x: -64, y: -4 },
  lSho: { x: -48, y: -9 },
  lElb: { x: -36, y: 14 },
  lHnd: { x: -46, y: 38 },
  rSho: { x: -42, y: 5 },
  rElb: { x: -32, y: 14 },
  rHnd: { x: -40, y: 38 },
  lHip: { x: 0, y: -4 },
  rHip: { x: 0, y: 4 },
  lKne: { x: 36, y: -3 },
  lFot: { x: 68, y: -3 },
  rKne: { x: 36, y: 6 },
  rFot: { x: 68, y: 6 },
};

// Bench press — lying on back, arms extended up (press up)
const BENCH_PRESS_UP: Pose = {
  bY: 45,
  head: { x: -80, y: -4 },
  neck: { x: -63, y: -4 },
  lSho: { x: -48, y: -10 },
  lElb: { x: -48, y: -38 },
  lHnd: { x: -48, y: -68 },
  rSho: { x: -48, y: 6 },
  rElb: { x: -48, y: 34 },
  rHnd: { x: -48, y: 64 },
  lHip: { x: 0, y: -4 },
  rHip: { x: 0, y: 4 },
  lKne: { x: 32, y: -10 },
  lFot: { x: 58, y: -14 },
  rKne: { x: 32, y: 10 },
  rFot: { x: 58, y: 14 },
};

// Bench press — arms bent, hands at chest level (lowered)
const BENCH_PRESS_DOWN: Pose = {
  bY: 45,
  head: { x: -80, y: -4 },
  neck: { x: -63, y: -4 },
  lSho: { x: -48, y: -10 },
  lElb: { x: -30, y: -28 },
  lHnd: { x: -48, y: -14 },
  rSho: { x: -48, y: 6 },
  rElb: { x: -30, y: 24 },
  rHnd: { x: -48, y: 10 },
  lHip: { x: 0, y: -4 },
  rHip: { x: 0, y: 4 },
  lKne: { x: 32, y: -10 },
  lFot: { x: 58, y: -14 },
  rKne: { x: 32, y: 10 },
  rFot: { x: 58, y: 14 },
};

// --- STANDING / OTHER POSES ---

const CURL_UP: Pose = {
  bY: 0,
  head: { x: 0, y: -95 },
  neck: { x: 0, y: -80 },
  lSho: { x: -18, y: -72 },
  lElb: { x: -22, y: -48 },
  lHnd: { x: -16, y: -78 },
  rSho: { x: 18, y: -72 },
  rElb: { x: 22, y: -48 },
  rHnd: { x: 16, y: -78 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -12, y: 30 },
  lFot: { x: -14, y: 64 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 12, y: 30 },
  rFot: { x: 14, y: 64 },
};

const SPRESS_DOWN: Pose = {
  bY: 0,
  head: { x: 0, y: -95 },
  neck: { x: 0, y: -80 },
  lSho: { x: -18, y: -72 },
  lElb: { x: -38, y: -72 },
  lHnd: { x: -38, y: -52 },
  rSho: { x: 18, y: -72 },
  rElb: { x: 38, y: -72 },
  rHnd: { x: 38, y: -52 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -12, y: 30 },
  lFot: { x: -14, y: 64 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 12, y: 30 },
  rFot: { x: 14, y: 64 },
};

const SPRESS_UP: Pose = {
  bY: 0,
  head: { x: 0, y: -95 },
  neck: { x: 0, y: -80 },
  lSho: { x: -18, y: -72 },
  lElb: { x: -28, y: -100 },
  lHnd: { x: -18, y: -122 },
  rSho: { x: 18, y: -72 },
  rElb: { x: 28, y: -100 },
  rHnd: { x: 18, y: -122 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -12, y: 30 },
  lFot: { x: -14, y: 64 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 12, y: 30 },
  rFot: { x: 14, y: 64 },
};

const LAT_UP: Pose = {
  bY: 0,
  head: { x: 0, y: -95 },
  neck: { x: 0, y: -80 },
  lSho: { x: -18, y: -72 },
  lElb: { x: -44, y: -70 },
  lHnd: { x: -66, y: -68 },
  rSho: { x: 18, y: -72 },
  rElb: { x: 44, y: -70 },
  rHnd: { x: 66, y: -68 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -12, y: 30 },
  lFot: { x: -14, y: 64 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 12, y: 30 },
  rFot: { x: 14, y: 64 },
};

const JJ_OPEN: Pose = {
  bY: -6,
  head: { x: 0, y: -95 },
  neck: { x: 0, y: -80 },
  lSho: { x: -18, y: -72 },
  lElb: { x: -38, y: -90 },
  lHnd: { x: -52, y: -106 },
  rSho: { x: 18, y: -72 },
  rElb: { x: 38, y: -90 },
  rHnd: { x: 52, y: -106 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -28, y: 28 },
  lFot: { x: -38, y: 62 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 28, y: 28 },
  rFot: { x: 38, y: 62 },
};

// Kept for burpee animation
const PUSHUP_DOWN: Pose = {
  bY: 58,
  head: { x: 2, y: -88 },
  neck: { x: 2, y: -74 },
  lSho: { x: -18, y: -66 },
  lElb: { x: -42, y: -54 },
  lHnd: { x: -43, y: -36 },
  rSho: { x: 18, y: -66 },
  rElb: { x: 42, y: -54 },
  rHnd: { x: 43, y: -36 },
  lHip: { x: -8, y: 0 },
  lKne: { x: -8, y: 18 },
  lFot: { x: -8, y: 44 },
  rHip: { x: 8, y: 0 },
  rKne: { x: 8, y: 18 },
  rFot: { x: 8, y: 44 },
};

const LUNGE: Pose = {
  bY: 10,
  head: { x: 0, y: -93 },
  neck: { x: 0, y: -78 },
  lSho: { x: -18, y: -70 },
  lElb: { x: -22, y: -48 },
  lHnd: { x: -20, y: -22 },
  rSho: { x: 18, y: -70 },
  rElb: { x: 22, y: -48 },
  rHnd: { x: 20, y: -22 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -22, y: 18 },
  lFot: { x: -28, y: 52 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 22, y: -12 },
  rFot: { x: 26, y: 48 },
};

const MC_L: Pose = {
  bY: 55,
  head: { x: 2, y: -88 },
  neck: { x: 2, y: -74 },
  lSho: { x: -18, y: -66 },
  lElb: { x: -44, y: -70 },
  lHnd: { x: -46, y: -52 },
  rSho: { x: 18, y: -66 },
  rElb: { x: 44, y: -70 },
  rHnd: { x: 46, y: -52 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -16, y: -14 },
  lFot: { x: -18, y: 16 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 10, y: 20 },
  rFot: { x: 10, y: 48 },
};

const MC_R: Pose = {
  bY: 55,
  head: { x: 2, y: -88 },
  neck: { x: 2, y: -74 },
  lSho: { x: -18, y: -66 },
  lElb: { x: -44, y: -70 },
  lHnd: { x: -46, y: -52 },
  rSho: { x: 18, y: -66 },
  rElb: { x: 44, y: -70 },
  rHnd: { x: 46, y: -52 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -10, y: 20 },
  lFot: { x: -10, y: 48 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 16, y: -14 },
  rFot: { x: 18, y: 16 },
};

const TRICEP_DIP_DOWN: Pose = {
  bY: 15,
  head: { x: 0, y: -95 },
  neck: { x: 0, y: -80 },
  lSho: { x: -16, y: -70 },
  lElb: { x: -20, y: -50 },
  lHnd: { x: -22, y: -34 },
  rSho: { x: 16, y: -70 },
  rElb: { x: 20, y: -50 },
  rHnd: { x: 22, y: -34 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -14, y: 26 },
  lFot: { x: -16, y: 58 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 14, y: 26 },
  rFot: { x: 16, y: 58 },
};

const OVERHEAD_EXT_DOWN: Pose = {
  bY: 0,
  head: { x: 0, y: -95 },
  neck: { x: 0, y: -80 },
  lSho: { x: -18, y: -72 },
  lElb: { x: -10, y: -108 },
  lHnd: { x: -8, y: -82 },
  rSho: { x: 18, y: -72 },
  rElb: { x: 10, y: -108 },
  rHnd: { x: 8, y: -82 },
  lHip: { x: -10, y: 0 },
  lKne: { x: -12, y: 30 },
  lFot: { x: -14, y: 64 },
  rHip: { x: 10, y: 0 },
  rKne: { x: 12, y: 30 },
  rFot: { x: 14, y: 64 },
};

const IDLE_BOB_UP: Pose = { ...STAND, bY: -3 };
const IDLE_BOB_DOWN: Pose = { ...STAND, bY: 3 };

type Keyframe = [Pose, number];

const ANIMS: Record<string, Keyframe[]> = {
  idle: [
    [IDLE_BOB_UP, 0],
    [IDLE_BOB_DOWN, 0.5],
    [IDLE_BOB_UP, 1],
  ],
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
  plank: [
    [PUSHUP_HORIZ_UP, 0],
    [{ ...PUSHUP_HORIZ_UP, bY: PUSHUP_HORIZ_UP.bY + 1 }, 0.5],
    [PUSHUP_HORIZ_UP, 1],
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
  pushup: [
    [PUSHUP_HORIZ_UP, 0],
    [PUSHUP_HORIZ_DOWN, 0.5],
    [PUSHUP_HORIZ_UP, 1],
  ],
  bench_press: [
    [BENCH_PRESS_UP, 0],
    [BENCH_PRESS_DOWN, 0.5],
    [BENCH_PRESS_UP, 1],
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
  squat: [
    [STAND, 0],
    [SQUAT_LOW, 0.5],
    [STAND, 1],
  ],
  lunge: [
    [STAND, 0],
    [LUNGE, 0.5],
    [STAND, 1],
  ],
  jumping_jack: [
    [STAND, 0],
    [JJ_OPEN, 0.5],
    [STAND, 1],
  ],
  burpee: [
    [STAND, 0],
    [SQUAT_LOW, 0.25],
    [PUSHUP_DOWN, 0.5],
    [SQUAT_LOW, 0.75],
    [STAND, 1],
  ],
  mountain_climber: [
    [MC_L, 0],
    [MC_R, 0.5],
    [MC_L, 1],
  ],
  tricep_dip: [
    [STAND, 0],
    [TRICEP_DIP_DOWN, 0.5],
    [STAND, 1],
  ],
  overhead_ext: [
    [SPRESS_UP, 0],
    [OVERHEAD_EXT_DOWN, 0.5],
    [SPRESS_UP, 1],
  ],
};

const FLOOR_ANIM_KEYS = new Set([
  "crunches",
  "leg_raises",
  "pushup",
  "bench_press",
  "plank",
]);

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

function lerpP(a: P, b: P, t: number): P {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const s = 0.5 - Math.cos(t * Math.PI) / 2;
  return {
    bY: a.bY + (b.bY - a.bY) * s,
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

function drawStickman(
  ctx: CanvasRenderingContext2D,
  pose: Pose,
  cx: number,
  baseHipY: number,
  floorY?: number,
) {
  // Hip center on canvas
  const hx = cx;
  const hy = baseHipY + pose.bY;

  // Draw floor mat if provided
  if (floorY !== undefined) {
    const matGrad = ctx.createLinearGradient(cx - 100, 0, cx + 100, 0);
    matGrad.addColorStop(0, "rgba(255,122,26,0)");
    matGrad.addColorStop(0.5, "rgba(255,122,26,0.15)");
    matGrad.addColorStop(1, "rgba(255,122,26,0)");
    ctx.fillStyle = matGrad;
    ctx.fillRect(cx - 100, floorY - 3, 200, 6);
    // floor line
    ctx.strokeStyle = "rgba(255,122,26,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 100, floorY);
    ctx.lineTo(cx + 100, floorY);
    ctx.stroke();
  }

  // Helper: offset point to canvas coords
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

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Floor shadow
  const maxFootY = Math.max(lFot.y, rFot.y) + 6;
  const shadowGrad = ctx.createRadialGradient(
    cx,
    maxFootY,
    2,
    cx,
    maxFootY,
    32,
  );
  shadowGrad.addColorStop(0, "rgba(0,0,0,0.5)");
  shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.ellipse(cx, maxFootY, 30, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = shadowGrad;
  ctx.fill();

  // Left leg (back layer)
  ctx.strokeStyle = "#4A7FA5";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(lHip.x, lHip.y);
  ctx.lineTo(lKne.x, lKne.y);
  ctx.stroke();
  ctx.strokeStyle = "#3A6A8E";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(lKne.x, lKne.y);
  ctx.lineTo(lFot.x, lFot.y);
  ctx.stroke();

  // Right leg
  ctx.strokeStyle = "#4A7FA5";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(rHip.x, rHip.y);
  ctx.lineTo(rKne.x, rKne.y);
  ctx.stroke();
  ctx.strokeStyle = "#3A6A8E";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(rKne.x, rKne.y);
  ctx.lineTo(rFot.x, rFot.y);
  ctx.stroke();

  // Hip midpoint for torso base
  const hipMidX = (lHip.x + rHip.x) / 2;
  const hipMidY = (lHip.y + rHip.y) / 2;

  // Torso
  ctx.strokeStyle = "#FF7A1A";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(neck.x, neck.y);
  ctx.lineTo(hipMidX, hipMidY);
  ctx.stroke();

  // Left arm
  ctx.strokeStyle = "#FF7A1A";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(lSho.x, lSho.y);
  ctx.lineTo(lElb.x, lElb.y);
  ctx.stroke();
  ctx.strokeStyle = "#D85F16";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(lElb.x, lElb.y);
  ctx.lineTo(lHnd.x, lHnd.y);
  ctx.stroke();

  // Right arm
  ctx.strokeStyle = "#FF7A1A";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(rSho.x, rSho.y);
  ctx.lineTo(rElb.x, rElb.y);
  ctx.stroke();
  ctx.strokeStyle = "#D85F16";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(rElb.x, rElb.y);
  ctx.lineTo(rHnd.x, rHnd.y);
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(head.x, head.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#FF7A1A";
  ctx.fill();
  ctx.strokeStyle = "#D85F16";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Eyes
  ctx.fillStyle = "#0B0F12";
  ctx.beginPath();
  ctx.arc(head.x - 3.5, head.y - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(head.x + 3.5, head.y - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Neck line
  ctx.strokeStyle = "#D85F16";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(head.x, head.y + 10);
  ctx.lineTo(neck.x, neck.y);
  ctx.stroke();

  // Joint dots
  const jointDots = [lSho, rSho, lElb, rElb, lHip, rHip, lKne, rKne];
  for (const j of jointDots) {
    ctx.beginPath();
    ctx.arc(j.x, j.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#D85F16";
    ctx.fill();
  }

  // Foot dots
  for (const f of [lFot, rFot]) {
    ctx.beginPath();
    ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#FF7A1A";
    ctx.fill();
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  dots: Dot[],
) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0B0F12");
  bg.addColorStop(0.55, "#111820");
  bg.addColorStop(1, "#150800");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glowAlpha = 0.1 + Math.sin(t * Math.PI) * 0.05;
  const glow = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, 110);
  glow.addColorStop(0, `rgba(255,122,26,${glowAlpha})`);
  glow.addColorStop(1, "rgba(255,122,26,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const pulseR = 55 + Math.sin(t * Math.PI * 1.3) * 15;
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, pulseR, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,122,26,0.07)";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (const d of dots) {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,122,26,${d.alpha})`;
    ctx.fill();
  }

  const mat = ctx.createLinearGradient(W / 2 - 80, 0, W / 2 + 80, 0);
  mat.addColorStop(0, "rgba(38,48,56,0)");
  mat.addColorStop(0.5, "rgba(255,122,26,0.12)");
  mat.addColorStop(1, "rgba(38,48,56,0)");
  ctx.fillStyle = mat;
  ctx.beginPath();
  ctx.ellipse(W / 2, H - 10, 80, 8, 0, 0, Math.PI * 2);
  ctx.fill();
}

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
    dots: [] as Dot[],
    lastTime: 0,
    rafId: 0,
  });

  stateRef.current.animKey = isResting
    ? "idle"
    : getAnimKey(muscleGroup, exerciseName);
  stateRef.current.speed = speed;
  stateRef.current.isResting = isResting;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const dots: Dot[] = [];
    for (let i = 0; i < 28; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1.5 + Math.random() * 2.5,
        alpha: 0.06 + Math.random() * 0.14,
      });
    }
    stateRef.current.dots = dots;

    const loop = (timestamp: number) => {
      const state = stateRef.current;
      const dt = state.lastTime
        ? Math.min((timestamp - state.lastTime) / 1000, 0.05)
        : 0.016;
      state.lastTime = timestamp;
      state.t += dt * state.speed;

      for (const d of state.dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
      }

      drawBackground(ctx, W, H, state.t, state.dots);

      const pose = getPoseAtT(state.animKey, state.t);
      const isFloor = FLOOR_ANIM_KEYS.has(state.animKey);
      const hipCanvasY = H * 0.62 + pose.bY;
      let floorY: number | undefined;
      if (
        state.animKey === "pushup" ||
        state.animKey === "bench_press" ||
        state.animKey === "plank"
      ) {
        floorY = hipCanvasY + 50;
      } else if (isFloor) {
        floorY = hipCanvasY + 8;
      }

      drawStickman(ctx, pose, W / 2, H * 0.62, floorY);

      if (state.isResting) {
        ctx.fillStyle = "rgba(11,15,18,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#FF7A1A";
        ctx.font = "bold 26px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("REST", W / 2, H / 2);
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#9AA4AD";
        ctx.fillText("Take a breath", W / 2, H / 2 + 32);
      }

      state.rafId = requestAnimationFrame(loop);
    };

    stateRef.current.rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(stateRef.current.rafId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <canvas
        ref={canvasRef}
        width={280}
        height={300}
        className="rounded-2xl w-full max-w-xs"
        style={{ maxHeight: 300 }}
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
