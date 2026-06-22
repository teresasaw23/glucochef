"use client";

import { useState, useEffect } from "react";
import { calculateInsulinDose } from "@/lib/insulin";
import { USER_CONFIG } from "@/lib/config";
import { FIXED_BREAKFAST } from "@/lib/recipes";
import { INJECTION_SITES, InjectionLog } from "@/lib/types";

const QUICK_MEALS = [
  { label: "Peq. almoço", carbs: FIXED_BREAKFAST.nutrition.carbs },
];

const INJECTION_LOG_KEY = "glucochef-injection-log";

const RAPID_SITES = INJECTION_SITES.filter((s) => s.insulinType === "rapida");

// Clock-rule positions for belly injection zones (12 o'clock = top)
// Arranged clockwise: top, top-right, right, bottom-right, bottom, bottom-left, left, top-left
const BELLY_ZONES = [
  { id: "barriga-12h", label: "12h", cx: 120, cy: 55 },
  { id: "barriga-1h30", label: "1h30", cx: 155, cy: 65 },
  { id: "barriga-3h", label: "3h", cx: 170, cy: 100 },
  { id: "barriga-4h30", label: "4h30", cx: 155, cy: 135 },
  { id: "barriga-6h", label: "6h", cx: 120, cy: 150 },
  { id: "barriga-7h30", label: "7h30", cx: 85, cy: 135 },
  { id: "barriga-9h", label: "9h", cx: 70, cy: 100 },
  { id: "barriga-10h30", label: "10h30", cx: 85, cy: 65 },
];

function getSuggestedRapidSite(logs: InjectionLog[]): string {
  const rapidLogs = logs
    .filter((l) => l.insulinType === "rapida")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (rapidLogs.length === 0) return RAPID_SITES[0].id;

  const lastSiteId = rapidLogs[0].siteId;
  const lastIndex = RAPID_SITES.findIndex((s) => s.id === lastSiteId);
  return RAPID_SITES[(lastIndex + 1) % RAPID_SITES.length].id;
}

function getBellyZoneIndex(logs: InjectionLog[]): number {
  const bellyLogs = logs
    .filter((l) => l.insulinType === "rapida" && l.siteId.startsWith("barriga"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (bellyLogs.length === 0) return 0;

  const lastZone = bellyLogs[0].siteId;
  const lastIdx = BELLY_ZONES.findIndex((z) => z.id === lastZone);
  return (lastIdx + 1) % BELLY_ZONES.length;
}

export default function InsulinCalculator() {
  const [carbs, setCarbs] = useState<string>("");
  const [glucose, setGlucose] = useState<string>("");
  const [result, setResult] = useState<ReturnType<typeof calculateInsulinDose> | null>(null);
  const [injectionLogs, setInjectionLogs] = useState<InjectionLog[]>([]);
  const [suggestedSite, setSuggestedSite] = useState<string>("");
  const [bellyZone, setBellyZone] = useState(0);
  const [calcCount, setCalcCount] = useState(0);

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

  useEffect(() => {
    const init = () => {
      const saved = localStorage.getItem(INJECTION_LOG_KEY);
      const logs: InjectionLog[] = saved ? JSON.parse(saved) : [];
      setInjectionLogs(logs);
      setSuggestedSite(getSuggestedRapidSite(logs));
      setBellyZone(getBellyZoneIndex(logs));
    };
    requestAnimationFrame(init);
  }, []);

  function handleCalculate() {
    const c = parseFloat(carbs);
    const g = parseFloat(glucose);
    if (isNaN(c) || isNaN(g)) return;
    setResult(calculateInsulinDose(c, g));

    // Rotate injection site on each calculation
    const newCount = calcCount + 1;
    setCalcCount(newCount);

    const siteIndex = newCount % RAPID_SITES.length;
    setSuggestedSite(RAPID_SITES[siteIndex].id);

    const zoneIndex = newCount % BELLY_ZONES.length;
    setBellyZone(zoneIndex);
  }

  function logInjection() {
    if (!result) return;

    const siteId = suggestedSite.startsWith("barriga")
      ? BELLY_ZONES[bellyZone].id
      : suggestedSite;

    const newLog: InjectionLog = {
      date: new Date().toISOString(),
      siteId,
      insulinType: "rapida",
      units: result.totalDose,
    };
    const newLogs = [newLog, ...injectionLogs];
    setInjectionLogs(newLogs);
    localStorage.setItem(INJECTION_LOG_KEY, JSON.stringify(newLogs));

    // Move to next site/zone
    const nextSiteIndex = (RAPID_SITES.findIndex((s) => s.id === suggestedSite) + 1) % RAPID_SITES.length;
    setSuggestedSite(RAPID_SITES[nextSiteIndex].id);
    setBellyZone((bellyZone + 1) % BELLY_ZONES.length);
  }

  const currentSiteLabel = RAPID_SITES.find((s) => s.id === suggestedSite)?.label || "Barriga (esquerda)";
  const currentZone = BELLY_ZONES[bellyZone];

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
          <div className="space-y-3">
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

            {/* Injection site suggestion */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Injetar Fiasp em:</p>
                  <p className="text-base font-bold text-orange-700">
                    {currentSiteLabel}
                  </p>
                  {suggestedSite.startsWith("barriga") && (
                    <p className="text-xs text-orange-600 mt-0.5">
                      Zona {currentZone.label} (regra do relógio)
                    </p>
                  )}
                  <button
                    onClick={logInjection}
                    className="mt-2 px-4 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-medium hover:bg-orange-700"
                  >
                    Registar injeção aqui
                  </button>
                </div>

                {/* Belly clock-rule illustration */}
                {suggestedSite.startsWith("barriga") && (
                  <svg viewBox="0 0 240 200" className="w-32 h-28 shrink-0">
                    {/* Body outline */}
                    <ellipse cx="120" cy="100" rx="80" ry="70" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.5" />
                    {/* Navel */}
                    <circle cx="120" cy="100" r="5" fill="#FDBA74" stroke="#EA580C" strokeWidth="1" />
                    {/* No-go zone around navel */}
                    <circle cx="120" cy="100" r="20" fill="none" stroke="#EA580C" strokeWidth="0.5" strokeDasharray="3,3" />
                    {/* Injection zones */}
                    {BELLY_ZONES.map((zone, i) => (
                      <g key={zone.id}>
                        <circle
                          cx={zone.cx}
                          cy={zone.cy}
                          r={i === bellyZone ? 10 : 7}
                          fill={i === bellyZone ? "#EA580C" : "#FED7AA"}
                          stroke={i === bellyZone ? "#9A3412" : "#FB923C"}
                          strokeWidth={i === bellyZone ? 2 : 1}
                        />
                        <text
                          x={zone.cx}
                          y={zone.cy + 3}
                          textAnchor="middle"
                          fontSize="7"
                          fill={i === bellyZone ? "white" : "#9A3412"}
                          fontWeight={i === bellyZone ? "bold" : "normal"}
                        >
                          {zone.label}
                        </text>
                      </g>
                    ))}
                    {/* Label */}
                    <text x="120" y="190" textAnchor="middle" fontSize="8" fill="#9A3412">
                      Regra do relógio
                    </text>
                  </svg>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
