"use client";

import { useState, useEffect } from "react";
import { GlucoseReading, MealPlan } from "@/lib/types";
import { getRecipeById, RECIPES, getRecipesByMealType } from "@/lib/recipes";
import { recommendMeal, Recommendation } from "@/lib/recommend";
import { getGlucoseStatus, getDirectionArrow } from "@/lib/insulin";
import { USER_CONFIG } from "@/lib/config";
import Link from "next/link";

const PLAN_STORAGE_KEY = "glucochef-meal-plan";

export default function EatNowPage() {
  const [glucose, setGlucose] = useState<GlucoseReading | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [snackRecs, setSnackRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"meals" | "snacks">("meals");

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

      const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
      let availableRecipes = RECIPES.filter(
        (r) => !r.mealType.includes("snack")
      );

      if (savedPlan) {
        const plan: MealPlan = JSON.parse(savedPlan);
        const today = new Date().toISOString().split("T")[0];
        const todayPlan = plan.days.find((d) => d.date === today);

        if (todayPlan) {
          const todayRecipeIds = Object.values(todayPlan.meals).filter(
            Boolean
          ) as string[];
          const todayRecipes = todayRecipeIds
            .map((id) => getRecipeById(id))
            .filter(Boolean) as typeof RECIPES;

          if (todayRecipes.length > 0) {
            availableRecipes = todayRecipes;
          }
        }
      }

      const snacks = getRecipesByMealType("snack");

      if (glucoseData) {
        const mealRecs = recommendMeal(glucoseData, availableRecipes);
        setRecommendations(mealRecs);

        const snacksSorted = [...snacks];
        if (glucoseData.sgv > 180) {
          snacksSorted.sort((a, b) => a.nutrition.carbs - b.nutrition.carbs);
          setTab("snacks");
        } else if (glucoseData.sgv < 70) {
          snacksSorted.sort((a, b) => b.nutrition.carbs - a.nutrition.carbs);
          setTab("snacks");
        }

        setSnackRecs(
          snacksSorted.map((recipe) => {
            let reason: string;
            if (glucoseData!.sgv > 180) {
              reason = "Glicemia alta — escolhe snacks sem/baixo hidratos";
            } else if (glucoseData!.sgv < 70) {
              reason = "Glicemia baixa — come algo com hidratos rápidos";
            } else {
              reason = "Snack para entre refeições";
            }
            const estimatedCarbs = recipe.nutrition.carbs;
            const estimatedInsulin =
              Math.round(
                (estimatedCarbs / USER_CONFIG.insulinCarbRatio) * 2
              ) / 2;
            return {
              recipe,
              reason,
              suggestedServings: 1,
              estimatedCarbs,
              estimatedInsulin,
            };
          })
        );
      } else {
        const recs = availableRecipes.slice(0, 3).map((recipe) => ({
          recipe,
          reason:
            "Sem dados de glicemia — recomendação baseada no plano do dia",
          suggestedServings: 1,
          estimatedCarbs: recipe.nutrition.carbs,
          estimatedInsulin:
            Math.round(
              (recipe.nutrition.carbs / USER_CONFIG.insulinCarbRatio) * 2
            ) / 2,
        }));
        setRecommendations(recs);

        setSnackRecs(
          snacks.map((recipe) => ({
            recipe,
            reason: "Snack para entre refeições",
            suggestedServings: 1,
            estimatedCarbs: recipe.nutrition.carbs,
            estimatedInsulin:
              Math.round(
                (recipe.nutrition.carbs / USER_CONFIG.insulinCarbRatio) * 2
              ) / 2,
          }))
        );
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

  const currentRecs = tab === "meals" ? recommendations : snackRecs;

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
            <span
              className={`text-sm font-medium ml-auto ${
                getGlucoseStatus(glucose.sgv).color
              }`}
            >
              {getGlucoseStatus(glucose.sgv).label}
            </span>
          </div>

          {glucose.sgv < 70 && (
            <div className="mt-2 p-2 bg-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">
                Come algo com açúcar rápido AGORA (sumo, mel, comprimidos glucose)
              </p>
              <p className="text-xs text-red-700 mt-1">
                Depois de corrigir, espera 15 min e come um snack.
              </p>
            </div>
          )}

          {glucose.sgv > 180 && (
            <div className="mt-2 p-2 bg-orange-200 rounded-lg">
              <p className="text-sm text-orange-800 font-medium">
                Evita hidratos — escolhe snacks sem ou baixos em hidratos
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setTab("meals")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === "meals"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Refeições
        </button>
        <button
          onClick={() => setTab("snacks")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === "snacks"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Snacks
        </button>
      </div>

      {currentRecs.length > 0 && (
        <p className="text-sm text-gray-500">{currentRecs[0].reason}</p>
      )}

      <div className="space-y-3">
        {currentRecs.map((rec, i) => (
          <Link
            key={rec.recipe.id}
            href={`/recipes/${rec.recipe.id}`}
            className="block"
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
                    {rec.recipe.mealType.includes("snack") &&
                      rec.recipe.nutrition.carbs <= 6 &&
                      glucose &&
                      glucose.sgv > 180 && (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Sem hidratos
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
                <span className="text-gray-600">
                  {rec.recipe.nutrition.calories} kcal
                </span>
                {rec.estimatedInsulin > 0 && (
                  <span className="text-blue-600 font-medium">
                    {rec.estimatedInsulin}u Fiasp
                  </span>
                )}
                <span className="text-gray-400">
                  {rec.recipe.prepTimeMinutes + rec.recipe.cookTimeMinutes} min
                </span>
                <span className="ml-auto text-blue-500 text-xs">
                  Ver receita →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
