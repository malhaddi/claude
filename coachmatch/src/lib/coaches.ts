/**
 * Façade de la couche données — SEUL point d'entrée des composants.
 *
 * Itération 1 : renvoie les mocks. Itération 2 : quand les variables
 * NEXT_PUBLIC_SUPABASE_* seront configurées, ces fonctions interrogeront
 * Supabase (RPC `search_coaches` + select sur `coaches`) — la signature ne
 * change pas, donc AUCUN composant n'est à modifier. C'est le même schéma
 * « source réelle absente ⇒ échantillon déterministe » que le reste du dépôt.
 *
 * Les fonctions sont async dès maintenant, précisément pour que le passage
 * au réseau soit un changement d'implémentation, pas d'API.
 */

import { mockCoaches } from "./mock-coaches";
import type { Coach } from "./types";

/** L'annuaire complet (fiches publiées). */
export async function getCoaches(): Promise<Coach[]> {
  // TODO(itération 2) : si process.env.NEXT_PUBLIC_SUPABASE_URL est défini,
  //   const supabase = await createClient();               // lib/supabase/server
  //   const { data } = await supabase.rpc("search_coaches", {});
  //   return data.map(rowToCoach);  // centimes → euros, jointures aplaties…
  return mockCoaches;
}

/** Une fiche par son slug d'URL — undefined déclenche notFound() côté page. */
export async function getCoachBySlug(slug: string): Promise<Coach | undefined> {
  return mockCoaches.find((coach) => coach.slug === slug);
}
