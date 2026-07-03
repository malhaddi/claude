"use client";

/**
 * CSS-only iPhone-style mockup showing the MyBIAT app home screen.
 * Everything is vector/CSS so it stays crisp and needs no assets.
 */
export default function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto w-[280px] rounded-[3rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl ${className}`}
      role="img"
      aria-label="Application MyBIAT"
    >
      {/* notch */}
      <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />

      <div className="overflow-hidden rounded-[2.4rem] bg-gradient-to-b from-[#0a1a42] to-[#10245c]">
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pb-2 pt-8 text-[10px] font-semibold text-white/90">
          <span className="tnum">09:41</span>
          <div className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded-[2px] bg-white/80" />
            <span className="inline-block h-2 w-1 rounded-[2px] bg-white/50" />
            <span className="inline-block h-2.5 w-4 rounded-[3px] border border-white/70" />
          </div>
        </div>

        {/* greeting */}
        <div className="flex items-center justify-between px-5 pt-1">
          <div>
            <p className="text-[10px] text-blue-200/80">Bonsoir,</p>
            <p className="text-sm font-bold text-white">Ahmed 👋</p>
          </div>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white">
            AB
          </div>
        </div>

        {/* balance card */}
        <div className="mx-4 mt-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
          <p className="text-[10px] text-blue-200/80">Solde total</p>
          <p className="tnum mt-0.5 text-2xl font-extrabold text-white">
            24 850<span className="text-sm font-bold">,320 DT</span>
          </p>
          <div className="mt-3 flex gap-2">
            {["Virement", "Recharge", "Payer"].map((a) => (
              <span
                key={a}
                className="rounded-full bg-white/15 px-3 py-1 text-[9px] font-semibold text-white"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* mini chart */}
        <div className="mx-4 mt-3 rounded-2xl bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-blue-100">Dépenses — Juin</p>
            <p className="tnum text-[10px] font-bold text-emerald-300">−12%</p>
          </div>
          <svg viewBox="0 0 200 46" className="mt-2 w-full" aria-hidden>
            <defs>
              <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#59aaff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#59aaff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 34 C20 30 30 18 48 20 S 78 38 96 30 S 128 8 148 12 S 182 26 200 16"
              fill="none"
              stroke="#8ec9ff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0 34 C20 30 30 18 48 20 S 78 38 96 30 S 128 8 148 12 S 182 26 200 16 L200 46 L0 46 Z"
              fill="url(#spark)"
            />
          </svg>
        </div>

        {/* transactions */}
        <div className="mx-4 mb-5 mt-3 space-y-2">
          {[
            { icon: "🛒", name: "Carrefour Market", amount: "−86,400 DT" },
            { icon: "💼", name: "Salaire — Virement", amount: "+3 200,000 DT", pos: true },
            { icon: "☕", name: "Café El Ali, La Marsa", amount: "−7,500 DT" },
          ].map((t) => (
            <div key={t.name} className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-sm">
                {t.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold text-white">{t.name}</p>
                <p className="text-[8px] text-blue-200/60">Aujourd&apos;hui</p>
              </div>
              <p className={`tnum text-[10px] font-bold ${t.pos ? "text-emerald-300" : "text-white/90"}`}>
                {t.amount}
              </p>
            </div>
          ))}
        </div>

        {/* tab bar */}
        <div className="flex justify-around border-t border-white/10 bg-[#081536] px-4 py-3">
          {["●", "▤", "⇄", "▦", "☰"].map((i, idx) => (
            <span key={idx} className={`text-xs ${idx === 0 ? "text-blue-300" : "text-white/40"}`}>
              {i}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
