import {
  Languages,
  ListChecks,
  SlidersHorizontal,
  Smartphone,
  Rocket,
  Timer,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { benefits } from "@/lib/content";

const benefitIcons = [
  Smartphone,
  Languages,
  ListChecks,
  Timer,
  SlidersHorizontal,
  Rocket,
];

export function Benefits() {
  return (
    <section
      id="avantages"
      className="scroll-mt-20 bg-white py-20 sm:py-24"
      aria-label="Avantages"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Avantages"
          title="Conçu pour les marques qui vendent en français"
          description="Un outil spécialisé, pas un générateur de texte générique : chaque page suit les codes de l'advertorial francophone."
        />
        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[index] ?? Smartphone;
            return (
              <li key={benefit.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
