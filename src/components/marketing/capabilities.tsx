import { Check, Clock } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { launchCapabilities, plannedCapabilities } from "@/lib/content";

export function Capabilities() {
  return (
    <section
      className="scroll-mt-20 bg-white py-20 sm:py-24"
      aria-label="Capacités du produit"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Capacités"
            title="Ce que fait Publy — et ce qui arrive ensuite"
            description="Nous distinguons clairement ce qui est prévu dès le lancement de ce qui est en préparation."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Check className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Disponible au lancement
                </h3>
                <p className="text-sm text-slate-600">
                  Le socle pour créer et publier vos advertoriaux.
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {launchCapabilities.map((capability) => (
                <li
                  key={capability.label}
                  className="flex gap-3 text-sm text-slate-700"
                >
                  <Check
                    className="size-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  {capability.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delayMs={100}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Bientôt</h3>
                <p className="text-sm text-slate-600">
                  Sur la feuille de route, pas encore disponible.
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {plannedCapabilities.map((capability) => (
                <li
                  key={capability.label}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <Clock
                    className="size-5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  {capability.label}
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                    Bientôt
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
