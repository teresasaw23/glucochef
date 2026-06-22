import { Recipe, GlucoseReading } from "./types";
import { USER_CONFIG } from "./config";

export interface Recommendation {
  recipe: Recipe;
  reason: string;
  suggestedServings: number;
  estimatedCarbs: number;
  estimatedInsulin: number;
}

function getServingMultiplier(sgv: number): number {
  if (sgv > 180) return 0.6;
  if (sgv > 150) return 0.75;
  if (sgv > 120) return 0.85;
  if (sgv < 70) return 1.2;
  if (sgv < 90) return 1.1;
  return 1;
}

export function recommendMeal(
  glucose: GlucoseReading,
  availableRecipes: Recipe[]
): Recommendation[] {
  if (availableRecipes.length === 0) return [];

  const sgv = glucose.sgv;
  const sorted = [...availableRecipes];

  sorted.sort((a, b) => {
    if (sgv > USER_CONFIG.targetGlucoseMax) {
      return a.nutrition.carbs - b.nutrition.carbs;
    }
    if (sgv < USER_CONFIG.targetGlucoseMin) {
      return b.nutrition.carbs - a.nutrition.carbs;
    }
    const aMidCarbs = Math.abs(a.nutrition.carbs - 40);
    const bMidCarbs = Math.abs(b.nutrition.carbs - 40);
    return aMidCarbs - bMidCarbs;
  });

  const mult = getServingMultiplier(sgv);

  return sorted.slice(0, 5).map((recipe) => {
    let reason: string;

    if (sgv > 180) {
      reason = `Glicemia alta (${sgv}) — porção reduzida, menos hidratos`;
    } else if (sgv > USER_CONFIG.targetGlucoseMax) {
      reason = `Glicemia acima do ideal (${sgv}) — porção moderada`;
    } else if (sgv < 70) {
      reason = `Glicemia baixa (${sgv}) — come açúcar rápido primeiro, depois esta refeição`;
    } else if (sgv < USER_CONFIG.targetGlucoseMin) {
      reason = `Glicemia normal (${sgv}) — boa altura para comer`;
    } else {
      reason = `Glicemia ideal (${sgv}) — porção normal`;
    }

    const estimatedCarbs = Math.round(recipe.nutrition.carbs * mult);
    const estimatedInsulin =
      Math.round((estimatedCarbs / USER_CONFIG.insulinCarbRatio) * 2) / 2;

    return {
      recipe,
      reason,
      suggestedServings: mult,
      estimatedCarbs,
      estimatedInsulin,
    };
  });
}
