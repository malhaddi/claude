import Link from "next/link";
import Reveal from "@/components/Reveal";
import SimulatorWidget from "@/components/SimulatorWidget";
import { AWARDS, NEWS, TESTIMONIALS } from "@/lib/site";

/* ============ Simulator teaser ============ */
export function SimulatorTeaser() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-500">
              Simulateurs
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Votre projet, chiffré en 30 secondes.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Maison, voiture, études : ajustez les curseurs, la mensualité se calcule en direct.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120} className="mt-12">
          <SimulatorWidget />
        </Reveal>
      </div>
    </section>
  );
}

/* ============ Security band ============ */
const SECURITY = [
  {
    icon: "🛡️",
    title: "3-D Secure sur tous vos paiements",
    desc: "Chaque achat en ligne est confirmé par un code unique envoyé sur votre mobile.",
  },
  {
    icon: "❄️",
    title: "Verrouillage instantané",
    desc: "Carte perdue ? Bloquez-la en un tap depuis MyBIAT, débloquez-la tout aussi vite.",
  },
  {
    icon: "🤖",
    title: "Détection de fraude 24/7",
    desc: "Nos systèmes surveillent les transactions inhabituelles en continu et vous alertent.",
  },
  {
    icon: "🏛️",
    title: "Banque agréée BCT",
    desc: "Vos dépôts sont protégés par le fonds de garantie des dépôts bancaires tunisien.",
  },
];

export function SecurityBand() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mesh-hero relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-white sm:px-14">
          <div className="grid-overlay absolute inset-0" aria-hidden />
          <div className="relative">
            <Reveal>
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
                  Sécurité
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Votre argent, gardé comme un trésor national.
                </h2>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SECURITY.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div className="glass h-full rounded-2xl p-5">
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="mt-3 text-sm font-extrabold">{s.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-blue-100/80">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Testimonials + awards ============ */
export function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-500">
              Ils nous font confiance
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Des millions de Tunisiens. <br className="hidden sm:block" />
              Une seule exigence.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                <p className="text-accent-500" aria-label={`${t.rating} étoiles sur 5`}>
                  {"★".repeat(t.rating)}
                </p>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
                  « {t.text} »
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-700 text-sm font-extrabold text-white">
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-slate-900">{t.name}</span>
                    <span className="block text-xs text-slate-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* awards strip */}
        <Reveal delay={150}>
          <div className="mt-12 grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
            {AWARDS.map((a) => (
              <div key={a.title + a.year} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-400/20 text-xl">
                  🏆
                </span>
                <div>
                  <p className="text-sm font-extrabold leading-tight text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">
                    {a.by} · {a.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ News + Fondation ============ */
export function NewsSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              La BIAT en mouvement
            </h2>
            <a href="#" className="text-sm font-bold text-brand-700 hover:underline">
              Toute l&apos;actualité →
            </a>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {NEWS.map((n, i) => (
            <Reveal key={n.title} delay={i * 90}>
              <article className="group h-full cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div
                  className={`h-36 ${
                    i === 0
                      ? "bg-gradient-to-br from-brand-600 to-brand-900"
                      : i === 1
                        ? "bg-gradient-to-br from-gold-500 to-accent-600"
                        : "bg-gradient-to-br from-navy-700 to-brand-500"
                  } relative overflow-hidden`}
                >
                  <span className="absolute bottom-4 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800">
                    {n.tag}
                  </span>
                  <span className="grid-overlay absolute inset-0" aria-hidden />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {n.date}
                  </p>
                  <h3 className="mt-2 text-lg font-extrabold leading-snug text-slate-900 transition group-hover:text-brand-700">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{n.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Fondation band */}
        <Reveal delay={120}>
          <div
            id="fondation"
            className="mt-14 flex flex-col items-center justify-between gap-6 rounded-[2.5rem] bg-gradient-to-r from-accent-500 to-accent-600 px-10 py-12 text-white md:flex-row"
          >
            <div className="max-w-xl text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                Fondation BIAT pour la jeunesse tunisienne
              </p>
              <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Une banque qui investit dans sa jeunesse.
              </h3>
              <p className="mt-3 text-white/85">
                Éducation, culture, entrepreneuriat : depuis 2014, la Fondation BIAT accompagne
                celles et ceux qui construisent la Tunisie de demain.
              </p>
            </div>
            <Link
              href="/particuliers#jeunes"
              className="shrink-0 rounded-full bg-white px-7 py-3.5 font-bold text-accent-600 shadow-lg transition hover:-translate-y-0.5"
            >
              Découvrir nos actions
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
