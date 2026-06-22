import { DayPlan, MealPlan, DAY_NAMES } from "./types";
import { RECIPES, getRecipesByMealType } from "./recipes";

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function pickRandom<T>(arr: T[], exclude: Set<string> = new Set()): T {
  const filtered = arr.filter(
    (item) => !exclude.has((item as { id: string }).id)
  );
  const pool = filtered.length > 0 ? filtered : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function generateWeeklyPlan(weekStart?: Date): MealPlan {
  const monday = weekStart ? getMonday(weekStart) : getMonday(new Date());

  const breakfastRecipes = getRecipesByMealType("pequeno-almoco");
  const lunchRecipes = getRecipesByMealType("almoco");
  const dinnerRecipes = getRecipesByMealType("jantar");

  const usedBreakfast = new Set<string>();
  const usedLunch = new Set<string>();
  const usedDinner = new Set<string>();

  const days: DayPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const breakfast = pickRandom(breakfastRecipes, usedBreakfast);
    usedBreakfast.add(breakfast.id);

    const lunch = pickRandom(lunchRecipes, usedLunch);
    usedLunch.add(lunch.id);

    const dinner = pickRandom(dinnerRecipes, usedDinner);
    usedDinner.add(dinner.id);

    days.push({
      date: date.toISOString().split("T")[0],
      dayOfWeek: DAY_NAMES[i],
      meals: {
        "pequeno-almoco": breakfast.id,
        almoco: lunch.id,
        jantar: dinner.id,
      },
    });
  }

  return {
    weekStartDate: monday.toISOString().split("T")[0],
    days,
  };
}

export function getAlternativesForMeal(
  mealType: string,
  currentRecipeId: string
): typeof RECIPES {
  return getRecipesByMealType(mealType).filter((r) => r.id !== currentRecipeId);
}
