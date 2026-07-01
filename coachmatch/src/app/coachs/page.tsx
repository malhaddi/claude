import type { Metadata } from "next";

import { CoachSearch } from "@/components/search/coach-search";
import { getCoaches } from "@/lib/coaches";

export const metadata: Metadata = {
  title: "Trouver un coach",
  description:
    "Filtrez par spécialisation (force, hybride, bodybuilding), format, sexe, budget, ville et disponibilités pour trouver votre coach sportif.",
};

/**
 * Page annuaire — Server Component volontairement mince : elle charge les
 * données via la façade (mock aujourd'hui, Supabase demain) et délègue toute
 * l'interactivité au Client Component CoachSearch. Quand le filtrage passera
 * côté serveur, c'est ici qu'on lira les searchParams pour appeler la RPC.
 */
export default async function CoachsPage() {
  const coaches = await getCoaches();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Trouvez le coach qu&apos;il vous faut
        </h1>
        <p className="text-muted-foreground text-sm">
          Force, hybride ou bodybuilding — en ligne ou en salle. Comparez les
          profils, les tarifs et écrivez directement au coach.
        </p>
      </div>

      <CoachSearch coaches={coaches} />
    </div>
  );
}
