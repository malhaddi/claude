import type { Metadata } from "next";
import { Hammer } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Tableau de bord",
  robots: { index: false },
};

/**
 * Placeholder route for the future application (projects, generation,
 * editing, publishing). Intentionally not implemented in this milestone.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Hammer className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-6 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        En construction
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Le tableau de bord arrive bientôt
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
        L&apos;espace de travail AdvertoAI — création de compte, projets,
        génération et publication de vos advertoriaux — sera disponible dans
        une prochaine version. Cette page est volontairement un simple espace
        réservé.
      </p>
      <ButtonLink href="/" variant="secondary" className="mt-8">
        Retour à l&apos;accueil
      </ButtonLink>
    </div>
  );
}
