import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";

export function FinalCta() {
  return (
    <section aria-label="Commencer avec AdvertoAI" className="bg-white pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-indigo-600 px-6 py-14 text-center sm:px-14 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Prêt à publier votre premier advertorial ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-indigo-100">
            Rejoignez les fondateurs et transformez votre fiche produit en page
            de pré-vente française, prête à recevoir votre trafic publicitaire.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink
              href="/dashboard"
              variant="inverted"
              className="px-6 py-3 text-base"
            >
              Commencer
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href="#tarifs"
              variant="ghost"
              className="px-6 py-3 text-base text-indigo-100 hover:bg-indigo-500 hover:text-white"
            >
              Voir l&apos;offre fondateur
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
