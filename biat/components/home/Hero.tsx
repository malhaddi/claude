import Link from "next/link";
import BankCard from "@/components/BankCard";
import Reveal from "@/components/Reveal";

function FauxQr() {
  // stylized QR motif (decorative)
  const cells = [
    "M2 2h8v8H2z", "M22 2h8v8h-8z", "M2 22h8v8H2z",
    "M4 4h4v4H4z", "M24 4h4v4h-4z", "M4 24h4v4H4z",
    "M14 2h2v2h-2z", "M18 4h2v4h-2z", "M14 8h2v4h-2z", "M12 6h2v2h-2z",
    "M2 14h4v2H2z", "M8 12h2v4H8z", "M12 14h4v4h-4z", "M20 14h2v2h-2z",
    "M24 12h4v2h-4z", "M28 16h2v4h-2z", "M24 20h2v4h-2z",
    "M14 20h2v4h-2z", "M18 22h4v2h-4z", "M14 26h4v2h-4z", "M20 28h4v2h-4z",
    "M28 26h2v4h-2z", "M24 28h2v2h-2z", "M6 14h0z",
  ];
  return (
    <svg viewBox="0 0 32 32" className="h-16 w-16" aria-hidden>
      <rect width="32" height="32" rx="3" fill="white" />
      {cells.map((d, i) => (
        <path key={i} d={d} fill="#0a1a42" />
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="mesh-hero relative overflow-hidden text-white">
      <div className="grid-overlay absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-32 lg:pt-24">
        {/* ==== Copy ==== */}
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur">
              🏆 Élue « Best Bank in Tunisia » — Euromoney 2024
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              La banque qui fait
              <br />
              avancer{" "}
              <span className="bg-gradient-to-r from-accent-400 via-accent-500 to-brand-400 bg-clip-text text-transparent">
                la Tunisie.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-blue-100/85">
              Comptes, cartes, crédits, épargne et l&apos;app MyBIAT la mieux notée du pays.
              Depuis 1976, engagés avec vous — aujourd&apos;hui, à portée de main.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/ouvrir-un-compte"
                className="group rounded-full bg-accent-500 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-accent-500/30 transition hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-2xl"
              >
                Ouvrir un compte en 10 min
                <span className="ml-2 inline-block transition group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/simulateurs"
                className="rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/12"
              >
                Simuler un crédit
              </Link>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 p-3 pr-5 backdrop-blur">
                <FauxQr />
                <div className="text-xs leading-snug text-blue-100/85">
                  <p className="font-bold text-white">Téléchargez MyBIAT</p>
                  <p>Scannez le code</p>
                  <div className="mt-1.5 flex gap-1.5">
                    <span className="rounded-md border border-white/20 px-2 py-0.5 text-[10px] font-semibold"> App Store</span>
                    <span className="rounded-md border border-white/20 px-2 py-0.5 text-[10px] font-semibold">▶ Google Play</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-100/80">
                <p className="text-base font-extrabold text-white">
                  ★★★★★ <span className="tnum">4,8/5</span>
                </p>
                <p>+1 million d&apos;utilisateurs MyBIAT</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ==== Visual ==== */}
        <div className="relative mx-auto hidden w-full max-w-md sm:block">
          <div className="animate-float">
            <BankCard variant="platinum" holder="SYRINE BEN AMMAR" className="relative z-10 rotate-[-7deg]" />
          </div>
          <div className="animate-float absolute -right-4 top-36 w-[88%] sm:-right-10" style={{ animationDelay: "-3.2s" }}>
            <BankCard variant="elite" holder="MEHDI KHELIFI" className="rotate-[6deg]" />
          </div>

          {/* floating notification chips */}
          <div className="glass absolute -left-6 top-24 z-20 hidden items-center gap-3 rounded-2xl p-3 lg:flex">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400/20 text-base">✓</span>
            <div className="text-xs">
              <p className="font-bold text-white">Virement reçu</p>
              <p className="tnum text-emerald-300">+2 450,000 DT</p>
            </div>
          </div>
          <div className="glass absolute -bottom-8 left-10 z-20 hidden items-center gap-3 rounded-2xl p-3 lg:flex">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-500/25 text-base">🔒</span>
            <div className="text-xs">
              <p className="font-bold text-white">Carte verrouillée</p>
              <p className="text-blue-200/80">depuis MyBIAT, en 1 tap</p>
            </div>
          </div>
        </div>
      </div>

      {/* bottom fade into white */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white" aria-hidden />
    </section>
  );
}
