import { ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { differentiators } from "@/lib/content";

export function FranceFirst() {
  return (
    <section
      className="scroll-mt-20 bg-slate-900 py-20 text-white sm:py-24"
      aria-label="Différenciation française"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-200">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Pensé pour le marché francophone
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Un français rédigé pour vendre, pas traduit
          </h2>
          <p className="mt-4 text-lg leading-8 text-pretty text-slate-300">
            La différence se joue dans les mots, les objections et les codes du
            e-commerce français.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 60}>
              <h3 className="text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
