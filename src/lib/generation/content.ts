import { z } from "zod";

/**
 * French copy for the advertorial-generation feature, validated at module load
 * (consistent with the marketing, auth, projects and research content modules).
 * Components read strings from here — no hardcoded customer-facing text.
 */

const nonEmpty = z.string().min(1);

const generationContentSchema = z.object({
  page: z.object({
    title: nonEmpty,
    subtitle: nonEmpty,
  }),
  gating: z.object({
    title: nonEmpty,
    body: nonEmpty,
    progress: nonEmpty, // "{done} / {total} champs essentiels"
    cta: nonEmpty,
  }),
  form: z.object({
    frameworkLegend: nonEmpty,
    frameworkHint: nonEmpty,
    instructionsLabel: nonEmpty,
    instructionsPlaceholder: nonEmpty,
    instructionsHint: nonEmpty,
    optional: nonEmpty,
    submit: nonEmpty,
    submitting: nonEmpty,
    safetyNote: nonEmpty,
  }),
  result: z.object({
    title: nonEmpty,
    framework: nonEmpty,
    version: nonEmpty,
    createdOn: nonEmpty,
    status: nonEmpty,
    introductionLabel: nonEmpty,
    ctaLabel: nonEmpty,
    disclaimerLabel: nonEmpty,
    fresh: nonEmpty,
  }),
  history: z.object({
    title: nonEmpty,
    empty: nonEmpty,
    version: nonEmpty,
    framework: nonEmpty,
    createdOn: nonEmpty,
    status: nonEmpty,
    open: nonEmpty,
  }),
  detail: z.object({
    back: nonEmpty,
  }),
  status: z.object({
    draft: nonEmpty,
    unknown: nonEmpty,
  }),
  errors: z.object({
    invalidFramework: nonEmpty,
    instructionsTooLong: nonEmpty,
    notConfigured: nonEmpty,
    aiNotConfigured: nonEmpty,
    notFound: nonEmpty,
    researchIncomplete: nonEmpty,
    rateLimited: nonEmpty,
    generationFailed: nonEmpty,
    saveFailed: nonEmpty,
  }),
});

export type GenerationContent = z.infer<typeof generationContentSchema>;

export const generationContent = generationContentSchema.parse({
  page: {
    title: "Génération de l'advertorial",
    subtitle:
      "Choisissez un cadre narratif et générez un brouillon structuré à partir des informations produit et de votre recherche.",
  },
  gating: {
    title: "Terminez d'abord votre recherche",
    body: "La génération se débloque une fois la recherche client complétée à 100 %. Complétez les champs essentiels pour préparer un brouillon pertinent.",
    progress: "{done} / {total} champs essentiels",
    cta: "Compléter la recherche",
  },
  form: {
    frameworkLegend: "Cadre narratif",
    frameworkHint:
      "Le cadre détermine la structure de la page. Vous pourrez générer d'autres versions plus tard.",
    instructionsLabel: "Instructions complémentaires",
    instructionsPlaceholder:
      "Précisez un angle, un détail à mettre en avant, un élément à éviter…",
    instructionsHint:
      "Ces consignes orientent le style et l'angle, sans lever les règles de sécurité.",
    optional: "facultatif",
    submit: "Générer le brouillon",
    submitting: "Génération en cours…",
    safetyNote:
      "Le brouillon s'appuie uniquement sur vos informations : aucune preuve, garantie ni statistique n'est inventée.",
  },
  result: {
    title: "Brouillon généré",
    framework: "Cadre",
    version: "Version",
    createdOn: "Généré le",
    status: "Statut",
    introductionLabel: "Introduction",
    ctaLabel: "Appel à l'action",
    disclaimerLabel: "Mention",
    fresh: "Nouveau brouillon généré à l'instant.",
  },
  history: {
    title: "Historique des générations",
    empty: "Aucun brouillon généré pour l'instant.",
    version: "Version",
    framework: "Cadre",
    createdOn: "Généré le",
    status: "Statut",
    open: "Ouvrir",
  },
  detail: {
    back: "Retour à la génération",
  },
  status: {
    draft: "Brouillon",
    unknown: "Statut inconnu",
  },
  errors: {
    invalidFramework: "Veuillez choisir un cadre narratif dans la liste.",
    instructionsTooLong:
      "Les instructions sont trop longues (2000 caractères maximum).",
    notConfigured:
      "La base de données n'est pas encore configurée sur ce déploiement. Réessayez plus tard.",
    aiNotConfigured:
      "La génération par IA n'est pas encore configurée sur ce déploiement. Réessayez plus tard.",
    notFound: "Ce projet est introuvable ou vous n'y avez pas accès.",
    researchIncomplete:
      "Complétez votre recherche client à 100 % avant de générer un brouillon.",
    rateLimited:
      "Trop de générations en peu de temps. Veuillez patienter quelques instants avant de réessayer.",
    generationFailed:
      "La génération n'a pas abouti cette fois-ci. Veuillez réessayer dans un instant.",
    saveFailed:
      "L'enregistrement du brouillon a échoué. Veuillez réessayer dans un instant.",
  },
});
