export type LoanKind = "immobilier" | "auto" | "consommation" | "amenagement";

export const LOAN_PRODUCTS: Record<
  LoanKind,
  {
    label: string;
    annualRate: number; // taux nominal annuel (démo)
    minAmount: number;
    maxAmount: number;
    minYears: number;
    maxYears: number;
    blurb: string;
  }
> = {
  immobilier: {
    label: "BIATIMMO — Crédit Immobilier",
    annualRate: 0.095,
    minAmount: 20000,
    maxAmount: 500000,
    minYears: 5,
    maxYears: 25,
    blurb: "Financez l'achat, la construction ou l'extension de votre logement.",
  },
  auto: {
    label: "CREDIAUTO — Crédit Auto",
    annualRate: 0.105,
    minAmount: 10000,
    maxAmount: 150000,
    minYears: 1,
    maxYears: 7,
    blurb: "Prenez la route au volant de votre nouvelle voiture.",
  },
  consommation: {
    label: "CREDIMEDIA — Crédit Consommation",
    annualRate: 0.118,
    minAmount: 1000,
    maxAmount: 30000,
    minYears: 1,
    maxYears: 5,
    blurb: "Concrétisez vos projets personnels sans attendre.",
  },
  amenagement: {
    label: "CREDIRENOV — Crédit Aménagement",
    annualRate: 0.109,
    minAmount: 5000,
    maxAmount: 80000,
    minYears: 1,
    maxYears: 7,
    blurb: "Rénovez et embellissez votre intérieur.",
  },
};

export function simulateLoan(kind: LoanKind, amount: number, years: number) {
  const p = LOAN_PRODUCTS[kind];
  const clampedAmount = Math.min(Math.max(amount, p.minAmount), p.maxAmount);
  const clampedYears = Math.min(Math.max(years, p.minYears), p.maxYears);
  const n = clampedYears * 12;
  const r = p.annualRate / 12;
  const monthly = (clampedAmount * r) / (1 - Math.pow(1 + r, -n));
  const totalPaid = monthly * n;
  return {
    kind,
    label: p.label,
    amount: clampedAmount,
    years: clampedYears,
    months: n,
    annualRatePct: +(p.annualRate * 100).toFixed(2),
    monthly: +monthly.toFixed(3),
    totalCost: +(totalPaid - clampedAmount).toFixed(3),
    totalPaid: +totalPaid.toFixed(3),
  };
}
