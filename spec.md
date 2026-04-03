# Spark Fit – Side-View Human Avatar Trainer

## Current State
- AvatarTrainer.tsx: Canvas-based stickman (orange lines + dots on dark gradient bg). Front-facing, symmetric poses.
- AvatarPage.tsx: Workout timer, muscle selector, exercise list, speed control. Wraps AvatarTrainer.
- Exercises: crunches, leg raises, plank, pushup, bench press, dumbbell curl, squat, lunge, jumping jack, etc.

## Requested Changes (Diff)

### Add
- Side-view (90° profile) avatar drawn with CSS/SVG to look like a realistic human silhouette wearing gym clothes (track pants + t-shirt, fit but not bulky)
- Avatar positioned slightly left-of-center in the canvas, exercise area centred
- Motivational text overlay during exercise: "Keep going 💪", "Don't stop now!", "You're doing great!", "Push harder 🔥"
- Coach voice text bubbles per exercise (e.g. "Keep your back straight — perfect squat!")
- Before/After body side-view panel: left = heavier silhouette, right = current/slimmer silhouette (both pure side view)
- Food system avatar panel: slight hand-raise gesture with caption "Confirm your meal for accurate tracking."

### Modify
- Replace current stickman AvatarTrainer with a side-profile human figure drawn using SVG paths/shapes in a canvas or inline SVG component
- All exercise poses rendered from side profile (90° right-facing)
- Background becomes a minimal gym room (floor line, wall, simple equipment outline)
- Avatar face NOT visible (pure profile, no eye contact)
- Exercise animations: jumping jacks (arms+legs spread from side), squats (side knee bend + hip back), plank (side-view flat hold), crunches (side lying→curl up)
- AvatarPage header updated: "AI Trainer" instead of "Stickman Trainer"

### Remove
- Front-facing symmetric stickman pose system
- Orange dot/line stickman aesthetic
- Moving dot particle background

## Implementation Plan
1. Rewrite AvatarTrainer.tsx: Replace stickman canvas with a side-profile human figure drawn entirely in canvas using filled shapes (ellipses, bezier paths) to represent: head (circle, side view), torso (rounded rect rotated), upper arm, forearm, thigh, shin, feet — all in side profile.
2. Side-view poses: define all key poses as x/y joint offsets from a side perspective (x = forward/back, y = up/down). Use same keyframe lerp system.
3. Gym background: draw a floor line, a wall rectangle, optional barbell rack outline in light gray — no animated particles.
4. Add motivation text that cycles through phrases during exercise (changes every 5 sec).
5. Add coach voice text bubble per exercise (shown at start of each exercise).
6. Update AvatarPage header title.
7. Add Before/After side-view comparison panel below avatar (lightweight SVG silhouettes showing heavier vs current body shape).
