import { CommonFood } from "./types";

export const COMMON_FOODS: CommonFood[] = [
  // Hidratos de carbono
  { name: "Arroz cozido", carbsPer100g: 28, typicalPortionGrams: 180, category: "Hidratos" },
  { name: "Massa cozida", carbsPer100g: 25, typicalPortionGrams: 180, category: "Hidratos" },
  { name: "Batata cozida", carbsPer100g: 17, typicalPortionGrams: 200, category: "Hidratos" },
  { name: "Batata-doce cozida", carbsPer100g: 20, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Pão (fatia)", carbsPer100g: 49, typicalPortionGrams: 30, category: "Hidratos" },
  { name: "Pão Shape Continente", carbsPer100g: 38, typicalPortionGrams: 28, category: "Hidratos" },
  { name: "Quinoa cozida", carbsPer100g: 21, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Grão-de-bico cozido", carbsPer100g: 27, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Feijão cozido", carbsPer100g: 22, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Lentilhas cozidas", carbsPer100g: 20, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Tortilha/wrap", carbsPer100g: 48, typicalPortionGrams: 65, category: "Hidratos" },
  { name: "Couscous cozido", carbsPer100g: 23, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Batata frita", carbsPer100g: 36, typicalPortionGrams: 150, category: "Hidratos" },

  // Proteínas
  { name: "Frango grelhado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Peru grelhado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Bife de vaca", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Porco grelhado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Salmão grelhado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Bacalhau cozido", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Atum (lata)", carbsPer100g: 0, typicalPortionGrams: 80, category: "Proteína" },
  { name: "Ovo", carbsPer100g: 1, typicalPortionGrams: 60, category: "Proteína" },
  { name: "Tofu", carbsPer100g: 2, typicalPortionGrams: 125, category: "Proteína" },

  // Legumes
  { name: "Alface/salada", carbsPer100g: 2, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Tomate", carbsPer100g: 4, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Brócolos cozidos", carbsPer100g: 4, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Cenoura cozida", carbsPer100g: 8, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Curgete", carbsPer100g: 3, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Pimento", carbsPer100g: 5, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Espinafres", carbsPer100g: 1, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Cogumelos", carbsPer100g: 3, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Feijão verde", carbsPer100g: 4, typicalPortionGrams: 100, category: "Legumes" },

  // Frutas
  { name: "Maçã", carbsPer100g: 14, typicalPortionGrams: 180, category: "Frutas" },
  { name: "Banana", carbsPer100g: 23, typicalPortionGrams: 120, category: "Frutas" },
  { name: "Laranja", carbsPer100g: 12, typicalPortionGrams: 150, category: "Frutas" },
  { name: "Morangos", carbsPer100g: 8, typicalPortionGrams: 100, category: "Frutas" },
  { name: "Uvas", carbsPer100g: 18, typicalPortionGrams: 100, category: "Frutas" },
  { name: "Manga", carbsPer100g: 15, typicalPortionGrams: 150, category: "Frutas" },
  { name: "Abacate", carbsPer100g: 2, typicalPortionGrams: 80, category: "Frutas" },

  // Laticínios
  { name: "Iogurte natural", carbsPer100g: 4, typicalPortionGrams: 125, category: "Laticínios" },
  { name: "Skyr natural", carbsPer100g: 4, typicalPortionGrams: 150, category: "Laticínios" },
  { name: "Leite meio-gordo", carbsPer100g: 5, typicalPortionGrams: 200, category: "Laticínios" },
  { name: "Queijo fresco", carbsPer100g: 3, typicalPortionGrams: 100, category: "Laticínios" },
  { name: "Queijo flamengo", carbsPer100g: 0, typicalPortionGrams: 30, category: "Laticínios" },
  { name: "Pudim proteico", carbsPer100g: 5, typicalPortionGrams: 200, category: "Laticínios" },

  // Molhos e extras
  { name: "Ketchup", carbsPer100g: 26, typicalPortionGrams: 15, category: "Molhos" },
  { name: "Mostarda", carbsPer100g: 5, typicalPortionGrams: 10, category: "Molhos" },
  { name: "Azeite", carbsPer100g: 0, typicalPortionGrams: 15, category: "Molhos" },
  { name: "Hummus", carbsPer100g: 16, typicalPortionGrams: 50, category: "Molhos" },

  // Sopas
  { name: "Sopa de legumes", carbsPer100g: 5, typicalPortionGrams: 300, category: "Sopas" },
  { name: "Caldo verde", carbsPer100g: 7, typicalPortionGrams: 300, category: "Sopas" },

  // Bebidas
  { name: "Sumo de laranja", carbsPer100g: 10, typicalPortionGrams: 200, category: "Bebidas" },
  { name: "Coca-Cola", carbsPer100g: 11, typicalPortionGrams: 330, category: "Bebidas" },
  { name: "Coca-Cola Zero", carbsPer100g: 0, typicalPortionGrams: 330, category: "Bebidas" },
  { name: "Cerveja", carbsPer100g: 3, typicalPortionGrams: 330, category: "Bebidas" },
  { name: "Vinho tinto", carbsPer100g: 2, typicalPortionGrams: 150, category: "Bebidas" },

  // Snacks
  { name: "Nozes", carbsPer100g: 7, typicalPortionGrams: 30, category: "Snacks" },
  { name: "Amêndoas", carbsPer100g: 4, typicalPortionGrams: 30, category: "Snacks" },
  { name: "Manteiga de amendoim", carbsPer100g: 8, typicalPortionGrams: 20, category: "Snacks" },
  { name: "Chocolate negro 70%", carbsPer100g: 33, typicalPortionGrams: 25, category: "Snacks" },
  { name: "Bolachas Maria", carbsPer100g: 75, typicalPortionGrams: 30, category: "Snacks" },
];
