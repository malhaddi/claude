import { Compass } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Compass className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-semibold text-indigo-600">Erreur 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Page introuvable
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <ButtonLink href="/" className="mt-8">
        Retour à l&apos;accueil
      </ButtonLink>
    </div>
  );
}
