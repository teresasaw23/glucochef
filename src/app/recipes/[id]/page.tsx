"use client";

import { useParams, useRouter } from "next/navigation";
import { getRecipeById } from "@/lib/recipes";
import { USER_CONFIG } from "@/lib/config";
import { MEAL_TYPE_LABELS, SHOPPING_CATEGORY_LABELS } from "@/lib/types";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipe = getRecipeById(params.id as string);

  if (!recipe) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="text-gray-400">Receita não encontrada</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 text-sm mt-4"
        >
          Voltar
        </button>
      </div>
    );
  }

  const insulinDose =
    Math.round((recipe.nutrition.carbs / USER_CONFIG.insulinCarbRatio) * 2) / 2;

  const ingredientsByCategory: Record<string, typeof recipe.ingredients> = {};
  for (const ing of recipe.ingredients) {
    const cat = SHOPPING_CATEGORY_LABELS[ing.category] || ing.category;
    if (!ingredientsByCategory[cat]) ingredientsByCategory[cat] = [];
    ingredientsByCategory[cat].push(ing);
  }

  return (
    <div className="px-4 pt-6 pb-8 space-y-5">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      <div>
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {recipe.mealType.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {MEAL_TYPE_LABELS[t]}
            </span>
          ))}
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl border border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xl font-bold">{recipe.nutrition.carbs}g</p>
          <p className="text-xs text-gray-500">Hidratos</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{recipe.nutrition.protein}g</p>
          <p className="text-xs text-gray-500">Proteína</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{recipe.nutrition.calories}</p>
          <p className="text-xs text-gray-500">kcal</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600">{insulinDose}u</p>
          <p className="text-xs text-gray-500">Fiasp</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Prep: {recipe.prepTimeMinutes} min</span>
        </div>
        {recipe.cookTimeMinutes > 0 && (
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            <span>Cozinhar: {recipe.cookTimeMinutes} min</span>
          </div>
        )}
        <span>{recipe.servings} porções</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-lg mb-4">Ingredientes</h2>
        <p className="text-xs text-gray-400 mb-3">Para {recipe.servings} porções</p>
        {Object.entries(ingredientsByCategory).map(([category, ings]) => (
          <div key={category} className="mb-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              {category}
            </p>
            <ul className="space-y-1.5">
              {ings.map((ing, i) => (
                <li
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-800">{ing.name}</span>
                  <span className="text-gray-400 ml-2 whitespace-nowrap">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-lg mb-4">Preparação</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
