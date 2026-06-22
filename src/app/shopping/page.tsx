"use client";

import { useState, useEffect } from "react";
import { MealPlan, SHOPPING_CATEGORY_LABELS, ShoppingItem, ShoppingCategory } from "@/lib/types";
import { generateShoppingList, groupByCategory } from "@/lib/shopping";

const PLAN_STORAGE_KEY = "glucochef-meal-plan";
const SHOPPING_STORAGE_KEY = "glucochef-shopping-list";

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [store, setStore] = useState<"aldi" | "continente">("continente");

  useEffect(() => {
    let cancelled = false;
    const loadList = () => {
      if (cancelled) return;
      const savedList = localStorage.getItem(SHOPPING_STORAGE_KEY);
      if (savedList) {
        setItems(JSON.parse(savedList));
        return;
      }
      const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
      if (savedPlan) {
        const plan: MealPlan = JSON.parse(savedPlan);
        const list = generateShoppingList(plan);
        setItems(list);
        localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(list));
      }
    };
    requestAnimationFrame(loadList);
    return () => { cancelled = true; };
  }, []);

  function handleToggle(index: number) {
    const updated = [...items];
    updated[index] = { ...updated[index], checked: !updated[index].checked };
    setItems(updated);
    localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(updated));
  }

  function handleRegenerate() {
    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
    if (!savedPlan) return;
    const plan: MealPlan = JSON.parse(savedPlan);
    const list = generateShoppingList(plan);
    setItems(list);
    localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(list));
  }

  function handleClearChecked() {
    const updated = items.filter((i) => !i.checked);
    setItems(updated);
    localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(updated));
  }

  const grouped = groupByCategory(items);
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Lista de Compras</h1>
          <p className="text-sm text-gray-500">
            {items.length} itens ({checkedCount} comprados)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRegenerate}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50"
          >
            Atualizar
          </button>
          {checkedCount > 0 && (
            <button
              onClick={handleClearChecked}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setStore("continente")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            store === "continente"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Continente
        </button>
        <button
          onClick={() => setStore("aldi")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            store === "aldi"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Aldi
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Cria primeiro um plano semanal</p>
          <a href="/planner" className="text-blue-600 text-sm mt-2 inline-block">
            Ir para o Plano
          </a>
        </div>
      ) : (
        <div className="space-y-5">
          {(Object.entries(grouped) as [ShoppingCategory, ShoppingItem[]][]).map(
            ([category, categoryItems]) => {
              return (
                <div key={category}>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {SHOPPING_CATEGORY_LABELS[category]}
                  </h2>
                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {categoryItems.map((item, i) => {
                      const itemIndex = items.findIndex(
                        (it) =>
                          it.name === item.name &&
                          it.unit === item.unit &&
                          it.category === item.category
                      );

                      return (
                        <button
                          key={`${item.name}-${i}`}
                          onClick={() => handleToggle(itemIndex)}
                          className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-50"
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              item.checked
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {item.checked && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`flex-1 text-sm ${
                              item.checked
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {item.quantity} {item.unit}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
