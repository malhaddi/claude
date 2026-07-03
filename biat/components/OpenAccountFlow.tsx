"use client";

import { useState } from "react";
import BankCard, { type CardVariant } from "@/components/BankCard";

const OFFERS: {
  id: string;
  name: string;
  desc: string;
  price: string;
  variant: CardVariant;
  popular?: boolean;
}[] = [
  {
    id: "chabeb",
    name: "CHABEB",
    desc: "13–25 ans · carte gratuite, zéro frais",
    price: "0 DT",
    variant: "jeune",
  },
  {
    id: "courant",
    name: "Compte Courant",
    desc: "Le quotidien, carte Classique incluse",
    price: "dès 30 DT/an",
    variant: "classic",
    popular: true,
  },
  {
    id: "first",
    name: "Pack FIRST",
    desc: "Jeunes actifs · tarifs préférentiels",
    price: "sur mesure",
    variant: "platinum",
  },
];

const STEPS = ["Votre offre", "Vos informations", "Confirmation"];

type Form = {
  offer: string;
  firstName: string;
  lastName: string;
  cin: string;
  birthDate: string;
  email: string;
  phone: string;
  city: string;
};

const EMPTY: Form = {
  offer: "",
  firstName: "",
  lastName: "",
  cin: "",
  birthDate: "",
  email: "",
  phone: "",
  city: "",
};

export default function OpenAccountFlow() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ reference: string; nextSteps: string[] } | null>(null);

  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/open-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setResult(data);
        setStep(2);
      }
    } catch {
      setError("Erreur réseau — veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";

  return (
    <section className="mesh-hero relative min-h-[85vh] overflow-hidden py-16 text-white">
      <div className="grid-overlay absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
            100 % en ligne · 10 minutes
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Bienvenue à la BIAT.
          </h1>
        </div>

        {/* stepper */}
        <ol className="mx-auto mt-9 flex max-w-md items-center">
          {STEPS.map((s, i) => (
            <li key={s} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
              <span className="flex flex-col items-center gap-1.5">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold transition ${
                    i < step
                      ? "bg-emerald-400 text-navy-900"
                      : i === step
                        ? "bg-accent-500 text-white shadow-lg shadow-accent-500/40"
                        : "bg-white/10 text-white/50"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${i <= step ? "text-white" : "text-white/40"}`}>
                  {s}
                </span>
              </span>
              {i < STEPS.length - 1 && (
                <span className={`mx-2 mb-5 h-0.5 flex-1 rounded ${i < step ? "bg-emerald-400" : "bg-white/15"}`} />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-3xl bg-white p-7 text-slate-900 shadow-2xl sm:p-9">
          {/* ===== STEP 0 — offer ===== */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-extrabold">Quelle offre vous ressemble ?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {OFFERS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => set({ offer: o.id })}
                    className={`relative rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 ${
                      form.offer === o.id
                        ? "border-accent-500 bg-accent-500/5 shadow-lg"
                        : "border-slate-150 border-slate-200 hover:border-brand-300"
                    }`}
                  >
                    {o.popular && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-brand-700 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        Populaire
                      </span>
                    )}
                    <BankCard variant={o.variant} tilt={false} className="pointer-events-none" />
                    <p className="mt-3 text-sm font-extrabold">{o.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{o.desc}</p>
                    <p className="mt-1.5 text-sm font-extrabold text-brand-700">{o.price}</p>
                  </button>
                ))}
              </div>
              <button
                disabled={!form.offer}
                onClick={() => setStep(1)}
                className="mt-7 w-full rounded-full bg-accent-500 py-3.5 font-bold text-white shadow-lg shadow-accent-500/25 transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuer →
              </button>
            </div>
          )}

          {/* ===== STEP 1 — identity ===== */}
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <h2 className="text-xl font-extrabold">Faisons connaissance</h2>
              <p className="mt-1 text-sm text-slate-500">
                Exactement comme sur votre carte d&apos;identité nationale.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Prénom *</label>
                  <input required value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} className={inputCls} placeholder="Ahmed" />
                </div>
                <div>
                  <label className={labelCls}>Nom *</label>
                  <input required value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} className={inputCls} placeholder="Ben Salah" />
                </div>
                <div>
                  <label className={labelCls}>N° CIN (8 chiffres) *</label>
                  <input
                    required
                    inputMode="numeric"
                    pattern="\d{8}"
                    maxLength={8}
                    value={form.cin}
                    onChange={(e) => set({ cin: e.target.value.replace(/\D/g, "") })}
                    className={`tnum ${inputCls}`}
                    placeholder="12345678"
                  />
                </div>
                <div>
                  <label className={labelCls}>Date de naissance</label>
                  <input type="date" value={form.birthDate} onChange={(e) => set({ birthDate: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>E-mail *</label>
                  <input required type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={inputCls} placeholder="vous@exemple.tn" />
                </div>
                <div>
                  <label className={labelCls}>Mobile *</label>
                  <input required value={form.phone} onChange={(e) => set({ phone: e.target.value })} className={`tnum ${inputCls}`} placeholder="+216 20 000 000" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Ville</label>
                  <input value={form.city} onChange={(e) => set({ city: e.target.value })} className={inputCls} placeholder="Tunis, Sfax, Sousse…" />
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-600">
                  ⚠ {error}
                </p>
              )}

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="rounded-full border border-slate-200 px-6 py-3.5 font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 rounded-full bg-accent-500 py-3.5 font-bold text-white shadow-lg shadow-accent-500/25 transition hover:bg-accent-600 disabled:opacity-60"
                >
                  {sending ? "Vérification…" : "Créer mon compte →"}
                </button>
              </div>
              <p className="mt-4 text-center text-[11px] text-slate-400">
                🔐 Données chiffrées de bout en bout. Démonstration — aucune donnée n&apos;est
                conservée.
              </p>
            </form>
          )}

          {/* ===== STEP 2 — confirmation ===== */}
          {step === 2 && result && (
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">
                🎉
              </div>
              <h2 className="mt-5 text-2xl font-extrabold">
                Marhba, {form.firstName} !
              </h2>
              <p className="mt-2 text-slate-600">
                Votre demande d&apos;ouverture est enregistrée sous la référence{" "}
                <strong className="tnum text-brand-700">{result.reference}</strong>.
              </p>
              <ol className="mx-auto mt-7 max-w-md space-y-3 text-left">
                {result.nextSteps.map((s, i) => (
                  <li key={s} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-700 text-xs font-extrabold text-white">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <button
                onClick={() => {
                  setForm(EMPTY);
                  setResult(null);
                  setStep(0);
                }}
                className="mt-8 rounded-full bg-brand-700 px-7 py-3 font-bold text-white transition hover:bg-brand-800"
              >
                Terminer
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-blue-100/60">
          Besoin d&apos;aide ? Appelez le <span className="tnum font-bold text-white/90">(+216) 71 131 000</span> ou
          passez dans l&apos;une de nos 205+ agences.
        </p>
      </div>
    </section>
  );
}
