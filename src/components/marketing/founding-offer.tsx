import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { foundingOffer } from "@/lib/content";
import { formatEur } from "@/lib/format";

export function FoundingOffer() {
  return (
    <section
      id="tarifs"
      className="scroll-mt-20 bg-slate-50 py-20 sm:py-24"
      aria-label="Tarifs"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Tarifs"
          title="Un tarif unique, pensé pour démarrer"
          description="Pas de paliers compliqués : une offre de lancement complète pour les premiers utilisateurs."
        />
        <div className="mx-auto mt-14 max-w-lg rounded-3xl bg-white p-8 shadow-sm ring-2 ring-indigo-600 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {foundingOffer.name}
            </h3>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Offre de lancement
            </span>
          </div>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight text-slate-900">
              {formatEur(foundingOffer.priceMonthlyEur)}
            </span>
            <span className="text-base font-medium text-slate-500">/mois</span>
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {foundingOffer.description}
          </p>
          <ul className="mt-6 space-y-3">
            {foundingOffer.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm text-slate-700">
                <Check
                  className="size-5 shrink-0 text-indigo-600"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/dashboard"
            className="mt-8 w-full px-6 py-3 text-base"
          >
            Commencer
          </ButtonLink>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            {foundingOffer.note}
          </p>
        </div>
      </div>
    </section>
  );
}
