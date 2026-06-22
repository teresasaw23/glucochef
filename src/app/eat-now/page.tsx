"use client";

import { useState, useEffect } from "react";
import { GlucoseReading, MealPlan } from "@/lib/types";
import { getRecipeById, RECIPES, getRecipesByMealType } from "@/lib/recipes";
import { recommendMeal, Recommendation } from "@/lib/recommend";
import { getGlucoseStatus, getDirectionArrow, calculateInsulinDose } from "@/lib/insulin";
import Link from "next/link";

const PLAN_STORAGE_KEY = "glucochef-meal-plan";

function getServingMultiplier(sgv: number): number {
  if (sgv > 180) return 0.6;
  if (sgv > 150) return 0.75;
  if (sgv > 120) return 0.85;
  if (sgv < 70) return 1.2;
  if (sgv < 90) return 1.1;
  return 1;
}

function getServingLabel(sgv: number): string {
  if (sgv > 180) return "Porção reduzida (glicemia alta)";
  if (sgv > 150) return "Porção ligeiramente reduzida";
  if (sgv > 120) return "Porção moderada";
  if (sgv < 70) return "Porção maior (glicemia baixa)";
  if (sgv < 90) return "Porção ligeiramente maior";
  return "Porção normal";
}

export default function EatNowPage() {
  const [glucose, setGlucose] = useState<GlucoseReading | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [snackRecs, setSnackRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"meals" | "snacks">("meals");
  const [usingPlan, setUsingPlan] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      let glucoseData: GlucoseReading | null = null;
      try {
        const res = await fetch("/api/glucose", { signal: controller.signal });
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
      let fromPlan = false;

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
            fromPlan = true;
          }
        }

        if (!fromPlan) {
          const allPlanIds = new Set<string>();
          for (const day of plan.days) {
            for (const id of Object.values(day.meals)) {
              if (id) allPlanIds.add(id);
            }
          }
          if (allPlanIds.size > 0) {
            const planRecipes = [...allPlanIds]
              .map((id) => getRecipeById(id))
              .filter(Boolean) as typeof RECIPES;
            if (planRecipes.length > 0) {
              availableRecipes = planRecipes;
              fromPlan = true;
            }
          }
        }
      }

      setUsingPlan(fromPlan);
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
            const mult = getServingMultiplier(glucoseData!.sgv);
            const estimatedCarbs = Math.round(recipe.nutrition.carbs * mult);
            const dose = calculateInsulinDose(estimatedCarbs, glucoseData!.sgv);
            const estimatedInsulin = dose.totalDose;
            return {
              recipe,
              reason,
              suggestedServings: mult,
              estimatedCarbs,
              estimatedInsulin,
            };
          })
        );
      } else {
        const recs = availableRecipes.slice(0, 5).map((recipe) => {
          const d = calculateInsulinDose(recipe.nutrition.carbs, 110);
          return {
            recipe,
            reason: fromPlan
              ? "Do teu plano semanal — sem dados de glicemia"
              : "Recomendação geral — sem dados de glicemia",
            suggestedServings: 1,
            estimatedCarbs: recipe.nutrition.carbs,
            estimatedInsulin: d.totalDose,
          };
        });
        setRecommendations(recs);

        setSnackRecs(
          snacks.map((recipe) => {
            const d = calculateInsulinDose(recipe.nutrition.carbs, 110);
            return {
              recipe,
              reason: "Snack para entre refeições",
              suggestedServings: 1,
              estimatedCarbs: recipe.nutrition.carbs,
              estimatedInsulin: d.totalDose,
            };
          })
        );
      }

      setLoading(false);
    };

    load();
    return () => controller.abort();
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
  const servingMult = glucose ? getServingMultiplier(glucose.sgv) : 1;
  const servingLbl = glucose ? getServingLabel(glucose.sgv) : "Porção normal";

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
            <div className="mt-2 p-2 bg-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">
                Evita hidratos — escolhe snacks sem ou baixos em hidratos
              </p>
            </div>
          )}

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-gray-600">
              {servingLbl}
            </span>
            {servingMult !== 1 && (
              <span className="text-xs text-gray-500">
                (×{servingMult} do normal)
              </span>
            )}
          </div>
        </div>
      )}

      {usingPlan && (
        <p className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
          Recomendações baseadas no teu plano semanal
        </p>
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
        {currentRecs.map((rec, i) => {
          const adjCalories = Math.round(rec.recipe.nutrition.calories * rec.suggestedServings);
          const adjCarbs = rec.estimatedCarbs;
          const adjProtein = Math.round(rec.recipe.nutrition.protein * rec.suggestedServings);
          const portionGrams = Math.round(rec.recipe.servingWeightGrams * rec.suggestedServings);
          const normalGrams = rec.recipe.servingWeightGrams;

          return (
            <Link
              key={rec.recipe.id}
              href={`/recipes/${rec.recipe.id}`}
              className="block"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
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
                      {rec.suggestedServings !== 1 && glucose && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          {portionGrams}g (normal: {normalGrams}g)
                        </span>
                      )}
                      {rec.suggestedServings === 1 && (
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          {normalGrams}g porção
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mt-1">{rec.recipe.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {rec.recipe.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                  <div>
                    <p className="text-base font-semibold">{adjCarbs}g</p>
                    <p className="text-xs text-gray-400">Hidratos</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">{adjProtein}g</p>
                    <p className="text-xs text-gray-400">Proteína</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">{adjCalories}</p>
                    <p className="text-xs text-gray-400">kcal</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-blue-600">
                      {rec.estimatedInsulin > 0
                        ? `${rec.estimatedInsulin}u`
                        : "0u"}
                    </p>
                    <p className="text-xs text-gray-400">Fiasp</p>
                  </div>
                </div>

                {portionGrams > 0 && rec.suggestedServings !== 1 && (
                  <div className="mt-2 text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded">
                    Come ~{portionGrams}g em vez dos {normalGrams}g normais
                  </div>
                )}

                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>
                    {rec.recipe.prepTimeMinutes + rec.recipe.cookTimeMinutes} min
                  </span>
                  <span className="ml-auto text-blue-500">
                    Ver receita →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {currentRecs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {tab === "meals"
              ? "Gera um plano semanal primeiro para ter recomendações personalizadas."
              : "Sem snacks disponíveis."}
          </p>
          {tab === "meals" && (
            <Link
              href="/planner"
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              Ir para o Plano Semanal
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
