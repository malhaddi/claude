import { ChevronDown, Sparkles } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { templates } from "@/lib/content";
import { cx } from "@/lib/utils";

export function TemplateGallery() {
  return (
    <section
      id="modeles"
      className="scroll-mt-20 bg-slate-50 py-20 sm:py-24"
      aria-label="Modèles d'advertoriaux"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Modèles"
            title="Des cadres d'advertorial pensés pour le funnel"
            description="Chaque cadre structure votre page selon votre produit et l'étape de campagne visée. Dépliez une carte pour voir sa structure type."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => {
            const soon = template.availability === "soon";
            return (
              <Reveal key={template.id} delayMs={index * 70}>
                <details
                  className={cx(
                    "group h-full rounded-2xl border bg-white p-5 shadow-sm transition-all",
                    "hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0",
                    "open:ring-1 open:ring-indigo-200",
                    soon ? "border-slate-200" : "border-slate-200",
                  )}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cx(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                            soon
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700",
                          )}
                        >
                          {soon ? "Bientôt" : "Disponible au lancement"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                          {template.funnelStage}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-slate-900">
                        {template.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">
                          Idéal pour :
                        </span>{" "}
                        {template.bestFor}
                      </p>
                    </div>
                    <ChevronDown
                      className="mt-1 size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-indigo-600 uppercase">
                      <Sparkles className="size-3.5" aria-hidden="true" />
                      Structure type
                    </p>
                    <ol className="mt-3 space-y-2">
                      {template.structure.map((line, i) => (
                        <li
                          key={line}
                          className="flex gap-3 text-sm text-slate-600"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-700">
                            {i + 1}
                          </span>
                          {line}
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Les cadres marqués « Bientôt » arriveront après le lancement. Trois
          cadres sont prévus dès l&apos;ouverture.
        </p>
      </div>
    </section>
  );
}
