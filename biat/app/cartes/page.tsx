import type { Metadata } from "next";
import Link from "next/link";
import BankCard from "@/components/BankCard";
import Reveal from "@/components/Reveal";
import { CARD_TIERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cartes bancaires",
  description:
    "De la carte CHABEB gratuite à la VISA Infinite : comparez les cartes BIAT et choisissez celle qui vous ressemble.",
};

const COMPARE: { feature: string; values: (string | boolean)[] }[] = [
  { feature: "Cotisation annuelle", values: ["Gratuite", "30 DT", "180 DT", "Sur invitation"] },
  { feature: "Plafond hebdomadaire", values: ["500 DT", "2 000 DT", "8 000 DT", "Sur mesure"] },
  { feature: "Paiement sans contact", values: [true, true, true, true] },
  { feature: "Paiements en ligne 3-D Secure", values: [true, true, true, true] },
  { feature: "Utilisation à l'international", values: [false, "En option", true, true] },
  { feature: "Assurance voyage & achats", values: [false, false, true, true] },
  { feature: "Accès salons d'aéroport", values: [false, false, true, "Illimité"] },
  { feature: "Conciergerie 24/7", values: [false, false, false, true] },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true)
    return <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">✓</span>;
  if (v === false) return <span className="text-slate-300">—</span>;
  return <span className="text-sm font-semibold text-slate-700">{v}</span>;
}

export default function CartesPage() {
  return (
    <>
      {/* hero */}
      <section className="mesh-hero relative overflow-hidden py-20 text-white">
        <div className="grid-overlay absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              Cartes bancaires
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              Une carte pour chaque vie.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100/85">
              Du premier compte d&apos;un lycéen à la banque privée : quatre niveaux, zéro
              compromis sur la sécurité.
            </p>
          </Reveal>
        </div>
      </section>

      {/* tiers */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {CARD_TIERS.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl ${
                    t.highlight ? "border-accent-500 ring-4 ring-accent-500/15" : "border-slate-100"
                  }`}
                >
                  {t.highlight && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-4 py-1 text-xs font-bold text-white shadow-md">
                      La plus choisie
                    </span>
                  )}
                  <BankCard variant={t.variant} tilt className="!max-w-none" />
                  <h2 className="mt-5 text-lg font-extrabold text-slate-900">{t.name}</h2>
                  <p className="text-sm text-slate-500">{t.audience}</p>
                  <p className="mt-3 text-2xl font-extrabold text-brand-800">
                    {t.price}
                  </p>
                  <p className="tnum mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Plafond : {t.plafond}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-slate-600">
                        <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/ouvrir-un-compte"
                    className={`mt-6 rounded-full py-3 text-center text-sm font-bold transition ${
                      t.highlight
                        ? "bg-accent-500 text-white shadow-lg shadow-accent-500/30 hover:bg-accent-600"
                        : "bg-brand-700 text-white hover:bg-brand-800"
                    }`}
                  >
                    Commander cette carte
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* comparison table */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Comparez en un coup d&apos;œil
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-100 shadow-sm">
              <table className="w-full min-w-[720px] border-collapse bg-white text-center">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="p-5 text-left text-sm font-bold text-slate-500">
                      Caractéristiques
                    </th>
                    {CARD_TIERS.map((t) => (
                      <th key={t.id} className="p-5 text-sm font-extrabold text-slate-900">
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row, i) => (
                    <tr key={row.feature} className={i % 2 ? "bg-slate-50/50" : ""}>
                      <td className="p-4.5 text-left text-sm font-semibold text-slate-600">
                        {row.feature}
                      </td>
                      {row.values.map((v, j) => (
                        <td key={j} className="p-4.5">
                          <Cell v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-6 text-center text-xs text-slate-400">
            Carte CASH prépayée rechargeable et Cartes Affaires entreprises également disponibles en
            agence. Tarifs indicatifs — voir conditions de banque.
          </p>
        </div>
      </section>
    </>
  );
}
