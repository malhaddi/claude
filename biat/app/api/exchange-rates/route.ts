import { NextResponse } from "next/server";
import { todaysRates } from "@/lib/rates";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  return NextResponse.json({
    updatedAt: now.toISOString(),
    base: "TND",
    source: "Salle des marchés BIAT (données indicatives)",
    rates: todaysRates(now),
  });
}
