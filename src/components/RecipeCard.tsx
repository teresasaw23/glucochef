"use client";

import { Recipe, MEAL_TYPE_LABELS } from "@/lib/types";
import { USER_CONFIG } from "@/lib/config";

interface RecipeCardProps {
  recipe: Recipe;
  showSwap?: boolean;
  onSwap?: () => void;
  compact?: boolean;
}

export default function RecipeCard({
  recipe,
  showSwap,
  onSwap,
  compact,
}: RecipeCardProps) {
  const insulinDose =
    Math.round((recipe.nutrition.carbs / USER_CONFIG.insulinCarbRatio) * 2) / 2;

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{recipe.name}</h3>
            <div className="flex gap-2 mt-1 text-xs text-gray-500">
              <span>{recipe.nutrition.carbs}g HC</span>
              <span>{recipe.nutrition.calories} kcal</span>
              <span className="text-blue-600 font-medium">
                {insulinDose}u Fiasp
              </span>
            </div>
          </div>
          {showSwap && (
            <button
              onClick={onSwap}
              className="ml-2 p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
              title="Trocar refeição"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{recipe.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
        </div>
        {showSwap && (
          <button
            onClick={onSwap}
            className="ml-3 p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
            title="Trocar refeição"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {recipe.mealType.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
          >
            {MEAL_TYPE_LABELS[t]}
          </span>
        ))}
        {recipe.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        <div className="text-center">
          <p className="text-lg font-semibold">{recipe.nutrition.carbs}g</p>
          <p className="text-xs text-gray-500">Hidratos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{recipe.nutrition.protein}g</p>
          <p className="text-xs text-gray-500">Proteína</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{recipe.nutrition.calories}</p>
          <p className="text-xs text-gray-500">kcal</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-600">{insulinDose}u</p>
          <p className="text-xs text-gray-500">Fiasp</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span>Prep: {recipe.prepTimeMinutes} min</span>
        {recipe.cookTimeMinutes > 0 && (
          <span>Cozinhar: {recipe.cookTimeMinutes} min</span>
        )}
        <span>{recipe.servings} porções</span>
      </div>
    </div>
  );
}
