import PhoneMockup from "@/components/PhoneMockup";
import Reveal from "@/components/Reveal";

const FEATURES = [
  {
    icon: "⚡",
    title: "Virements instantanés",
    desc: "En dinars ou en devises, vers toutes les banques tunisiennes.",
  },
  {
    icon: "🧾",
    title: "Factures en 2 taps",
    desc: "STEG, SONEDE, opérateurs télécom — payez sans file d'attente.",
  },
  {
    icon: "❄️",
    title: "Cartes sous contrôle",
    desc: "Verrouillez, déplafonnez, activez le paiement en ligne — instantanément.",
  },
  {
    icon: "📊",
    title: "Budget intelligent",
    desc: "Vos dépenses classées automatiquement, des alertes avant les découverts.",
  },
];

export default function AppSection() {
  return (
    <section id="mybiat" className="overflow-hidden bg-gradient-to-b from-white to-brand-50/60 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div
              className="absolute -inset-10 rounded-full bg-brand-400/15 blur-3xl"
              aria-hidden
            />
            <PhoneMockup className="relative" />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-500">MyBIAT</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Votre banque entière, <br className="hidden sm:block" />
              dans votre poche.
            </h2>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              L&apos;application bancaire la mieux notée de Tunisie —{" "}
              <strong className="tnum">4,8★</strong> et plus d&apos;un million d&apos;utilisateurs.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="flex h-full gap-3.5 rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-lg">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{f.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-9 flex flex-wrap gap-3">
              {[
                { store: "App Store", sub: "Télécharger sur l'", mark: "" },
                { store: "Google Play", sub: "Disponible sur", mark: "▶" },
              ].map((b) => (
                <a
                  key={b.store}
                  href="#"
                  className="flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <span className="text-2xl">{b.mark}</span>
                  <span className="leading-tight">
                    <span className="block text-[10px] opacity-75">{b.sub}</span>
                    <span className="block text-base font-bold">{b.store}</span>
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
