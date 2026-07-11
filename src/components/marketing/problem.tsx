import { AlertTriangle, Link2Off, MessageSquareOff, Target } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { problemIntro, problems } from "@/lib/content";

const problemIcons = [Link2Off, MessageSquareOff, AlertTriangle, Target];

export function Problem() {
  return (
    <section
      className="scroll-mt-20 bg-slate-50 py-20 sm:py-24"
      aria-label="Le problème"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Le constat"
            title="Une fiche produit classique ne suffit pas toujours au trafic froid"
            description={problemIntro}
          />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {problems.map((problem, index) => {
            const Icon = problemIcons[index] ?? AlertTriangle;
            return (
              <Reveal
                key={problem.title}
                delayMs={index * 80}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {problem.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {problem.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-500">
          Ce sont des difficultés marketing fréquentes, pas une fatalité ni une
          règle universelle. Un advertorial aligné sur votre angle aide à y
          répondre.
        </p>
      </div>
    </section>
  );
}
