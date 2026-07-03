"use client";

import { useEffect, useMemo, useState } from "react";
import Reveal from "@/components/Reveal";

type Rate = { code: string; name: string; flag: string; buy: number; sell: number };

const fmtTnd = (n: number) =>
  n.toLocaleString("fr-TN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

/** Live-style exchange rates board + converter (Wise pattern), fed by
 *  /api/exchange-rates. */
export default function RatesSection() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1000);

  useEffect(() => {
    fetch("/api/exchange-rates")
      .then((r) => r.json())
      .then((d) => {
        setRates(d.rates);
        setUpdatedAt(d.updatedAt);
      })
      .catch(() => {});
  }, []);

  const selected = useMemo(() => rates.find((r) => r.code === currency), [rates, currency]);
  const converted = selected ? amount * selected.buy : 0;

  return (
    <section id="change" className="bg-navy-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent-500">
                Salle des marchés
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Cours de change du jour
              </h2>
            </div>
            {updatedAt && (
              <p className="text-sm text-white/50">
                Mis à jour le{" "}
                {new Date(updatedAt).toLocaleDateString("fr-TN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · données indicatives
              </p>
            )}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* rates table */}
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
              <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/50">
                <span>Devise</span>
                <span className="text-right">Achat (TND)</span>
                <span className="text-right">Vente (TND)</span>
              </div>
              <div className="max-h-[380px] overflow-y-auto">
                {rates.length === 0 && (
                  <p className="px-6 py-10 text-center text-white/40">Chargement des cours…</p>
                )}
                {rates.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => setCurrency(r.code)}
                    className={`grid w-full grid-cols-[1.6fr_1fr_1fr] items-center gap-4 px-6 py-3.5 text-left transition hover:bg-white/8 ${
                      currency === r.code ? "bg-white/10" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{r.flag}</span>
                      <span>
                        <span className="block text-sm font-bold">{r.code}</span>
                        <span className="block text-xs text-white/50">{r.name}</span>
                      </span>
                    </span>
                    <span className="tnum text-right font-semibold text-emerald-300">
                      {fmtTnd(r.buy)}
                    </span>
                    <span className="tnum text-right font-semibold text-white/85">
                      {fmtTnd(r.sell)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* converter */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-3xl bg-white p-7 text-slate-900 shadow-2xl">
              <h3 className="text-lg font-extrabold">Convertisseur</h3>
              <p className="mt-1 text-sm text-slate-500">Combien recevrez-vous en dinars ?</p>

              <label className="mt-6 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Vous convertissez
              </label>
              <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
                <input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, +e.target.value))}
                  className="tnum w-full px-4 py-3.5 text-lg font-bold outline-none"
                  aria-label="Montant à convertir"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="border-l border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none"
                  aria-label="Devise"
                >
                  {rates.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.flag} {r.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 rounded-2xl bg-brand-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-700/70">
                  Vous recevez environ
                </p>
                <p className="tnum mt-1 text-3xl font-extrabold text-brand-800">
                  {fmtTnd(converted)} <span className="text-base">TND</span>
                </p>
                {selected && (
                  <p className="tnum mt-2 text-xs text-slate-500">
                    1 {selected.code} = {fmtTnd(selected.buy)} TND (cours d&apos;achat)
                  </p>
                )}
              </div>

              <p className="mt-auto pt-5 text-xs leading-relaxed text-slate-400">
                Opérations de change disponibles dans les {""}
                <a href="/agences" className="font-semibold text-brand-700 hover:underline">
                  agences BIAT
                </a>{" "}
                équipées d&apos;un guichet change, sur présentation d&apos;une pièce d&apos;identité.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
