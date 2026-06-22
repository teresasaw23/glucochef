import { MealPlan, ShoppingItem, ShoppingCategory, SHOPPING_CATEGORY_LABELS } from "./types";
import { getRecipeById } from "./recipes";

export function generateShoppingList(plan: MealPlan): ShoppingItem[] {
  const itemMap = new Map<string, ShoppingItem>();

  for (const day of plan.days) {
    const mealIds = [
      day.meals["pequeno-almoco"],
      day.meals["almoco"],
      day.meals["jantar"],
    ];

    for (const recipeId of mealIds) {
      if (!recipeId) continue;
      const recipe = getRecipeById(recipeId);
      if (!recipe) continue;

      for (const ingredient of recipe.ingredients) {
        if (ingredient.category === "outros") continue;

        const key = `${ingredient.name.toLowerCase()}-${ingredient.unit}`;
        const existing = itemMap.get(key);

        if (existing) {
          existing.quantity += ingredient.quantity;
        } else {
          itemMap.set(key, {
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            category: ingredient.category,
            checked: false,
          });
        }
      }
    }
  }

  const items = Array.from(itemMap.values());
  items.sort((a, b) => {
    const catOrder = Object.keys(SHOPPING_CATEGORY_LABELS);
    const catDiff = catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name, "pt");
  });

  return items;
}

export function groupByCategory(
  items: ShoppingItem[]
): Record<ShoppingCategory, ShoppingItem[]> {
  const groups = {} as Record<ShoppingCategory, ShoppingItem[]>;

  for (const item of items) {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
  }

  return groups;
}
