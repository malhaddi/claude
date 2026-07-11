import { FileText, LayoutTemplate, Rocket, Wand2 } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { steps } from "@/lib/content";

const stepIcons = [FileText, LayoutTemplate, Wand2, Rocket];

export function HowItWorks() {
  return (
    <section
      id="fonctionnement"
      className="scroll-mt-20 bg-white py-20 sm:py-24"
      aria-label="Fonctionnement"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Fonctionnement"
          title="De la fiche produit à l'advertorial en 4 étapes"
          description="Aucune compétence en rédaction ni en développement n'est nécessaire : le produit vous guide de bout en bout."
        />
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = stepIcons[index] ?? FileText;
            return (
              <li key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
                    Étape {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
