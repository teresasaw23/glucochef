import { USER_CONFIG } from "./config";
import { InsulinDose } from "./types";

/**
 * Diabetes:M algorithm for insulin bolus calculation.
 *
 * correction = (glucose - target) / sensitivity
 *
 * IF glucose > target AND correction <= IOBcarb THEN
 *   correction = -IOBcorr
 * IF glucose > target AND correction > IOBcarb THEN
 *   correction = correction - IOB
 * IF glucose <= target THEN
 *   correction = correction - IOBcorr
 *
 * bolus = (carbs / ratio) + correction
 */
export function calculateInsulinDose(
  carbsGrams: number,
  currentGlucose: number,
  iob: number = 0,
  iobCarb: number = 0,
  iobCorr: number = 0,
): InsulinDose {
  const { insulinCarbRatio, correctionFactor, targetGlucose } = USER_CONFIG;

  const carbBolus = carbsGrams / insulinCarbRatio;

  let correction = (currentGlucose - targetGlucose) / correctionFactor;

  if (currentGlucose > targetGlucose) {
    if (correction <= iobCarb) {
      correction = -iobCorr;
    } else {
      correction = correction - iob;
    }
  } else {
    correction = correction - iobCorr;
  }

  const totalBolus = carbBolus + correction;
  const roundedTotal = Math.max(0, Math.round(totalBolus * 10) / 10);

  return {
    carbDose: Math.round(carbBolus * 100) / 100,
    correctionDose: Math.round(correction * 100) / 100,
    totalDose: roundedTotal,
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
  if (sgv < 100) return { label: "Normal", color: "text-green-700", bgColor: "bg-green-100" };
  if (sgv <= 120) return { label: "Ideal", color: "text-green-700", bgColor: "bg-green-100" };
  if (sgv <= 180) return { label: "Acima do ideal", color: "text-green-700", bgColor: "bg-green-100" };
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
