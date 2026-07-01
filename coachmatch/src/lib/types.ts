/**
 * Modèle de domaine côté front.
 *
 * Ces types sont le MIROIR du schéma SQL (supabase/migrations/0001_schema.sql) :
 * les unions de chaînes reprennent exactement les valeurs des enums Postgres
 * (user_role, gender_type, coaching_mode) et les clés de la table
 * specializations. La base reste la source de vérité — toute évolution
 * commence par une migration, puis se répercute ici.
 *
 * Convention (héritée du reste du dépôt) : pour chaque union, un objet
 * `xxxMeta` centralise libellé + style. L'UI ne code jamais un libellé en
 * dur : ajouter une spécialisation = une entrée ici + une ligne en base.
 */

export type UserRole = "client" | "coach";

/** Clés de la table `specializations` (« Criteria » du brief). */
export type Specialization = "strength" | "hybrid" | "bodybuilding";

export type CoachingMode = "online" | "in_person";

export type Gender = "female" | "male";

/**
 * Créneaux simplifiés pour le FILTRE de recherche. En base, la disponibilité
 * fine vit dans `availability_slots` (jour + heures) ; côté annuaire on agrège
 * en 4 plages lisibles — un filtre « mardi 18h-19h30 » serait trop granulaire
 * pour une première prise de contact.
 */
export type AvailabilityWindow = "morning" | "midday" | "evening" | "weekend";

export interface Coach {
  id: string;
  /** Segment d'URL de la fiche publique : /coachs/[slug]. */
  slug: string;
  fullName: string;
  avatarUrl: string;
  gender: Gender;
  /** Accroche courte affichée sur la carte de l'annuaire. */
  headline: string;
  bio: string;
  /** Approche d'entraînement (ex: « faible volume, haute intensité »). */
  methodology: string;
  specializations: Specialization[];
  modes: CoachingMode[];
  city: string;
  /** Prix en euros par séance — la base stocke des centimes, la façade
   * (lib/coaches.ts) fera la conversion au moment du branchement Supabase. */
  pricePerSession: number;
  /** Suivi mensuel optionnel (programmation à distance), en euros. */
  priceMonthly?: number;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  certifications: string[];
  availability: AvailabilityWindow[];
  /** Identité vérifiée par la plateforme (diplômes contrôlés). */
  verified: boolean;
}

// ─── Meta : libellés + styles par valeur ─────────────────────────────────────

export const specializationMeta: Record<
  Specialization,
  { label: string; description: string; badgeClassName: string }
> = {
  strength: {
    label: "Force",
    description: "Powerlifting, haltérophilie, force athlétique",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-800",
  },
  hybrid: {
    label: "Hybride",
    description: "Force + endurance combinées",
    badgeClassName: "border-violet-200 bg-violet-50 text-violet-800",
  },
  bodybuilding: {
    label: "Bodybuilding",
    description: "Hypertrophie, esthétique, préparation compétition",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-800",
  },
};

export const specializationOrder: Specialization[] = [
  "strength",
  "hybrid",
  "bodybuilding",
];

export const modeMeta: Record<CoachingMode, { label: string; shortLabel: string }> = {
  online: { label: "En ligne (visio + programmation)", shortLabel: "En ligne" },
  in_person: { label: "Sur place (en salle)", shortLabel: "Sur place" },
};

export const genderMeta: Record<Gender, { label: string }> = {
  female: { label: "Femme" },
  male: { label: "Homme" },
};

export const availabilityMeta: Record<AvailabilityWindow, { label: string }> = {
  morning: { label: "Matin" },
  midday: { label: "Midi" },
  evening: { label: "Soir" },
  weekend: { label: "Week-end" },
};

export const availabilityOrder: AvailabilityWindow[] = [
  "morning",
  "midday",
  "evening",
  "weekend",
];
