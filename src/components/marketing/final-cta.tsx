import { ArrowRight, CreditCard } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { finalCta, hero } from "@/lib/content";

export function FinalCta() {
  return (
    <section
      aria-label="Créer mon premier advertorial"
      className="bg-white pb-20 sm:pb-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-14 text-center sm:px-14 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-pretty text-indigo-100">
            {finalCta.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <ButtonLink
              href={finalCta.cta.href}
              variant="inverted"
              className="px-6 py-3 text-base"
            >
              {finalCta.cta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <p className="flex items-center gap-2 text-sm text-indigo-100">
              <CreditCard className="size-4" aria-hidden="true" />
              {hero.noCardNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
