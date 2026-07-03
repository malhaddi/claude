import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";

export const metadata: Metadata = {
  title: "Entreprises",
  description:
    "Cash management, MyBIAT Corporate, financements, commerce international et marché des capitaux : la BIAT, partenaire de croissance des entreprises tunisiennes.",
};

const PILLARS = [
  {
    id: "cash",
    icon: "📊",
    title: "Cash Management",
    desc: "Centralisez encaissements et décaissements, suivez votre trésorerie en temps réel et automatisez vos paiements de masse (salaires, fournisseurs).",
    points: ["Virements de masse & prélèvements", "Reporting multi-comptes consolidé", "TPE et e-commerce : encaissez partout"],
  },
  {
    id: "corporate",
    icon: "🖥️",
    title: "MyBIAT Corporate",
    desc: "Le portail digital des entreprises : habilitations par profil, double validation des virements et app mobile de validation pour vos signataires.",
    points: ["Gestion fine des habilitations", "Double validation (maker / checker)", "Validation mobile où que vous soyez"],
  },
  {
    id: "cartes",
    icon: "💼",
    title: "Cartes Affaires",
    desc: "Donnez de l'autonomie à vos équipes en déplacement tout en gardant la maîtrise des plafonds et des dépenses, carte par carte.",
    points: ["Plafonds personnalisés par porteur", "Relevés dédiés pour la comptabilité", "Assurances missions incluses"],
  },
  {
    id: "financement",
    icon: "🏗️",
    title: "Financements & Investissement",
    desc: "Du besoin en fonds de roulement au plan d'investissement : CREDIMMO Pro, crédits moyen terme et solutions sur mesure sectorielles.",
    points: ["CREDIMMO Pro : vos locaux professionnels", "Crédits de campagne & saisonniers", "Accompagnement sectoriel dédié"],
  },
  {
    id: "international",
    icon: "🚢",
    title: "Commerce international",
    desc: "Première banque des flux import-export du pays : crédits documentaires, remises, garanties internationales et salle des marchés change.",
    points: ["Crédits documentaires & remdoc", "Couverture du risque de change", "Correspondants dans 100+ pays"],
  },
  {
    id: "capitaux",
    icon: "📈",
    title: "Marché des capitaux",
    desc: "Avec Tunisie Valeurs et BIAT Capital Risque, accédez à la bourse, aux émissions obligataires et au capital-investissement.",
    points: ["Intermédiation en bourse", "Gestion d'actifs & OPCVM", "Capital-risque pour la croissance"],
  },
];

export default function EntreprisesPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-navy-900 py-20 text-white">
        <div className="grid-overlay absolute inset-0" aria-hidden />
        <div
          className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-600/25 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              Entreprises & Institutionnels
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              Le partenaire bancaire de ceux qui construisent l&apos;économie.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-100/85">
              De la TPE au grand groupe exportateur : une banque d&apos;affaires complète, un
              chargé d&apos;affaires dédié et des outils digitaux de niveau international.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/agences#rdv"
                className="rounded-full bg-accent-500 px-6 py-3 font-bold text-white shadow-lg shadow-accent-500/30 transition hover:bg-accent-600"
              >
                Rencontrer un chargé d&apos;affaires
              </Link>
              <a
                href="#corporate"
                className="rounded-full border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Découvrir MyBIAT Corporate
              </a>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
              {[
                { v: 1, suffix: "ʳᵉ", label: "banque des entreprises tunisiennes" },
                { v: 20.8, suffix: " Mds DT", label: "de dépôts qui financent l'économie", decimals: 1 },
                { v: 100, suffix: "+", label: "pays couverts via nos correspondants" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-white sm:text-4xl">
                    <Counter to={s.v} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </p>
                  <p className="mt-1.5 text-xs text-blue-100/70 sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* pillars */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <div
                  id={p.id}
                  className="flex h-full scroll-mt-28 flex-col rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl">
                    {p.icon}
                  </span>
                  <h2 className="mt-4 text-lg font-extrabold text-slate-900">{p.title}</h2>
                  <p className="mt-2 flex-none text-sm leading-relaxed text-slate-500">{p.desc}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-sm text-slate-600">
                        <span className="mt-0.5 text-accent-500">◆</span> {pt}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/agences#rdv"
                    className="mt-5 text-sm font-bold text-brand-700 hover:underline"
                  >
                    Parler à un expert →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* commitment band */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-[2.5rem] border border-slate-100 bg-gradient-to-r from-brand-50 to-white p-10 shadow-sm md:flex-row">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Un chargé d&apos;affaires dédié, pas un centre d&apos;appels.
                </h2>
                <p className="mt-3 text-slate-600">
                  Chaque entreprise cliente est suivie par un interlocuteur unique qui connaît son
                  secteur, ses saisons et ses ambitions. C&apos;est notre définition de
                  l&apos;engagement.
                </p>
              </div>
              <Link
                href="/agences#rdv"
                className="shrink-0 rounded-full bg-brand-700 px-7 py-3.5 font-bold text-white shadow-lg shadow-brand-700/25 transition hover:bg-brand-800"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
