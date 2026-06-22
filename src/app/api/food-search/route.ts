import { NextRequest, NextResponse } from "next/server";

const OFF_API = "https://world.openfoodfacts.org/cgi/search.pl";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const url = new URL(OFF_API);
    url.searchParams.set("search_terms", q);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page_size", "15");
    url.searchParams.set("fields", "product_name,brands,nutriments,serving_size,serving_quantity,image_small_url");
    url.searchParams.set("sort_by", "unique_scans_n");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "GlucoChef/1.0 (glucochef.vercel.app)" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ products: [] });
    }

    const data = await res.json();
    const products = (data.products || [])
      .filter((p: Record<string, unknown>) => {
        const n = p.nutriments as Record<string, unknown> | undefined;
        return p.product_name && n && n.carbohydrates_100g !== undefined;
      })
      .map((p: Record<string, unknown>) => {
        const n = p.nutriments as Record<string, number>;
        const servingStr = (p.serving_size as string) || "";
        let servingGrams = 100;
        const match = servingStr.match(/(\d+(?:[.,]\d+)?)\s*g/i);
        if (match) {
          servingGrams = parseFloat(match[1].replace(",", "."));
        }
        return {
          name: p.product_name as string,
          brand: (p.brands as string) || "",
          carbsPer100g: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
          proteinPer100g: Math.round((n.proteins_100g || 0) * 10) / 10,
          fatPer100g: Math.round((n.fat_100g || 0) * 10) / 10,
          kcalPer100g: Math.round(n["energy-kcal_100g"] || 0),
          servingGrams,
          servingSize: servingStr,
        };
      });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
