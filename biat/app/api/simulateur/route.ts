import { NextRequest, NextResponse } from "next/server";
import { LOAN_PRODUCTS, simulateLoan, type LoanKind } from "@/lib/loans";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const kind = (sp.get("type") ?? "immobilier") as LoanKind;
  if (!(kind in LOAN_PRODUCTS)) {
    return NextResponse.json({ error: "Type de crédit inconnu" }, { status: 400 });
  }
  const amount = Number(sp.get("montant") ?? 100000);
  const years = Number(sp.get("duree") ?? 15);
  if (!Number.isFinite(amount) || !Number.isFinite(years)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }
  return NextResponse.json(simulateLoan(kind, amount, years));
}
