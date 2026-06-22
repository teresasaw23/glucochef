import { Recipe, GlucoseReading } from "./types";
import { USER_CONFIG } from "./config";

export interface Recommendation {
  recipe: Recipe;
  reason: string;
  suggestedServings: number;
  estimatedCarbs: number;
  estimatedInsulin: number;
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

  return sorted.slice(0, 3).map((recipe) => {
    let reason: string;
    let suggestedServings = 1;

    if (sgv > 180) {
      reason = `Glicemia alta (${sgv} mg/dL) — refeição baixa em hidratos recomendada`;
      suggestedServings = recipe.nutrition.carbs > 40 ? 0.75 : 1;
    } else if (sgv > USER_CONFIG.targetGlucoseMax) {
      reason = `Glicemia acima do ideal (${sgv} mg/dL) — porção normal, considerar menos hidratos`;
      suggestedServings = 1;
    } else if (sgv < 70) {
      reason = `Glicemia baixa (${sgv} mg/dL) — comer primeiro algo com açúcar rápido, depois esta refeição`;
      suggestedServings = 1;
    } else if (sgv < USER_CONFIG.targetGlucoseMin) {
      reason = `Glicemia normal-baixa (${sgv} mg/dL) — boa altura para comer`;
      suggestedServings = 1;
    } else {
      reason = `Glicemia ideal (${sgv} mg/dL) — porção normal`;
      suggestedServings = 1;
    }

    const estimatedCarbs = Math.round(
      recipe.nutrition.carbs * suggestedServings
    );
    const estimatedInsulin =
      Math.round((estimatedCarbs / USER_CONFIG.insulinCarbRatio) * 2) / 2;

    return {
      recipe,
      reason,
      suggestedServings,
      estimatedCarbs,
      estimatedInsulin,
    };
  });
}
