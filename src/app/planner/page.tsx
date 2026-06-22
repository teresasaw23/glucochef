"use client";

import { useState, useEffect } from "react";
import { MealPlan, MEAL_TYPE_LABELS } from "@/lib/types";
import { generateWeeklyPlan, getAlternativesForMeal } from "@/lib/planner";
import { getRecipeById } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";

const STORAGE_KEY = "glucochef-meal-plan";

export default function PlannerPage() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [swapping, setSwapping] = useState<{
    dayIndex: number;
    mealType: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadPlan = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!cancelled) {
        if (saved) {
          setPlan(JSON.parse(saved));
        } else {
          const newPlan = generateWeeklyPlan();
          setPlan(newPlan);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
        }
      }
    };
    requestAnimationFrame(loadPlan);
    return () => { cancelled = true; };
  }, []);

  function handleNewPlan() {
    const newPlan = generateWeeklyPlan();
    setPlan(newPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
  }

  function handleSwap(dayIndex: number, mealType: string) {
    setSwapping({ dayIndex, mealType });
  }

  function handleSelectAlternative(recipeId: string) {
    if (!plan || !swapping) return;
    const updated = { ...plan, days: [...plan.days] };
    updated.days[swapping.dayIndex] = {
      ...updated.days[swapping.dayIndex],
      meals: {
        ...updated.days[swapping.dayIndex].meals,
        [swapping.mealType]: recipeId,
      } as typeof updated.days[number]["meals"],
    };
    setPlan(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSwapping(null);
  }

  if (!plan) {
    return (
      <div className="px-4 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (swapping) {
    const currentId =
      plan.days[swapping.dayIndex].meals[
        swapping.mealType as keyof typeof plan.days[number]["meals"]
      ];
    const alternatives = getAlternativesForMeal(
      swapping.mealType,
      currentId || ""
    );

    return (
      <div className="px-4 pt-6 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSwapping(null)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">Trocar Refeição</h1>
            <p className="text-sm text-gray-500">
              {plan.days[swapping.dayIndex].dayOfWeek} -{" "}
              {MEAL_TYPE_LABELS[swapping.mealType]}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {alternatives.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => handleSelectAlternative(recipe.id)}
              className="w-full text-left"
            >
              <RecipeCard recipe={recipe} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Plano Semanal</h1>
          <p className="text-sm text-gray-500">
            Semana de {plan.weekStartDate}
          </p>
        </div>
        <button
          onClick={handleNewPlan}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
        >
          Novo Plano
        </button>
      </div>

      {plan.days.map((day, dayIndex) => (
        <div key={day.date} className="space-y-2">
          <h2 className="font-semibold text-base pt-2">
            {day.dayOfWeek}
            <span className="text-gray-400 font-normal text-sm ml-2">
              {day.date}
            </span>
          </h2>

          {(["almoco", "jantar"] as const).map((mealType) => {
            const recipeId = day.meals[mealType];
            const recipe = recipeId ? getRecipeById(recipeId) : null;

            return (
              <div key={mealType}>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {MEAL_TYPE_LABELS[mealType]}
                </p>
                {recipe ? (
                  <RecipeCard
                    recipe={recipe}
                    compact
                    showSwap
                    onSwap={() => handleSwap(dayIndex, mealType)}
                  />
                ) : (
                  <div className="bg-gray-100 rounded-xl p-3 text-sm text-gray-400">
                    Sem refeição
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
