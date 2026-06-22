export const USER_CONFIG = {
  insulinCarbRatio: 18, // 1 unit per 18g carbs
  correctionFactor: 80, // 1 unit lowers 80 mg/dL
  targetGlucoseMin: 100,
  targetGlucoseMax: 120,
  targetGlucose: 110, // midpoint for correction calculations
  basalInsulin: { type: "Tresiba", units: 5, time: "morning" },
  rapidInsulin: { type: "Fiasp" },
  nightscoutUrl: "", // set via env var NEXT_PUBLIC_NIGHTSCOUT_URL
};

export function getNightscoutUrl(): string {
  return process.env.NEXT_PUBLIC_NIGHTSCOUT_URL || "";
}
