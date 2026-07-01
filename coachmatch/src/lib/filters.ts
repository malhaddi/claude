/**
 * Moteur de filtrage de l'annuaire — fonctions PURES, sans React ni I/O.
 *
 * Pourquoi séparé du composant : (1) testable unitairement sans DOM ;
 * (2) l'objet CoachFilters est pensé pour se sérialiser tel quel vers la
 * RPC SQL `search_coaches` (voir supabase/migrations/0001_schema.sql) — à
 * l'itération 2, on remplace `applyFilters` par un appel serveur sans
 * toucher aux composants.
 */

import type {
  AvailabilityWindow,
  Coach,
  CoachingMode,
  Gender,
  Specialization,
} from "./types";

// ─── Modèle de filtres ───────────────────────────────────────────────────────

export interface CoachFilters {
  /** Recherche libre : nom, accroche, bio, ville. */
  query: string;
  /** Vide = toutes les spécialisations (le filtre est inactif). */
  specializations: Specialization[];
  mode: CoachingMode | "all";
  gender: Gender | "all";
  /** Ville exacte issue des fiches ; "all" = partout. La vraie géolocalisation
   * (point GPS + rayon, PostGIS) est prête côté SQL — un select de villes
   * suffit pour le MVP sur données mock. */
  city: string | "all";
  /** Prix max en €/séance. À PRICE_RANGE.max, le filtre est inactif (pas de
   * plafond) — évite un état `number | null` pour le slider. */
  maxPrice: number;
  /** Créneaux où LE CLIENT est disponible ; vide = indifférent. */
  availability: AvailabilityWindow[];
}

export const PRICE_RANGE = { min: 20, max: 150, step: 5 } as const;

export const defaultFilters: CoachFilters = {
  query: "",
  specializations: [],
  mode: "all",
  gender: "all",
  city: "all",
  maxPrice: PRICE_RANGE.max,
  availability: [],
};

// ─── Application des filtres ─────────────────────────────────────────────────

/** Chaque critère est un prédicat indépendant : un filtre inactif laisse tout
 * passer. Même sémantique que les clauses `p_x is null or …` de la RPC. */
export function applyFilters(coaches: Coach[], filters: CoachFilters): Coach[] {
  const query = filters.query.trim().toLowerCase();

  return coaches.filter((coach) => {
    if (query) {
      const haystack =
        `${coach.fullName} ${coach.headline} ${coach.bio} ${coach.city}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    // Sémantique OU : le coach doit couvrir AU MOINS UNE spécialisation
    // demandée. (Un « ET » strict viderait les résultats dès 2 critères,
    // les coachs mono-spécialité étant majoritaires.)
    if (
      filters.specializations.length > 0 &&
      !coach.specializations.some((s) => filters.specializations.includes(s))
    ) {
      return false;
    }

    if (filters.mode !== "all" && !coach.modes.includes(filters.mode)) {
      return false;
    }

    if (filters.gender !== "all" && coach.gender !== filters.gender) {
      return false;
    }

    if (filters.city !== "all" && coach.city !== filters.city) {
      return false;
    }

    if (
      filters.maxPrice < PRICE_RANGE.max &&
      coach.pricePerSession > filters.maxPrice
    ) {
      return false;
    }

    // Sémantique OU également : le client coche les plages où IL est libre ;
    // un coach joignable sur l'une d'elles est un match possible.
    if (
      filters.availability.length > 0 &&
      !coach.availability.some((a) => filters.availability.includes(a))
    ) {
      return false;
    }

    return true;
  });
}

/** Nombre de critères actifs — alimente le bouton « Réinitialiser (n) ». */
export function countActiveFilters(filters: CoachFilters): number {
  let count = 0;
  if (filters.query.trim()) count += 1;
  if (filters.specializations.length > 0) count += 1;
  if (filters.mode !== "all") count += 1;
  if (filters.gender !== "all") count += 1;
  if (filters.city !== "all") count += 1;
  if (filters.maxPrice < PRICE_RANGE.max) count += 1;
  if (filters.availability.length > 0) count += 1;
  return count;
}

/** Villes distinctes des fiches, pour alimenter le select « Ville ». */
export function getCities(coaches: Coach[]): string[] {
  return [...new Set(coaches.map((c) => c.city))].sort((a, b) =>
    a.localeCompare(b, "fr")
  );
}

// ─── Tri ─────────────────────────────────────────────────────────────────────

export type SortKey = "rating" | "price_asc" | "price_desc" | "experience";

export const sortMeta: Record<SortKey, { label: string }> = {
  rating: { label: "Mieux notés" },
  price_asc: { label: "Prix croissant" },
  price_desc: { label: "Prix décroissant" },
  experience: { label: "Plus expérimentés" },
};

export const sortOrder: SortKey[] = [
  "rating",
  "price_asc",
  "price_desc",
  "experience",
];

const comparators: Record<SortKey, (a: Coach, b: Coach) => number> = {
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  price_asc: (a, b) => a.pricePerSession - b.pricePerSession,
  price_desc: (a, b) => b.pricePerSession - a.pricePerSession,
  experience: (a, b) => b.yearsExperience - a.yearsExperience,
};

export function sortCoaches(coaches: Coach[], key: SortKey): Coach[] {
  // Copie avant tri : ne jamais muter le tableau reçu en prop.
  return [...coaches].sort(comparators[key]);
}
