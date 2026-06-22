import { CommonFood } from "./types";

// Data sources:
// - INSA (Instituto Nacional de Saúde Dr. Ricardo Jorge) - Tabela da Composição de Alimentos
// - APDP (Associação Protectora dos Diabéticos de Portugal) - reference values
// - Open Food Facts for branded products
// All values per 100g

export const COMMON_FOODS: CommonFood[] = [
  // === HIDRATOS DE CARBONO ===
  { name: "Arroz branco cozido", carbsPer100g: 28, typicalPortionGrams: 180, category: "Hidratos" },
  { name: "Arroz integral cozido", carbsPer100g: 23, typicalPortionGrams: 180, category: "Hidratos" },
  { name: "Massa cozida", carbsPer100g: 25, typicalPortionGrams: 180, category: "Hidratos" },
  { name: "Massa integral cozida", carbsPer100g: 23, typicalPortionGrams: 180, category: "Hidratos" },
  { name: "Esparguete cozido", carbsPer100g: 25, typicalPortionGrams: 180, category: "Hidratos" },
  { name: "Batata cozida", carbsPer100g: 17, typicalPortionGrams: 200, category: "Hidratos" },
  { name: "Batata assada", carbsPer100g: 21, typicalPortionGrams: 200, category: "Hidratos" },
  { name: "Batata frita caseira", carbsPer100g: 36, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Batata-doce cozida", carbsPer100g: 20, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Puré de batata", carbsPer100g: 15, typicalPortionGrams: 200, category: "Hidratos" },
  { name: "Quinoa cozida", carbsPer100g: 21, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Couscous cozido", carbsPer100g: 23, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Grão-de-bico cozido", carbsPer100g: 27, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Feijão cozido", carbsPer100g: 22, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Lentilhas cozidas", carbsPer100g: 20, typicalPortionGrams: 150, category: "Hidratos" },
  { name: "Ervilhas cozidas", carbsPer100g: 14, typicalPortionGrams: 80, category: "Hidratos" },
  { name: "Milho cozido", carbsPer100g: 19, typicalPortionGrams: 100, category: "Hidratos" },

  // === PÃO E CEREAIS ===
  { name: "Pão de trigo (fatia)", carbsPer100g: 49, typicalPortionGrams: 30, category: "Pão" },
  { name: "Pão integral (fatia)", carbsPer100g: 41, typicalPortionGrams: 30, category: "Pão" },
  { name: "Pão Shape Continente", carbsPer100g: 38, typicalPortionGrams: 22, category: "Pão" },
  { name: "Pão de mistura (papo-seco)", carbsPer100g: 55, typicalPortionGrams: 50, category: "Pão" },
  { name: "Pão de forma", carbsPer100g: 47, typicalPortionGrams: 25, category: "Pão" },
  { name: "Tostas", carbsPer100g: 72, typicalPortionGrams: 15, category: "Pão" },
  { name: "Tortilha/wrap", carbsPer100g: 48, typicalPortionGrams: 65, category: "Pão" },
  { name: "Flocos de aveia", carbsPer100g: 58, typicalPortionGrams: 40, category: "Pão" },
  { name: "Cereais muesli", carbsPer100g: 60, typicalPortionGrams: 40, category: "Pão" },
  { name: "Broa de milho", carbsPer100g: 48, typicalPortionGrams: 60, category: "Pão" },

  // === PROTEÍNAS ===
  { name: "Frango grelhado (peito)", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Peru grelhado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Bife de vaca grelhado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Carne de porco grelhada", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Bifanas", carbsPer100g: 0, typicalPortionGrams: 120, category: "Proteína" },
  { name: "Hambúrguer (carne)", carbsPer100g: 3, typicalPortionGrams: 120, category: "Proteína" },
  { name: "Salmão grelhado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Bacalhau cozido", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Bacalhau assado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Sardinha grelhada", carbsPer100g: 0, typicalPortionGrams: 100, category: "Proteína" },
  { name: "Dourada grelhada", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Robalo grelhado", carbsPer100g: 0, typicalPortionGrams: 150, category: "Proteína" },
  { name: "Atum (lata em azeite)", carbsPer100g: 0, typicalPortionGrams: 80, category: "Proteína" },
  { name: "Atum (lata ao natural)", carbsPer100g: 0, typicalPortionGrams: 80, category: "Proteína" },
  { name: "Camarão cozido", carbsPer100g: 0, typicalPortionGrams: 100, category: "Proteína" },
  { name: "Polvo cozido", carbsPer100g: 0, typicalPortionGrams: 100, category: "Proteína" },
  { name: "Lulas grelhadas", carbsPer100g: 2, typicalPortionGrams: 100, category: "Proteína" },
  { name: "Ovo cozido", carbsPer100g: 1, typicalPortionGrams: 60, category: "Proteína" },
  { name: "Ovo estrelado", carbsPer100g: 1, typicalPortionGrams: 60, category: "Proteína" },
  { name: "Tofu", carbsPer100g: 2, typicalPortionGrams: 125, category: "Proteína" },

  // === LEGUMES ===
  { name: "Alface", carbsPer100g: 2, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Tomate", carbsPer100g: 4, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Pepino", carbsPer100g: 2, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Cenoura crua", carbsPer100g: 10, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Cenoura cozida", carbsPer100g: 8, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Brócolos cozidos", carbsPer100g: 4, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Couve-flor cozida", carbsPer100g: 3, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Espinafres cozidos", carbsPer100g: 1, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Curgete", carbsPer100g: 3, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Pimento", carbsPer100g: 5, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Cebola", carbsPer100g: 9, typicalPortionGrams: 50, category: "Legumes" },
  { name: "Cogumelos", carbsPer100g: 3, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Feijão verde cozido", carbsPer100g: 4, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Abóbora cozida", carbsPer100g: 6, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Beringela grelhada", carbsPer100g: 6, typicalPortionGrams: 100, category: "Legumes" },
  { name: "Couve portuguesa cozida", carbsPer100g: 3, typicalPortionGrams: 80, category: "Legumes" },
  { name: "Grelos cozidos", carbsPer100g: 3, typicalPortionGrams: 80, category: "Legumes" },

  // === FRUTAS ===
  { name: "Maçã", carbsPer100g: 14, typicalPortionGrams: 180, category: "Frutas" },
  { name: "Banana", carbsPer100g: 23, typicalPortionGrams: 120, category: "Frutas" },
  { name: "Laranja", carbsPer100g: 12, typicalPortionGrams: 150, category: "Frutas" },
  { name: "Pêra", carbsPer100g: 15, typicalPortionGrams: 170, category: "Frutas" },
  { name: "Morangos", carbsPer100g: 8, typicalPortionGrams: 100, category: "Frutas" },
  { name: "Uvas", carbsPer100g: 18, typicalPortionGrams: 100, category: "Frutas" },
  { name: "Manga", carbsPer100g: 15, typicalPortionGrams: 150, category: "Frutas" },
  { name: "Ananás", carbsPer100g: 13, typicalPortionGrams: 100, category: "Frutas" },
  { name: "Kiwi", carbsPer100g: 15, typicalPortionGrams: 80, category: "Frutas" },
  { name: "Melão", carbsPer100g: 8, typicalPortionGrams: 150, category: "Frutas" },
  { name: "Melancia", carbsPer100g: 8, typicalPortionGrams: 200, category: "Frutas" },
  { name: "Pêssego", carbsPer100g: 10, typicalPortionGrams: 150, category: "Frutas" },
  { name: "Ameixa", carbsPer100g: 11, typicalPortionGrams: 100, category: "Frutas" },
  { name: "Abacate", carbsPer100g: 2, typicalPortionGrams: 80, category: "Frutas" },
  { name: "Mirtilos", carbsPer100g: 14, typicalPortionGrams: 80, category: "Frutas" },
  { name: "Framboesas", carbsPer100g: 5, typicalPortionGrams: 80, category: "Frutas" },
  { name: "Figo", carbsPer100g: 16, typicalPortionGrams: 60, category: "Frutas" },

  // === LATICÍNIOS E PROTEICOS ===
  { name: "Leite meio-gordo", carbsPer100g: 5, typicalPortionGrams: 200, category: "Laticínios" },
  { name: "Leite magro", carbsPer100g: 5, typicalPortionGrams: 200, category: "Laticínios" },
  { name: "Iogurte natural", carbsPer100g: 4, typicalPortionGrams: 125, category: "Laticínios" },
  { name: "Iogurte grego natural", carbsPer100g: 4, typicalPortionGrams: 125, category: "Laticínios" },
  { name: "Skyr natural", carbsPer100g: 4, typicalPortionGrams: 150, category: "Laticínios" },
  { name: "Skyr Continente natural", carbsPer100g: 4.1, typicalPortionGrams: 150, category: "Laticínios" },
  { name: "Skyr Milbona (Aldi)", carbsPer100g: 4, typicalPortionGrams: 150, category: "Laticínios" },
  { name: "Queijo fresco", carbsPer100g: 3, typicalPortionGrams: 100, category: "Laticínios" },
  { name: "Queijo flamengo light", carbsPer100g: 0, typicalPortionGrams: 30, category: "Laticínios" },
  { name: "Requeijão", carbsPer100g: 4, typicalPortionGrams: 50, category: "Laticínios" },
  { name: "Pudim proteico (Continente)", carbsPer100g: 5, typicalPortionGrams: 200, category: "Laticínios" },
  { name: "Pudim proteico (Aldi)", carbsPer100g: 5, typicalPortionGrams: 200, category: "Laticínios" },
  { name: "Fiambre de peru", carbsPer100g: 1, typicalPortionGrams: 40, category: "Laticínios" },
  { name: "Fiambre de frango", carbsPer100g: 2, typicalPortionGrams: 40, category: "Laticínios" },

  // === SOPAS ===
  { name: "Sopa de legumes", carbsPer100g: 5, typicalPortionGrams: 300, category: "Sopas" },
  { name: "Caldo verde", carbsPer100g: 7, typicalPortionGrams: 300, category: "Sopas" },
  { name: "Sopa de feijão", carbsPer100g: 8, typicalPortionGrams: 300, category: "Sopas" },
  { name: "Canja de galinha", carbsPer100g: 4, typicalPortionGrams: 300, category: "Sopas" },

  // === MOLHOS E CONDIMENTOS ===
  { name: "Azeite", carbsPer100g: 0, typicalPortionGrams: 15, category: "Molhos" },
  { name: "Ketchup", carbsPer100g: 26, typicalPortionGrams: 15, category: "Molhos" },
  { name: "Mostarda", carbsPer100g: 5, typicalPortionGrams: 10, category: "Molhos" },
  { name: "Maionese", carbsPer100g: 1, typicalPortionGrams: 15, category: "Molhos" },
  { name: "Hummus", carbsPer100g: 16, typicalPortionGrams: 50, category: "Molhos" },
  { name: "Molho de tomate", carbsPer100g: 8, typicalPortionGrams: 50, category: "Molhos" },
  { name: "Vinagre balsâmico", carbsPer100g: 17, typicalPortionGrams: 15, category: "Molhos" },

  // === BEBIDAS ===
  { name: "Sumo de laranja natural", carbsPer100g: 10, typicalPortionGrams: 200, category: "Bebidas" },
  { name: "Coca-Cola", carbsPer100g: 11, typicalPortionGrams: 330, category: "Bebidas" },
  { name: "Coca-Cola Zero", carbsPer100g: 0, typicalPortionGrams: 330, category: "Bebidas" },
  { name: "Ice Tea (Lipton)", carbsPer100g: 5, typicalPortionGrams: 330, category: "Bebidas" },
  { name: "Cerveja", carbsPer100g: 3, typicalPortionGrams: 330, category: "Bebidas" },
  { name: "Vinho tinto", carbsPer100g: 2, typicalPortionGrams: 150, category: "Bebidas" },
  { name: "Vinho branco", carbsPer100g: 3, typicalPortionGrams: 150, category: "Bebidas" },
  { name: "Café (sem açúcar)", carbsPer100g: 0, typicalPortionGrams: 40, category: "Bebidas" },
  { name: "Meia de leite", carbsPer100g: 3, typicalPortionGrams: 200, category: "Bebidas" },

  // === SNACKS ===
  { name: "Nozes", carbsPer100g: 7, typicalPortionGrams: 30, category: "Snacks" },
  { name: "Amêndoas", carbsPer100g: 4, typicalPortionGrams: 30, category: "Snacks" },
  { name: "Cajus", carbsPer100g: 30, typicalPortionGrams: 30, category: "Snacks" },
  { name: "Manteiga de amendoim", carbsPer100g: 8, typicalPortionGrams: 20, category: "Snacks" },
  { name: "Chocolate negro 70%", carbsPer100g: 33, typicalPortionGrams: 25, category: "Snacks" },
  { name: "Bolachas Maria", carbsPer100g: 75, typicalPortionGrams: 30, category: "Snacks" },
  { name: "Bolachas água e sal", carbsPer100g: 70, typicalPortionGrams: 20, category: "Snacks" },
  { name: "Barra de cereais", carbsPer100g: 65, typicalPortionGrams: 25, category: "Snacks" },
  { name: "Pipocas (sem açúcar)", carbsPer100g: 55, typicalPortionGrams: 25, category: "Snacks" },

  // === FAST FOOD (referência) ===
  { name: "Big Mac (McDonald's)", carbsPer100g: 20, typicalPortionGrams: 200, category: "Fast Food" },
  { name: "McChicken", carbsPer100g: 22, typicalPortionGrams: 170, category: "Fast Food" },
  { name: "Batatas fritas McDonald's (M)", carbsPer100g: 42, typicalPortionGrams: 114, category: "Fast Food" },
  { name: "Whopper (Burger King)", carbsPer100g: 17, typicalPortionGrams: 270, category: "Fast Food" },
  { name: "Nuggets (6 un.)", carbsPer100g: 15, typicalPortionGrams: 100, category: "Fast Food" },
  { name: "Tiras frango KFC (3 un.)", carbsPer100g: 12, typicalPortionGrams: 135, category: "Fast Food" },

  // === PADARIA PORTUGUESA (referência) ===
  { name: "Pastel de nata", carbsPer100g: 33, typicalPortionGrams: 65, category: "Padaria" },
  { name: "Croissant", carbsPer100g: 45, typicalPortionGrams: 60, category: "Padaria" },
  { name: "Bola de Berlim", carbsPer100g: 40, typicalPortionGrams: 80, category: "Padaria" },
  { name: "Pão de Deus", carbsPer100g: 52, typicalPortionGrams: 70, category: "Padaria" },
  { name: "Torrada com manteiga", carbsPer100g: 45, typicalPortionGrams: 40, category: "Padaria" },

  // === GELADOS ===
  { name: "Gelado de baunilha", carbsPer100g: 24, typicalPortionGrams: 80, category: "Gelados" },
  { name: "Gelado Magnum clássico", carbsPer100g: 28, typicalPortionGrams: 86, category: "Gelados" },
  { name: "Cornetto", carbsPer100g: 34, typicalPortionGrams: 90, category: "Gelados" },
  { name: "Gelado de fruta (picolé)", carbsPer100g: 20, typicalPortionGrams: 75, category: "Gelados" },
];
