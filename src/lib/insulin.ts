import { USER_CONFIG } from "./config";
import { InsulinDose } from "./types";

export function calculateInsulinDose(
  carbsGrams: number,
  currentGlucose: number
): InsulinDose {
  const { insulinCarbRatio, correctionFactor, targetGlucose } = USER_CONFIG;

  const carbDose = carbsGrams / insulinCarbRatio;

  let correctionDose = 0;
  if (currentGlucose > USER_CONFIG.targetGlucoseMax) {
    correctionDose = (currentGlucose - targetGlucose) / correctionFactor;
  }

  const totalDose = Math.max(0, Math.round((carbDose + correctionDose) * 2) / 2);

  return {
    carbDose: Math.round(carbDose * 10) / 10,
    correctionDose: Math.round(correctionDose * 10) / 10,
    totalDose,
    carbsGrams,
    currentGlucose,
  };
}

export function getGlucoseStatus(sgv: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (sgv < 70) return { label: "Baixa", color: "text-red-700", bgColor: "bg-red-100" };
  if (sgv < 100) return { label: "Abaixo do ideal", color: "text-yellow-700", bgColor: "bg-yellow-100" };
  if (sgv <= 120) return { label: "Ideal", color: "text-green-700", bgColor: "bg-green-100" };
  if (sgv <= 180) return { label: "Acima do ideal", color: "text-orange-700", bgColor: "bg-orange-100" };
  return { label: "Alta", color: "text-red-700", bgColor: "bg-red-100" };
}

export function getDirectionArrow(direction: string): string {
  const arrows: Record<string, string> = {
    DoubleUp: "⇈",
    SingleUp: "↑",
    FortyFiveUp: "↗",
    Flat: "→",
    FortyFiveDown: "↘",
    SingleDown: "↓",
    DoubleDown: "⇊",
    "NOT COMPUTABLE": "?",
    "RATE OUT OF RANGE": "⚠",
  };
  return arrows[direction] || "→";
}
