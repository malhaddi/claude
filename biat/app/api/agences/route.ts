import { NextRequest, NextResponse } from "next/server";
import { BRANCHES } from "@/lib/branches";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  const region = req.nextUrl.searchParams.get("region") ?? "";
  let results = BRANCHES;
  if (region) results = results.filter((b) => b.region === region);
  if (q) {
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q)
    );
  }
  return NextResponse.json({ total: results.length, agences: results });
}
