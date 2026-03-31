import type { HealthStats, Meal, UserProfile } from "../types";

export function generateMealPlan(
  profile: UserProfile,
  stats: HealthStats,
): Meal[] {
  const { targetCalories, protein } = stats;
  const isMuscle = profile.fitnessGoal === "muscle_building";
  const isLoss = profile.fitnessGoal === "weight_loss";

  const bfCals = Math.round(targetCalories * 0.25);
  const lunchCals = Math.round(targetCalories * 0.35);
  const dinnerCals = Math.round(targetCalories * 0.3);
  const snackCals = targetCalories - bfCals - lunchCals - dinnerCals;

  const bfP = Math.round(protein * 0.25);
  const lunchP = Math.round(protein * 0.35);
  const dinnerP = Math.round(protein * 0.3);
  const snackP = Math.round(protein * 0.1);

  return [
    {
      id: "breakfast",
      type: "breakfast",
      name: isMuscle
        ? "High-Protein Power Bowl"
        : isLoss
          ? "Light Morning Fuel"
          : "Balanced Breakfast",
      foods: isMuscle
        ? [
            "3 whole eggs + 2 egg whites",
            "Oatmeal (1 cup) + banana",
            "Whole milk (200ml)",
            "Almonds (30g)",
          ]
        : isLoss
          ? [
              "2 scrambled eggs",
              "Whole wheat toast (2 slices)",
              "Mixed berries (1 cup)",
              "Green tea",
            ]
          : [
              "2 eggs any style",
              "Oatmeal (1 cup) with honey",
              "Banana",
              "Orange juice (200ml)",
            ],
      calories: bfCals,
      protein: bfP,
      carbs: Math.round((bfCals * 0.45) / 4),
      fiber: 6,
      vitamins: "Vit D, B12, Iron",
    },
    {
      id: "lunch",
      type: "lunch",
      name: isMuscle
        ? "Power Lunch Plate"
        : isLoss
          ? "Lean Protein Bowl"
          : "Balanced Thali",
      foods: isMuscle
        ? [
            "150g grilled chicken / paneer",
            "Brown rice (1 cup)",
            "Mixed vegetables (1 cup)",
            "Dal (1 cup)",
          ]
        : isLoss
          ? [
              "100g grilled fish / tofu",
              "Quinoa (½ cup)",
              "Large salad with olive oil",
              "Cucumber raita",
            ]
          : [
              "2 chapati",
              "Dal (1 cup)",
              "Sabzi (1 cup)",
              "Curd (1 bowl)",
              "Mixed salad",
            ],
      calories: lunchCals,
      protein: lunchP,
      carbs: Math.round((lunchCals * 0.4) / 4),
      fiber: 9,
      vitamins: "Vit C, B6, Potassium, Folate",
    },
    {
      id: "dinner",
      type: "dinner",
      name: isMuscle
        ? "Recovery Dinner"
        : isLoss
          ? "Light Evening Meal"
          : "Wholesome Dinner",
      foods: isMuscle
        ? [
            "120g grilled chicken / fish",
            "Sweet potato (1 medium)",
            "Steamed broccoli (1 cup)",
            "Whole wheat roti (2)",
          ]
        : isLoss
          ? [
              "3 egg whites + 1 egg",
              "Vegetable soup (1 bowl)",
              "Moong dal (½ cup)",
              "Steamed veggies",
            ]
          : ["2 roti", "Mixed vegetable curry", "Dal tadka", "Small salad"],
      calories: dinnerCals,
      protein: dinnerP,
      carbs: Math.round((dinnerCals * 0.35) / 4),
      fiber: 8,
      vitamins: "Vit A, K, Magnesium, Zinc",
    },
    {
      id: "snacks",
      type: "snack",
      name: "Healthy Snacks",
      foods: isMuscle
        ? [
            "Banana + 1 tbsp peanut butter",
            "Protein shake (1 scoop)",
            "Mixed nuts (30g)",
          ]
        : isLoss
          ? ["Apple or pear (1 medium)", "Greek yogurt (100g)", "Almonds (15g)"]
          : [
              "Seasonal fruit (1 serving)",
              "Roasted chana (30g)",
              "Buttermilk (1 glass)",
            ],
      calories: snackCals,
      protein: snackP,
      carbs: Math.round((snackCals * 0.5) / 4),
      fiber: 4,
      vitamins: "Vit E, Zinc, Calcium, Fiber",
    },
  ];
}

export const ALTERNATIVE_FOODS = [
  {
    name: "2 chapati",
    quantity: "2 medium chapati (~60g each)",
    calories: 200,
  },
  { name: "1 bowl rice", quantity: "1 cup cooked rice (150g)", calories: 200 },
  { name: "1 medium banana", quantity: "1 banana (~120g)", calories: 105 },
  { name: "1 cup dal", quantity: "1 cup cooked dal (200g)", calories: 150 },
  { name: "1 boiled egg", quantity: "1 large egg (50g)", calories: 70 },
  { name: "Almonds", quantity: "Small handful (30g)", calories: 170 },
  {
    name: "Oatmeal bowl",
    quantity: "1 cup oats cooked (250ml)",
    calories: 150,
  },
  { name: "Chicken breast", quantity: "100g grilled piece", calories: 165 },
  { name: "Paneer cubes", quantity: "2 cubes (100g)", calories: 265 },
  { name: "Whole milk", quantity: "1 glass (250ml)", calories: 150 },
  { name: "Apple", quantity: "1 medium apple (182g)", calories: 95 },
  { name: "Peanuts", quantity: "Small handful (30g)", calories: 170 },
];

export function getAlternativeFoods(
  targetCalories: number,
  excludeName?: string,
) {
  return [...ALTERNATIVE_FOODS]
    .filter((f) => f.name !== excludeName)
    .sort(
      (a, b) =>
        Math.abs(a.calories - targetCalories) -
        Math.abs(b.calories - targetCalories),
    )
    .slice(0, 3);
}
