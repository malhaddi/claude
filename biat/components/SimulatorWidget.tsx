"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LOAN_PRODUCTS, type LoanKind } from "@/lib/loans";

type Result = {
  label: string;
  monthly: number;
  totalCost: number;
  totalPaid: number;
  annualRatePct: number;
};

const fmt = (n: number) =>
  n.toLocaleString("fr-TN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/** Interactive crédit simulator — debounced calls to /api/simulateur. */
export default function SimulatorWidget({ compact = false }: { compact?: boolean }) {
  const [kind, setKind] = useState<LoanKind>("immobilier");
  const p = LOAN_PRODUCTS[kind];
  const [amount, setAmount] = useState(180000);
  const [years, setYears] = useState(15);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clamp = useCallback(
    (k: LoanKind, a: number, y: number) => {
      const pp = LOAN_PRODUCTS[k];
      return {
        a: Math.min(Math.max(a, pp.minAmount), pp.maxAmount),
        y: Math.min(Math.max(y, pp.minYears), pp.maxYears),
      };
    },
    []
  );

  const switchKind = (k: LoanKind) => {
    const pp = LOAN_PRODUCTS[k];
    const mid = Math.round((pp.minAmount + pp.maxAmount) / 2 / 1000) * 1000;
    const midY = Math.round((pp.minYears + pp.maxYears) / 2);
    setKind(k);
    setAmount(mid);
    setYears(midY);
  };

  useEffect(() => {
    const { a, y } = clamp(kind, amount, years);
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/simulateur?type=${kind}&montant=${a}&duree=${y}`);
        if (res.ok) setResult(await res.json());
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [kind, amount, years, clamp]);

  const amountPct = ((amount - p.minAmount) / (p.maxAmount - p.minAmount)) * 100;
  const yearsPct = ((years - p.minYears) / (p.maxYears - p.minYears)) * 100;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-navy-900/8">
      {/* product tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50/70 p-2">
        {(Object.entries(LOAN_PRODUCTS) as [LoanKind, (typeof LOAN_PRODUCTS)[LoanKind]][]).map(
          ([k, pp]) => (
            <button
              key={k}
              onClick={() => switchKind(k)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                kind === k
                  ? "bg-brand-700 text-white shadow-md shadow-brand-700/25"
                  : "text-slate-600 hover:bg-white hover:text-brand-700"
              }`}
            >
              {pp.label.split("—")[0].trim()}
            </button>
          )
        )}
      </div>

      <div className={`grid gap-8 p-6 sm:p-8 ${compact ? "" : "lg:grid-cols-[1.2fr_1fr]"}`}>
        {/* sliders */}
        <div className="space-y-7">
          <p className="text-sm text-slate-500">{p.blurb}</p>
          <div>
            <div className="mb-2.5 flex items-baseline justify-between">
              <label className="text-sm font-bold text-slate-700">Montant du crédit</label>
              <span className="tnum text-lg font-extrabold text-brand-800">{fmt(amount)} DT</span>
            </div>
            <input
              type="range"
              min={p.minAmount}
              max={p.maxAmount}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              style={{ "--fill": `${amountPct}%` } as React.CSSProperties}
              aria-label="Montant du crédit"
            />
            <div className="mt-1.5 flex justify-between text-xs text-slate-400">
              <span className="tnum">{fmt(p.minAmount)} DT</span>
              <span className="tnum">{fmt(p.maxAmount)} DT</span>
            </div>
          </div>

          <div>
            <div className="mb-2.5 flex items-baseline justify-between">
              <label className="text-sm font-bold text-slate-700">Durée de remboursement</label>
              <span className="tnum text-lg font-extrabold text-brand-800">{years} ans</span>
            </div>
            <input
              type="range"
              min={p.minYears}
              max={p.maxYears}
              step={1}
              value={years}
              onChange={(e) => setYears(+e.target.value)}
              style={{ "--fill": `${yearsPct}%` } as React.CSSProperties}
              aria-label="Durée de remboursement"
            />
            <div className="mt-1.5 flex justify-between text-xs text-slate-400">
              <span>{p.minYears} ans</span>
              <span>{p.maxYears} ans</span>
            </div>
          </div>
        </div>

        {/* result card */}
        <div className="mesh-hero flex flex-col justify-between rounded-2xl p-6 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
              Votre mensualité estimée
            </p>
            <p className={`tnum mt-2 text-4xl font-extrabold transition ${loading ? "opacity-40" : ""}`}>
              {result ? fmt(result.monthly) : "—"}
              <span className="text-lg font-bold text-blue-200"> DT/mois</span>
            </p>
            <dl className="mt-5 space-y-2.5 border-t border-white/15 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-blue-200/85">Taux annuel indicatif</dt>
                <dd className="tnum font-bold">{result ? `${result.annualRatePct} %` : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-blue-200/85">Coût total du crédit</dt>
                <dd className="tnum font-bold">{result ? `${fmt(result.totalCost)} DT` : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-blue-200/85">Total remboursé</dt>
                <dd className="tnum font-bold">{result ? `${fmt(result.totalPaid)} DT` : "—"}</dd>
              </div>
            </dl>
          </div>
          <div className="mt-6 grid gap-2.5">
            <Link
              href="/ouvrir-un-compte"
              className="rounded-full bg-accent-500 py-3 text-center text-sm font-bold text-white transition hover:bg-accent-600"
            >
              Demander ce crédit en ligne
            </Link>
            <Link
              href="/agences#rdv"
              className="rounded-full border border-white/25 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </div>

      <p className="border-t border-slate-100 bg-slate-50/70 px-6 py-3 text-center text-[11px] text-slate-400">
        Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant
        de vous engager. Simulation indicative, hors assurances et frais de dossier.
      </p>
    </div>
  );
}
