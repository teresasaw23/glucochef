import { NextResponse } from "next/server";

export async function GET() {
  const nightscoutUrl = process.env.NEXT_PUBLIC_NIGHTSCOUT_URL;

  if (!nightscoutUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_NIGHTSCOUT_URL not configured" },
      { status: 500 }
    );
  }

  const url = `https://${nightscoutUrl}/api/v1/entries.json?count=1`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch glucose data" },
      { status: res.status }
    );
  }

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ error: "No glucose data available" }, { status: 404 });
  }

  const entry = data[0];
  return NextResponse.json({
    sgv: entry.sgv,
    direction: entry.direction || "Flat",
    date: entry.date,
    dateString: entry.dateString,
  });
}
