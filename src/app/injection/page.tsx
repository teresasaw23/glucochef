"use client";

import { useState, useEffect } from "react";
import { INJECTION_SITES, InjectionLog } from "@/lib/types";

const STORAGE_KEY = "glucochef-injection-log";

function getSuggestedSite(
  logs: InjectionLog[],
  insulinType: "rapida" | "basal"
): string {
  const sites = INJECTION_SITES.filter((s) => s.insulinType === insulinType);
  const recentLogs = logs
    .filter((l) => l.insulinType === insulinType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (recentLogs.length === 0) return sites[0].id;

  const lastSiteId = recentLogs[0].siteId;
  const lastIndex = sites.findIndex((s) => s.id === lastSiteId);
  const nextIndex = (lastIndex + 1) % sites.length;
  return sites[nextIndex].id;
}

function getLastUsedDate(
  logs: InjectionLog[],
  siteId: string
): string | null {
  const siteLogs = logs
    .filter((l) => l.siteId === siteId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return siteLogs.length > 0 ? siteLogs[0].date : null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHrs < 1) return "Há menos de 1h";
  if (diffHrs < 24) return `Há ${diffHrs}h`;
  const diffDays = Math.round(diffHrs / 24);
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return d.toLocaleDateString("pt-PT");
}

export default function InjectionPage() {
  const [logs, setLogs] = useState<InjectionLog[]>([]);
  const [tab, setTab] = useState<"rapida" | "basal">("rapida");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const init = () => {
      if (controller.signal.aborted) return;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLogs(JSON.parse(saved));
      }
      setLoaded(true);
    };
    requestAnimationFrame(init);
    return () => controller.abort();
  }, []);

  function saveLogs(newLogs: InjectionLog[]) {
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  }

  function logInjection(siteId: string) {
    const newLog: InjectionLog = {
      date: new Date().toISOString(),
      siteId,
      insulinType: tab,
      units: tab === "basal" ? 5 : 0,
    };
    saveLogs([newLog, ...logs]);
  }

  if (!loaded) {
    return (
      <div className="px-4 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const suggestedSite = getSuggestedSite(logs, tab);
  const sites = INJECTION_SITES.filter((s) => s.insulinType === tab);

  return (
    <div className="px-4 pt-6 pb-24 space-y-4">
      <h1 className="text-xl font-bold">Locais de Injeção</h1>
      <p className="text-sm text-gray-500">
        Alterna os locais para evitar injetar no mesmo sítio consecutivamente.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("rapida")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            tab === "rapida"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Fiasp (rápida)
        </button>
        <button
          onClick={() => setTab("basal")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            tab === "basal"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Tresiba (basal)
        </button>
      </div>

      <div
        className={`rounded-xl p-4 ${
          tab === "rapida" ? "bg-blue-50 border border-blue-200" : "bg-purple-50 border border-purple-200"
        }`}
      >
        <p className="text-xs text-gray-500 mb-1">Próximo local sugerido:</p>
        <p
          className={`text-lg font-bold ${
            tab === "rapida" ? "text-blue-700" : "text-purple-700"
          }`}
        >
          {INJECTION_SITES.find((s) => s.id === suggestedSite)?.label}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {tab === "rapida"
            ? "Fiasp: barriga ou braço"
            : "Tresiba: perna ou parte de baixo das costas"}
        </p>
        <button
          onClick={() => logInjection(suggestedSite)}
          className={`mt-3 w-full py-2 rounded-lg text-sm font-medium text-white ${
            tab === "rapida" ? "bg-blue-600" : "bg-purple-600"
          }`}
        >
          Registar injeção aqui
        </button>
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mt-4">
        Todos os locais ({tab === "rapida" ? "Fiasp" : "Tresiba"}):
      </h2>

      <div className="space-y-2">
        {sites.map((site) => {
          const lastUsed = getLastUsedDate(logs, site.id);
          const isSuggested = site.id === suggestedSite;
          const isLastUsed =
            logs.filter((l) => l.insulinType === tab).length > 0 &&
            logs.filter((l) => l.insulinType === tab)[0]?.siteId === site.id;

          return (
            <div
              key={site.id}
              className={`rounded-xl p-3 border flex items-center justify-between ${
                isSuggested
                  ? tab === "rapida"
                    ? "border-blue-300 bg-blue-50"
                    : "border-purple-300 bg-purple-50"
                  : isLastUsed
                  ? "border-orange-200 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{site.label}</span>
                  {isSuggested && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tab === "rapida"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      Sugerido
                    </span>
                  )}
                  {isLastUsed && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                      Último usado
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {lastUsed ? `Último: ${formatDate(lastUsed)}` : "Nunca usado"}
                </p>
              </div>
              <button
                onClick={() => logInjection(site.id)}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Registar
              </button>
            </div>
          );
        })}
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mt-6">
        Histórico recente:
      </h2>
      {logs.filter((l) => l.insulinType === tab).length === 0 ? (
        <p className="text-sm text-gray-400">
          Ainda não registaste nenhuma injeção de{" "}
          {tab === "rapida" ? "Fiasp" : "Tresiba"}.
        </p>
      ) : (
        <div className="space-y-1">
          {logs
            .filter((l) => l.insulinType === tab)
            .slice(0, 10)
            .map((log, i) => {
              const site = INJECTION_SITES.find((s) => s.id === log.siteId);
              return (
                <div
                  key={`${log.date}-${i}`}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100"
                >
                  <span className="text-gray-700">{site?.label}</span>
                  <span className="text-xs text-gray-400">
                    {formatDate(log.date)}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
