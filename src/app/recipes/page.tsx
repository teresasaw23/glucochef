"use client";

import { useState } from "react";
import Link from "next/link";
import { RECIPES } from "@/lib/recipes";
import { MEAL_TYPE_LABELS } from "@/lib/types";
import RecipeCard from "@/components/RecipeCard";

export default function RecipesPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = RECIPES.filter((r) => {
    if (filter !== "all" && !r.mealType.includes(filter as typeof r.mealType[number])) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Receitas</h1>
        <Link
          href="/recipes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
        >
          + Nova
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar receitas..."
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: "Todas" },
          { key: "almoco", label: "Almoço" },
          { key: "jantar", label: "Jantar" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400">{filtered.length} receitas</p>

      <div className="space-y-3">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
