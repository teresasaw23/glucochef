"use client";

import { useEffect, useState } from "react";
import { GlucoseReading } from "@/lib/types";
import { getDirectionArrow } from "@/lib/insulin";
import Link from "next/link";

export default function GlucoseAlert() {
  const [glucose, setGlucose] = useState<GlucoseReading | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const controller = new AbortController();
    const doFetch = async () => {
      try {
        const res = await fetch("/api/glucose", { signal: controller.signal });
        if (res.ok) {
          setGlucose(await res.json());
          setNow(Date.now());
        }
      } catch {
        // ignore
      }
    };
    doFetch();
    const interval = setInterval(doFetch, 60000);
    return () => { controller.abort(); clearInterval(interval); };
  }, []);

  if (!glucose) return null;

  const sgv = glucose.sgv;
  const arrow = getDirectionArrow(glucose.direction);
  const minutesAgo = Math.round((now - glucose.date) / 60000);
  const isStale = minutesAgo > 15;

  if (isStale) return null;

  if (sgv < 70) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-red-700">{sgv}</span>
          <span className="text-xl">{arrow}</span>
          <span className="text-xs text-red-500">mg/dL</span>
          <span className="ml-auto bg-red-200 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
            GLICEMIA BAIXA
          </span>
        </div>
        <p className="text-sm text-red-800 font-medium">
          Come algo com açúcar rápido agora! (sumo, comprimidos glucose, mel)
        </p>
        <p className="text-xs text-red-600 mt-1">
          Depois de corrigir, espera 15 min e come um snack com hidratos para estabilizar.
        </p>
        <Link
          href="/eat-now"
          className="inline-block mt-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium"
        >
          Ver snacks recomendados
        </Link>
      </div>
    );
  }

  if (sgv > 180) {
    return (
      <div className="bg-orange-100 border border-orange-300 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-orange-700">{sgv}</span>
          <span className="text-xl">{arrow}</span>
          <span className="text-xs text-orange-500">mg/dL</span>
          <span className="ml-auto bg-orange-200 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full">
            GLICEMIA ALTA
          </span>
        </div>
        <p className="text-sm text-orange-800 font-medium">
          Evita hidratos de carbono. Come algo sem/baixo em hidratos.
        </p>
        <p className="text-xs text-orange-600 mt-1">
          Boas opções: salada, legumes crus, ovo cozido, queijo fresco, frutos secos (pequena porção).
        </p>
        <Link
          href="/eat-now"
          className="inline-block mt-2 px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-medium"
        >
          Ver opções sem hidratos
        </Link>
      </div>
    );
  }

  if (sgv > 120 && sgv <= 180) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-yellow-700">{sgv}</span>
          <span className="text-lg">{arrow}</span>
          <span className="text-xs text-yellow-500">mg/dL</span>
          <span className="text-xs text-yellow-700 ml-2">
            Acima do ideal — prefere refeições com menos hidratos
          </span>
        </div>
      </div>
    );
  }

  return null;
}
