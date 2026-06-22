"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GlucoseReading } from "@/lib/types";
import { COMMON_FOODS } from "@/lib/foods";
import { USER_CONFIG } from "@/lib/config";
import { calculateInsulinDose, getGlucoseStatus, getDirectionArrow } from "@/lib/insulin";

interface SelectedFood {
  name: string;
  brand?: string;
  carbsPer100g: number;
  grams: number;
  source: "local" | "openfoodfacts";
}

interface OFFProduct {
  name: string;
  brand: string;
  carbsPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  kcalPer100g: number;
  servingGrams: number;
  servingSize: string;
}

export default function EstimatorPage() {
  const [search, setSearch] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [glucose, setGlucose] = useState<GlucoseReading | null>(null);
  const [offResults, setOffResults] = useState<OFFProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"local" | "openfoodfacts">("local");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/glucose", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setGlucose(data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const searchOFF = useCallback((query: string) => {
    if (query.length < 3) {
      setOffResults([]);
      return;
    }
    setSearching(true);
    fetch(`/api/food-search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setOffResults(data.products || []);
        setSearching(false);
      })
      .catch(() => {
        setSearching(false);
      });
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length >= 3) {
      debounceRef.current = setTimeout(() => searchOFF(value), 400);
    } else {
      setOffResults([]);
    }
  }

  const localResults = search.length >= 2
    ? COMMON_FOODS.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 10)
    : [];

  function addLocalFood(food: typeof COMMON_FOODS[number]) {
    setSelectedFoods((prev) => [
      ...prev,
      {
        name: food.name,
        carbsPer100g: food.carbsPer100g,
        grams: food.typicalPortionGrams,
        source: "local",
      },
    ]);
    setSearch("");
    setOffResults([]);
  }

  function addOFFFood(product: OFFProduct) {
    setSelectedFoods((prev) => [
      ...prev,
      {
        name: product.name,
        brand: product.brand,
        carbsPer100g: product.carbsPer100g,
        grams: product.servingGrams,
        source: "openfoodfacts",
      },
    ]);
    setSearch("");
    setOffResults([]);
  }

  function updateGrams(index: number, grams: number) {
    setSelectedFoods((prev) =>
      prev.map((f, i) => (i === index ? { ...f, grams } : f))
    );
  }

  function removeFood(index: number) {
    setSelectedFoods((prev) => prev.filter((_, i) => i !== index));
  }

  const totalCarbs = selectedFoods.reduce(
    (sum, f) => sum + Math.round((f.carbsPer100g * f.grams) / 100),
    0
  );

  const currentGlucose = glucose?.sgv ?? 100;
  const dose = calculateInsulinDose(totalCarbs, currentGlucose);
  const categories = [...new Set(COMMON_FOODS.map((f) => f.category))];

  return (
    <div className="px-4 pt-6 pb-24 space-y-4">
      <h1 className="text-xl font-bold">Estimar Hidratos</h1>
      <p className="text-sm text-gray-500">
        Pesquisa alimentos locais ou produtos reais (Open Food Facts) e calcula hidratos + dose de Fiasp.
      </p>

      {glucose && (
        <div
          className={`rounded-xl p-3 flex items-center gap-2 ${
            getGlucoseStatus(glucose.sgv).bgColor
          }`}
        >
          <span
            className={`text-lg font-bold ${
              getGlucoseStatus(glucose.sgv).color
            }`}
          >
            {glucose.sgv}
          </span>
          <span>{getDirectionArrow(glucose.direction)}</span>
          <span className="text-xs text-gray-500">mg/dL</span>
          <span
            className={`text-xs font-medium ml-auto ${
              getGlucoseStatus(glucose.sgv).color
            }`}
          >
            {getGlucoseStatus(glucose.sgv).label}
          </span>
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          placeholder="Procurar alimento (ex: arroz, skyr, pão shape...)"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-400 focus:outline-none"
        />

        {(localResults.length > 0 || offResults.length > 0 || searching) && search.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("local")}
                className={`flex-1 py-2 text-xs font-medium ${
                  activeTab === "local"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400"
                }`}
              >
                Local ({localResults.length})
              </button>
              <button
                onClick={() => setActiveTab("openfoodfacts")}
                className={`flex-1 py-2 text-xs font-medium ${
                  activeTab === "openfoodfacts"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-400"
                }`}
              >
                Produtos reais {searching ? "..." : `(${offResults.length})`}
              </button>
            </div>

            {activeTab === "local" && localResults.map((food) => (
              <button
                key={food.name}
                onClick={() => addLocalFood(food)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">{food.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {food.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-blue-600 font-medium">
                      {food.carbsPer100g}g HC/100g
                    </span>
                    <span className="text-xs text-gray-400 block">
                      Porção: {food.typicalPortionGrams}g
                    </span>
                  </div>
                </div>
              </button>
            ))}

            {activeTab === "openfoodfacts" && searching && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                A pesquisar produtos...
              </div>
            )}

            {activeTab === "openfoodfacts" && !searching && offResults.length === 0 && search.length >= 3 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                Nenhum produto encontrado. Tenta outro termo.
              </div>
            )}

            {activeTab === "openfoodfacts" && !searching && offResults.map((product, i) => (
              <button
                key={`${product.name}-${i}`}
                onClick={() => addOFFFood(product)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0 mr-2">
                    <span className="text-sm font-medium block truncate">
                      {product.name}
                    </span>
                    {product.brand && (
                      <span className="text-xs text-green-600">
                        {product.brand}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-blue-600 font-medium">
                      {product.carbsPer100g}g HC/100g
                    </span>
                    <span className="text-xs text-gray-400 block">
                      {product.servingSize || `${product.servingGrams}g`}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedFoods.length === 0 && search.length < 2 && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 font-medium">
            Alimentos comuns (INSA/APDP):
          </p>
          {categories.slice(0, 6).map((cat) => (
            <div key={cat}>
              <p className="text-xs text-gray-500 font-medium mb-1">{cat}</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_FOODS.filter((f) => f.category === cat)
                  .slice(0, 6)
                  .map((food) => (
                    <button
                      key={food.name}
                      onClick={() => addLocalFood(food)}
                      className="text-xs px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
                    >
                      {food.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 mt-2">
            Pesquisa por nome para ver produtos do Continente, Aldi e mais (via Open Food Facts).
          </p>
        </div>
      )}

      {selectedFoods.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-700">O teu prato:</h2>
          <div className="space-y-2">
            {selectedFoods.map((food, i) => {
              const carbsForPortion = Math.round(
                (food.carbsPer100g * food.grams) / 100
              );
              return (
                <div
                  key={`${food.name}-${i}`}
                  className="bg-white border border-gray-200 rounded-xl p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block truncate">{food.name}</span>
                      {food.brand && (
                        <span className="text-xs text-green-600">{food.brand}</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFood(i)}
                      className="text-red-400 text-xs hover:text-red-600 ml-2"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateGrams(i, Math.max(10, food.grams - 10))
                        }
                        className="w-7 h-7 bg-gray-100 rounded-lg text-sm font-medium"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={food.grams}
                        onChange={(e) =>
                          updateGrams(
                            i,
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        }
                        className="w-16 text-center text-sm font-semibold border border-gray-200 rounded-lg py-1"
                      />
                      <button
                        onClick={() => updateGrams(i, food.grams + 10)}
                        className="w-7 h-7 bg-gray-100 rounded-lg text-sm font-medium"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-400 ml-1">g</span>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-sm font-semibold text-blue-600">
                        {carbsForPortion}g HC
                      </span>
                      <span className="text-xs text-gray-400 block">
                        {food.carbsPer100g}g/100g
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {totalCarbs}g
                </p>
                <p className="text-xs text-gray-500">Hidratos total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {dose.carbDose}u
                </p>
                <p className="text-xs text-gray-500">Dose HC</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {dose.totalDose}u
                </p>
                <p className="text-xs text-gray-500">Fiasp total</p>
              </div>
            </div>
            {dose.correctionDose > 0 && (
              <p className="text-xs text-center text-orange-600 mt-2">
                +{dose.correctionDose}u correção (glicemia {currentGlucose}{" "}
                → alvo {USER_CONFIG.targetGlucose})
              </p>
            )}
            <p className="text-xs text-center text-gray-400 mt-2">
              Algoritmo Diabetes:M | 1u / {USER_CONFIG.insulinCarbRatio}g HC | Alvo: {USER_CONFIG.targetGlucose} mg/dL
            </p>
          </div>
        </>
      )}
    </div>
  );
}
