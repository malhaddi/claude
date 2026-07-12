import { Check, ImageIcon, Sparkles } from "lucide-react";

import { workflowSteps } from "@/lib/content";

/**
 * Decorative, mobile-friendly product preview shown in the hero.
 * Pure CSS/markup (no client JS) and marked as a product demonstration by the
 * caller. The pulsing "generation" dot is disabled under reduced motion via
 * the `motion-safe:` variant.
 */
export function HeroPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-sm">
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-slate-900/5">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-1 pb-2.5">
          <span className="size-2.5 rounded-full bg-slate-200" />
          <span className="size-2.5 rounded-full bg-slate-200" />
          <span className="size-2.5 rounded-full bg-slate-200" />
          <span className="ml-2 flex-1 truncate rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-400">
            publy.fr/p/mon-produit
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
          {/* Rendered advertorial column */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="space-y-2.5 p-3">
              <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-indigo-700 uppercase">
                Conseils &amp; tests
              </span>
              <p className="text-[13px] leading-snug font-bold text-slate-900">
                J&apos;ai testé ce produit pendant 30 jours
              </p>
              <div className="flex h-16 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 via-slate-100 to-slate-200">
                <ImageIcon className="size-5 text-slate-400" />
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-slate-200" />
                <div className="h-1.5 w-11/12 rounded-full bg-slate-200" />
                <div className="h-1.5 w-4/5 rounded-full bg-slate-200" />
              </div>
              <div className="rounded-lg bg-indigo-600 py-1.5 text-center text-[10px] font-semibold text-white">
                Découvrir l&apos;offre
              </div>
            </div>
          </div>

          {/* Generation status column */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase">
              <Sparkles className="size-3 text-indigo-600" />
              Génération
            </p>
            <ul className="mt-2.5 space-y-2">
              {workflowSteps.map((step, index) => {
                const done = index < workflowSteps.length - 1;
                return (
                  <li
                    key={step.id}
                    className="flex items-center gap-2 text-[11px] text-slate-600"
                  >
                    <span
                      className={
                        done
                          ? "flex size-4 items-center justify-center rounded-full bg-indigo-600 text-white"
                          : "flex size-4 items-center justify-center rounded-full border border-indigo-300 bg-white motion-safe:animate-pulse"
                      }
                    >
                      {done ? <Check className="size-2.5" /> : null}
                    </span>
                    {step.title}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
