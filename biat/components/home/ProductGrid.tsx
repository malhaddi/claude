import Link from "next/link";
import Reveal from "@/components/Reveal";

const PRODUCTS = [
  {
    icon: "🏦",
    title: "Comptes & Packs",
    desc: "Compte courant, Pack FIRST jeunes actifs : une offre claire, sans frais cachés.",
    href: "/particuliers#comptes",
    accent: "from-brand-500/10 to-brand-500/0",
  },
  {
    icon: "💳",
    title: "Cartes bancaires",
    desc: "De la carte CHABEB gratuite à la VISA Infinite : trouvez la vôtre.",
    href: "/cartes",
    accent: "from-accent-500/10 to-accent-500/0",
  },
  {
    icon: "🔑",
    title: "Crédits",
    desc: "BIATIMMO, CREDIAUTO, CREDIMEDIA — réponse de principe immédiate en ligne.",
    href: "/particuliers#credits",
    accent: "from-emerald-500/10 to-emerald-500/0",
  },
  {
    icon: "🌱",
    title: "Épargne & Placements",
    desc: "Épargne WLEDNA pour vos enfants, CEA, comptes à terme : faites fructifier.",
    href: "/particuliers#epargne",
    accent: "from-teal-500/10 to-teal-500/0",
  },
  {
    icon: "🛡️",
    title: "Bancassurance",
    desc: "Avec Assurances BIAT, protégez votre famille, votre auto et votre habitation.",
    href: "/particuliers#assurance",
    accent: "from-violet-500/10 to-violet-500/0",
  },
  {
    icon: "🌍",
    title: "Tunisiens à l'étranger",
    desc: "Compte en dinars ou en devises, transferts facilités : la BIAT vous suit partout.",
    href: "/particuliers#tre",
    accent: "from-sky-500/10 to-sky-500/0",
  },
];

export default function ProductGrid() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-accent-500">
            Une banque complète
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Tout ce qu&apos;une grande banque doit faire.{" "}
            <span className="text-brand-700">En mieux.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <Link
                href={p.href}
                className="group relative block h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/8"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-0 transition group-hover:opacity-100`} aria-hidden />
                <div className="relative">
                  <span className="grid h-13 w-13 place-items-center rounded-2xl bg-slate-50 text-2xl shadow-sm transition group-hover:scale-110 group-hover:bg-white">
                    {p.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.desc}</p>
                  <p className="mt-4 text-sm font-bold text-brand-700">
                    Découvrir
                    <span className="ml-1.5 inline-block transition group-hover:translate-x-1.5">→</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
