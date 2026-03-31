# FitAI - Smart Fitness Coach

## Current State
New project. Empty workspace.

## Requested Changes (Diff)

### Add
- Multi-step onboarding wizard (personal info, lifestyle, goals, muscle targets)
- Health calculator engine: BMI, BMR, TDEE, macros (protein/carbs/fats), fiber, water intake
- AI-powered meal planner: Breakfast, Lunch, Dinner, Snacks with full macro breakdown per meal
- Food image scanner: user uploads food photo, AI estimates nutritional info via Pollinations.ai text API
- Alternative food suggestions: 2-3 foods with equivalent calories and quantities
- Workout generator: exercises per muscle group (Abs, Biceps, Triceps, Chest, Shoulders, Legs, Full Body)
- Smart weight suggestion: safe body weight goal + dumbbell weight by fitness level (Beginner/Intermediate/Advanced)
- Personalized workout plan: reps, sets, rest time, difficulty per exercise
- Safety system: age-based warnings, beginner weight alerts, warm-up reminders
- Dashboard: calories consumed vs required, protein tracker, water tracker, workout completion ring
- Weekly progress tracking with charts
- Notification reminders (browser-based) for meals, water, workouts
- Backend: user profile storage, daily nutrition/workout logs, weekly progress snapshots

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
- `UserProfile` type: age, weight, height, gender, lifestyle, goal, muscleTargets
- `DailyLog` type: date, mealsConsumed[], workoutsCompleted[], waterGlasses, caloriesConsumed
- `WeeklySnapshot` type: weekStart, avgCalories, avgWater, workoutsCompleted, weight
- CRUD: saveProfile, getProfile, saveDailyLog, getDailyLog, saveWeeklySnapshot, getWeeklyHistory

### Frontend
- **OnboardingWizard**: 4 steps - PersonalInfo, Lifestyle, FitnessGoal+MuscleTargets, Summary
- **Dashboard**: stats cards (calories ring, protein bar, water drops, workout check), quick actions
- **NutritionPage**: daily meal plan cards, food scanner upload, alternative foods
- **WorkoutPage**: muscle group selector, exercise cards with sets/reps/rest, safety warnings
- **ProgressPage**: weekly bar charts for calories/workouts/water
- **Calculations**: pure frontend math for BMI/BMR/TDEE/macros/water
- **AI Food Scanner**: uses Pollinations.ai text API to analyze uploaded food image filename/description
- **Design**: dark theme (gray-900/gray-800 backgrounds) with orange accents (#f97316), card-based layout
