import { ArrowRight, ImageIcon, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { foundingOffer, siteTagline } from "@/lib/content";
import { formatEur } from "@/lib/format";

/** Decorative mobile preview of a generated advertorial page. */
function AdvertorialPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-64 sm:w-72">
      <div className="rounded-[2.25rem] border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-900/5">
        <div className="overflow-hidden rounded-[1.75rem]">
          <div className="bg-slate-100 px-4 py-2 text-[10px] text-slate-500">
            votre-boutique.fr/advertorial
          </div>
          <div className="space-y-3 p-4">
            <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-indigo-700 uppercase">
              Conseils &amp; tests
            </span>
            <p className="text-sm leading-snug font-bold text-slate-900">
              Pourquoi tout le monde parle de ce produit en ce moment ?
            </p>
            <div className="flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 via-slate-100 to-slate-200">
              <ImageIcon className="size-6 text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-slate-200" />
              <div className="h-2 w-11/12 rounded-full bg-slate-200" />
              <div className="h-2 w-4/5 rounded-full bg-slate-200" />
            </div>
            <div className="rounded-lg bg-indigo-600 py-2 text-center text-[10px] font-semibold text-white">
              Découvrir l&apos;offre
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-40 -left-24 hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-md lg:flex lg:items-center lg:gap-1.5">
        <Sparkles className="size-3.5 text-indigo-600" />
        Rédigé en français
      </div>
      <div className="absolute -right-10 bottom-20 hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-md lg:block">
        Mobile-first
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Offre fondateur — {formatEur(foundingOffer.priceMonthlyEur)}/mois
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {siteTagline}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            AdvertoAI génère des pages de pré-vente mobile-first à partir de
            vos informations produit : choisissez un cadre éditorial, l&apos;IA
            rédige en français, vous ajustez, vous publiez.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/dashboard" className="px-6 py-3 text-base">
              Commencer
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href="#modeles"
              variant="secondary"
              className="px-6 py-3 text-base"
            >
              Voir les modèles
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Sans engagement · Pensé pour les marques Shopify &amp; DTC
            francophones
          </p>
        </div>
        <AdvertorialPreview />
      </div>
    </section>
  );
}
