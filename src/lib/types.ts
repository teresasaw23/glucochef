export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  servingWeightGrams: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  mealType: MealType[];
  ingredients: Ingredient[];
  steps: string[];
  nutrition: NutritionPerServing;
  tags: string[];
  source?: string;
  isCustom?: boolean;
}

export interface InjectionSite {
  id: string;
  label: string;
  insulinType: "rapida" | "basal";
}

export interface InjectionLog {
  date: string;
  siteId: string;
  insulinType: "rapida" | "basal";
  units: number;
}

export const INJECTION_SITES: InjectionSite[] = [
  { id: "barriga-esq", label: "Barriga (esquerda)", insulinType: "rapida" },
  { id: "barriga-dir", label: "Barriga (direita)", insulinType: "rapida" },
  { id: "braco-esq", label: "Braço (esquerdo)", insulinType: "rapida" },
  { id: "braco-dir", label: "Braço (direito)", insulinType: "rapida" },
  { id: "perna-esq", label: "Perna (esquerda)", insulinType: "basal" },
  { id: "perna-dir", label: "Perna (direita)", insulinType: "basal" },
  { id: "costas-esq", label: "Costas baixas (esquerda)", insulinType: "basal" },
  { id: "costas-dir", label: "Costas baixas (direita)", insulinType: "basal" },
];

export interface CommonFood {
  name: string;
  carbsPer100g: number;
  typicalPortionGrams: number;
  category: string;
}

export type MealType = "pequeno-almoco" | "almoco" | "jantar" | "snack";

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: ShoppingCategory;
}

export type ShoppingCategory =
  | "frutas-legumes"
  | "talho-peixaria"
  | "padaria"
  | "mercearia"
  | "lacticinios"
  | "congelados"
  | "bebidas"
  | "temperos"
  | "outros";

export const SHOPPING_CATEGORY_LABELS: Record<ShoppingCategory, string> = {
  "frutas-legumes": "Frutas e Legumes",
  "talho-peixaria": "Talho e Peixaria",
  "padaria": "Padaria",
  "mercearia": "Mercearia",
  "lacticinios": "Laticínios",
  "congelados": "Congelados",
  "bebidas": "Bebidas",
  "temperos": "Temperos e Especiarias",
  "outros": "Outros",
};

export interface NutritionPerServing {
  calories: number;
  carbs: number; // grams
  protein: number; // grams
  fat: number; // grams
  fiber: number; // grams
}

export interface MealPlan {
  weekStartDate: string; // ISO date
  days: DayPlan[];
}

export interface DayPlan {
  date: string;
  dayOfWeek: string;
  meals: {
    "almoco": string | null;
    "jantar": string | null;
  };
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: ShoppingCategory;
  checked: boolean;
}

export interface GlucoseReading {
  sgv: number; // mg/dL
  direction: string;
  date: number; // epoch ms
  dateString: string;
}

export interface InsulinDose {
  carbDose: number;
  correctionDose: number;
  totalDose: number;
  carbsGrams: number;
  currentGlucose: number;
}

export const MEAL_TYPE_LABELS: Record<string, string> = {
  "pequeno-almoco": "Pequeno-almoço",
  "almoco": "Almoço",
  "jantar": "Jantar",
  "snack": "Snack",
};

export const DAY_NAMES = [
  "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"
];
