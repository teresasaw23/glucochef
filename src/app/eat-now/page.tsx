"use client";

import { useState, useEffect } from "react";
import { GlucoseReading, MealPlan } from "@/lib/types";
import { getRecipeById, RECIPES } from "@/lib/recipes";
import { recommendMeal, Recommendation } from "@/lib/recommend";
import { getGlucoseStatus, getDirectionArrow } from "@/lib/insulin";
import { USER_CONFIG } from "@/lib/config";
import RecipeCard from "@/components/RecipeCard";

const PLAN_STORAGE_KEY = "glucochef-meal-plan";

export default function EatNowPage() {
  const [glucose, setGlucose] = useState<GlucoseReading | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Recommendation | null>(null);

  useEffect(() => {
    async function load() {
      let glucoseData: GlucoseReading | null = null;
      try {
        const res = await fetch("/api/glucose");
        if (res.ok) {
          glucoseData = await res.json();
          setGlucose(glucoseData);
        }
      } catch {
        // continue without glucose
      }

      // Get today's planned recipes
      const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
      let availableRecipes = RECIPES;

      if (savedPlan) {
        const plan: MealPlan = JSON.parse(savedPlan);
        const today = new Date().toISOString().split("T")[0];
        const todayPlan = plan.days.find((d) => d.date === today);

        if (todayPlan) {
          const todayRecipeIds = Object.values(todayPlan.meals).filter(Boolean) as string[];
          const todayRecipes = todayRecipeIds
            .map((id) => getRecipeById(id))
            .filter(Boolean) as typeof RECIPES;

          if (todayRecipes.length > 0) {
            availableRecipes = todayRecipes;
          }
        }
      }

      if (glucoseData) {
        const recs = recommendMeal(glucoseData, availableRecipes);
        setRecommendations(recs);
      } else {
        // Without glucose, just show today's meals sorted by carbs (medium first)
        const recs = availableRecipes.slice(0, 3).map((recipe) => ({
          recipe,
          reason: "Sem dados de glicemia — recomendação baseada no plano do dia",
          suggestedServings: 1,
          estimatedCarbs: recipe.nutrition.carbs,
          estimatedInsulin:
            Math.round(
              (recipe.nutrition.carbs / USER_CONFIG.insulinCarbRatio) * 2
            ) / 2,
        }));
        setRecommendations(recs);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (selected) {
    const recipe = selected.recipe;
    const insulinDose =
      Math.round(
        (selected.estimatedCarbs / USER_CONFIG.insulinCarbRatio) * 2
      ) / 2;

    let correctionDose = 0;
    if (glucose && glucose.sgv > USER_CONFIG.targetGlucoseMax) {
      correctionDose =
        Math.round(
          ((glucose.sgv - USER_CONFIG.targetGlucose) /
            USER_CONFIG.correctionFactor) *
            10
        ) / 10;
    }

    const totalDose = Math.round((insulinDose + correctionDose) * 2) / 2;

    return (
      <div className="px-4 pt-6 space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <RecipeCard recipe={recipe} />

        <div className="bg-blue-50 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-blue-800">Dose de Fiasp</h3>

          <div className="text-center">
            <p className="text-5xl font-bold text-blue-700">{totalDose}</p>
            <p className="text-sm text-blue-500 mt-1">unidades</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Porção sugerida</span>
              <span className="font-medium">
                {selected.suggestedServings === 1
                  ? "Normal"
                  : `${selected.suggestedServings}x`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hidratos estimados</span>
              <span className="font-medium">{selected.estimatedCarbs}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insulina para hidratos</span>
              <span className="font-medium">{insulinDose}u</span>
            </div>
            {correctionDose > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Correção</span>
                <span className="font-medium">+{correctionDose}u</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-3">Ingredientes</h3>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="text-sm text-gray-600 flex justify-between">
                <span>{ing.name}</span>
                <span className="text-gray-400">
                  {ing.quantity} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-3">Preparação</h3>
          <ol className="space-y-2">
            {recipe.steps.map((step, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-3">
                <span className="text-blue-600 font-medium flex-shrink-0">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <h1 className="text-xl font-bold">O que comer agora?</h1>

      {glucose && (
        <div
          className={`rounded-xl p-4 ${getGlucoseStatus(glucose.sgv).bgColor}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-bold ${
                getGlucoseStatus(glucose.sgv).color
              }`}
            >
              {glucose.sgv}
            </span>
            <span className="text-xl">
              {getDirectionArrow(glucose.direction)}
            </span>
            <span className="text-sm text-gray-500">mg/dL</span>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <p className="text-sm text-gray-500">{recommendations[0].reason}</p>
      )}

      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <button
            key={rec.recipe.id}
            onClick={() => setSelected(rec)}
            className="w-full text-left"
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mt-1">{rec.recipe.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {rec.recipe.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-gray-600">
                  {rec.estimatedCarbs}g HC
                </span>
                <span className="text-blue-600 font-medium">
                  {rec.estimatedInsulin}u Fiasp
                </span>
                <span className="text-gray-400">
                  {rec.recipe.prepTimeMinutes + rec.recipe.cookTimeMinutes} min
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
