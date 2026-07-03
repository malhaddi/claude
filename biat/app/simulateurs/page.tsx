import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SimulatorWidget from "@/components/SimulatorWidget";

export const metadata: Metadata = {
  title: "Simulateurs de crédit",
  description:
    "Simulez votre crédit BIATIMMO, CREDIAUTO, CREDIMEDIA ou CREDIRENOV en 30 secondes : mensualité, taux et coût total en direct.",
};

const STEPS = [
  {
    n: "1",
    title: "Simulez",
    desc: "Ajustez le montant et la durée — la mensualité se calcule instantanément.",
  },
  {
    n: "2",
    title: "Déposez votre demande",
    desc: "En ligne via Crédit By BIAT : réponse de principe immédiate.",
  },
  {
    n: "3",
    title: "Signez",
    desc: "Votre conseiller finalise le dossier en agence. Les fonds sont débloqués.",
  },
];

export default function SimulateursPage() {
  return (
    <>
      <section className="mesh-hero relative overflow-hidden py-20 text-white">
        <div className="grid-overlay absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              Simulateurs
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              Votre projet mérite des chiffres clairs.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100/85">
              Immobilier, auto, consommation ou travaux : simulez librement, sans engagement et
              sans laisser votre numéro de téléphone.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SimulatorWidget />
          </Reveal>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="relative h-full rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-700 text-lg font-extrabold text-white">
                    {s.n}
                  </span>
                  <h2 className="mt-4 text-lg font-extrabold text-slate-900">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
