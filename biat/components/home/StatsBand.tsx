import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import { STATS } from "@/lib/site";

export default function StatsBand() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <Reveal>
          <div className="grid grid-cols-2 gap-8 rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-10 shadow-sm lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-800 sm:text-4xl">
                  {s.isYear ? (
                    <span className="tnum">{s.value}</span>
                  ) : (
                    <Counter to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  )}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
