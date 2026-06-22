"use client";

import { useState, useEffect } from "react";
import { calculateInsulinDose } from "@/lib/insulin";
import { USER_CONFIG } from "@/lib/config";
import { FIXED_BREAKFAST } from "@/lib/recipes";

const QUICK_MEALS = [
  { label: "Peq. almoço", carbs: FIXED_BREAKFAST.nutrition.carbs },
];

export default function InsulinCalculator() {
  const [carbs, setCarbs] = useState<string>("");
  const [glucose, setGlucose] = useState<string>("");
  const [result, setResult] = useState<ReturnType<typeof calculateInsulinDose> | null>(null);

  useEffect(() => {
    async function fetchGlucose() {
      try {
        const res = await fetch("/api/glucose");
        if (res.ok) {
          const data = await res.json();
          setGlucose(String(data.sgv));
        }
      } catch {
        // ignore
      }
    }
    fetchGlucose();
  }, []);

  function handleCalculate() {
    const c = parseFloat(carbs);
    const g = parseFloat(glucose);
    if (isNaN(c) || isNaN(g)) return;
    setResult(calculateInsulinDose(c, g));
  }

  function handleQuickMeal(carbsValue: number) {
    setCarbs(String(carbsValue));
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Calculadora de Insulina</h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm text-gray-600">
              Hidratos de carbono (g)
            </label>
            <div className="flex gap-1.5">
              {QUICK_MEALS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => handleQuickMeal(m.carbs)}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-700"
                >
                  {m.label} ({m.carbs}g)
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            inputMode="decimal"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="Ex: 45"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Glicemia atual (mg/dL)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            placeholder="Ex: 150"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-3 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Calcular
        </button>

        {result && (
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-500">Dose Total de Fiasp</p>
              <p className="text-4xl font-bold text-blue-700">
                {result.totalDose}
                <span className="text-lg font-normal ml-1">unidades</span>
              </p>
            </div>

            <div className="border-t border-blue-200 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dose para hidratos</span>
                <span className="font-medium">
                  {result.carbsGrams}g / {USER_CONFIG.insulinCarbRatio} ={" "}
                  {result.carbDose}u
                </span>
              </div>
              {result.correctionDose !== 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {result.correctionDose > 0 ? "Correção +" : "Correção"}
                  </span>
                  <span className="font-medium">
                    ({result.currentGlucose} − {USER_CONFIG.targetGlucose}) /{" "}
                    {USER_CONFIG.correctionFactor} = {result.correctionDose > 0 ? "+" : ""}{result.correctionDose}u
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-400 pt-1">
                <span>Algoritmo Diabetes:M</span>
                <span>Alvo: {USER_CONFIG.targetGlucose} mg/dL</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
