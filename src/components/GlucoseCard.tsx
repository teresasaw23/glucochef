"use client";

import { useEffect, useState } from "react";
import { GlucoseReading } from "@/lib/types";
import { getGlucoseStatus, getDirectionArrow } from "@/lib/insulin";

export default function GlucoseCard() {
  const [glucose, setGlucose] = useState<GlucoseReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchGlucose() {
    try {
      const res = await fetch("/api/glucose");
      if (!res.ok) {
        setError("Sem dados de glicemia");
        return;
      }
      const data = await res.json();
      setGlucose(data);
      setError(null);
    } catch {
      setError("Erro ao ligar ao Nightscout");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGlucose();
    const interval = setInterval(fetchGlucose, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-gray-100 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-16 bg-gray-200 rounded w-24" />
      </div>
    );
  }

  if (error || !glucose) {
    return (
      <div className="rounded-2xl bg-gray-100 p-6">
        <p className="text-sm text-gray-500">Glicemia</p>
        <p className="text-lg text-gray-400 mt-2">{error || "Sem dados"}</p>
        <p className="text-xs text-gray-400 mt-1">
          Configura NEXT_PUBLIC_NIGHTSCOUT_URL
        </p>
      </div>
    );
  }

  const status = getGlucoseStatus(glucose.sgv);
  const arrow = getDirectionArrow(glucose.direction);
  const minutesAgo = Math.round((Date.now() - glucose.date) / 60000);

  return (
    <div className={`rounded-2xl ${status.bgColor} p-6`}>
      <p className="text-sm text-gray-600">Glicemia Atual</p>
      <div className="flex items-end gap-2 mt-1">
        <span className={`text-5xl font-bold ${status.color}`}>
          {glucose.sgv}
        </span>
        <span className="text-3xl mb-1">{arrow}</span>
        <span className="text-sm text-gray-500 mb-2">mg/dL</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-sm font-medium ${status.color}`}>
          {status.label}
        </span>
        <span className="text-xs text-gray-400">
          {minutesAgo < 1
            ? "agora"
            : minutesAgo === 1
            ? "há 1 min"
            : `há ${minutesAgo} min`}
        </span>
      </div>
    </div>
  );
}
