import { z } from "zod";

/**
 * French copy + controlled option lists for the project-research feature,
 * validated at module load. Controlled selects store a STABLE internal value
 * (never the translated label) so future logic/AI prompts don't depend on UI
 * wording.
 */

const nonEmpty = z.string().min(1);
const optionSchema = z.object({ value: nonEmpty, label: nonEmpty });

/** Awareness levels (Eugene Schwartz). Stable value → French label. */
export const awarenessLevels = z.array(optionSchema).length(5).parse([
  { value: "unaware", label: "Ne connaît pas encore le problème" },
  { value: "problem_aware", label: "Conscient du problème" },
  { value: "solution_aware", label: "Conscient des solutions" },
  { value: "product_aware", label: "Conscient du produit" },
  { value: "most_aware", label: "Prêt à acheter" },
]);

/** Preferred editorial tones. Stable value → French label. */
export const tones = z.array(optionSchema).length(6).parse([
  { value: "educational", label: "Pédagogique" },
  { value: "editorial", label: "Éditorial" },
  { value: "direct", label: "Direct" },
  { value: "premium", label: "Premium" },
  { value: "empathetic", label: "Empathique" },
  { value: "energetic", label: "Énergique" },
]);

export const awarenessValues = awarenessLevels.map((o) => o.value);
export const toneValues = tones.map((o) => o.value);

const researchContentSchema = z.object({
  tabs: z.object({
    product: nonEmpty,
    research: nonEmpty,
    generation: nonEmpty,
    soon: nonEmpty,
    locked: nonEmpty,
  }),
  page: z.object({
    title: nonEmpty,
    subtitle: nonEmpty,
  }),
  progress: z.object({
    label: nonEmpty,
    fieldsCount: nonEmpty, // "{done} / {total} champs essentiels"
    ready: nonEmpty,
    notReady: nonEmpty,
  }),
  sections: z.object({
    product: nonEmpty,
    customer: nonEmpty,
    problem: nonEmpty,
    objections: nonEmpty,
    campaign: nonEmpty,
  }),
  customerAudienceHint: nonEmpty,
  fields: z.record(z.string(), nonEmpty),
  selectPlaceholder: nonEmpty,
  optional: nonEmpty,
  submit: nonEmpty,
  submitting: nonEmpty,
  saved: nonEmpty,
  unsavedWarning: nonEmpty,
  errors: z.object({
    invalidOption: nonEmpty,
    tooLong: nonEmpty,
    notConfigured: nonEmpty,
    notFound: nonEmpty,
    saveFailed: nonEmpty,
  }),
});

export type ResearchContent = z.infer<typeof researchContentSchema>;

export const researchContent = researchContentSchema.parse({
  tabs: {
    product: "Informations produit",
    research: "Recherche client",
    generation: "Génération",
    soon: "Bientôt",
    locked: "Terminez la recherche",
  },
  page: {
    title: "Recherche client",
    subtitle:
      "Rassemblez le contexte produit, client et offre. Ces informations prépareront la future génération de votre page de prévente.",
  },
  progress: {
    label: "Progression de la recherche",
    fieldsCount: "{done} / {total} champs essentiels",
    ready: "Recherche prête",
    notReady: "Brouillon",
  },
  sections: {
    product: "Produit",
    customer: "Client",
    problem: "Problème et désir",
    objections: "Objections et preuves",
    campaign: "Campagne",
  },
  customerAudienceHint:
    "L'audience principale (cible) se renseigne dans l'onglet « Informations produit ».",
  fields: {
    brand_name: "Marque",
    product_category: "Catégorie",
    product_price: "Prix",
    offer_details: "Offre",
    customer_age_range: "Tranche d'âge",
    customer_gender: "Genre",
    customer_awareness_level: "Niveau de connaissance du problème",
    main_problem: "Problème principal",
    desired_outcome: "Résultat désiré",
    main_promise: "Promesse principale",
    unique_mechanism: "Mécanisme unique",
    main_objections: "Objections principales",
    competitor_names: "Concurrents",
    proof_points: "Éléments de preuve",
    guarantee_details: "Garantie",
    urgency_details: "Urgence",
    preferred_tone: "Ton",
    call_to_action: "Appel à l'action",
    additional_notes: "Notes complémentaires",
  },
  selectPlaceholder: "Sélectionnez…",
  optional: "facultatif",
  submit: "Enregistrer la recherche",
  submitting: "Enregistrement…",
  saved: "Recherche enregistrée.",
  unsavedWarning:
    "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?",
  errors: {
    invalidOption: "Veuillez choisir une valeur dans la liste.",
    tooLong: "Ce champ est trop long (5000 caractères maximum).",
    notConfigured:
      "La base de données n'est pas encore configurée sur ce déploiement. Réessayez plus tard.",
    notFound: "Ce projet est introuvable ou vous n'y avez pas accès.",
    saveFailed:
      "L'enregistrement a échoué. Veuillez réessayer dans un instant.",
  },
});

// Note: "Audience principale" has no column on project_research — it is the
// project's `target_audience` (Informations produit). The research customer
// section links to it via `customerAudienceHint` rather than duplicating it.
