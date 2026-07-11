import { z } from "zod";

/**
 * French copy for the projects feature, validated at module load (consistent
 * with the marketing and auth content modules).
 */

const nonEmpty = z.string().min(1);

const projectsContentSchema = z.object({
  dashboard: z.object({
    welcome: nonEmpty,
    signedInAs: nonEmpty,
    signOut: nonEmpty,
    newProject: nonEmpty,
    projectsTitle: nonEmpty,
    emptyTitle: nonEmpty,
    emptyBody: nonEmpty,
    emptyCta: nonEmpty,
    createdOn: nonEmpty,
    open: nonEmpty,
    backHome: nonEmpty,
    nextMilestone: nonEmpty,
  }),
  status: z.object({
    draft: nonEmpty,
    unknown: nonEmpty,
  }),
  form: z.object({
    newTitle: nonEmpty,
    newSubtitle: nonEmpty,
    editTitle: nonEmpty,
    editSubtitle: nonEmpty,
    backToProjects: nonEmpty,
    sectionProject: nonEmpty,
    sectionProduct: nonEmpty,
    sectionCampaign: nonEmpty,
    nameLabel: nonEmpty,
    namePlaceholder: nonEmpty,
    productUrlLabel: nonEmpty,
    productTitleLabel: nonEmpty,
    productDescriptionLabel: nonEmpty,
    productBenefitsLabel: nonEmpty,
    targetAudienceLabel: nonEmpty,
    offerLabel: nonEmpty,
    productImageUrlLabel: nonEmpty,
    destinationUrlLabel: nonEmpty,
    optional: nonEmpty,
    urlHint: nonEmpty,
    createSubmit: nonEmpty,
    createSubmitting: nonEmpty,
    saveSubmit: nonEmpty,
    saveSubmitting: nonEmpty,
    saved: nonEmpty,
  }),
  delete: z.object({
    action: nonEmpty,
    confirmQuestion: nonEmpty,
    confirm: nonEmpty,
    cancel: nonEmpty,
    deleting: nonEmpty,
  }),
  validation: z.object({
    nameRequired: nonEmpty,
    nameTooLong: nonEmpty,
    urlInvalid: nonEmpty,
    tooLong: nonEmpty,
  }),
  errors: z.object({
    notConfigured: nonEmpty,
    notFound: nonEmpty,
    saveFailed: nonEmpty,
    deleteFailed: nonEmpty,
    generic: nonEmpty,
  }),
});

export type ProjectsContent = z.infer<typeof projectsContentSchema>;

export const projectsContent = projectsContentSchema.parse({
  dashboard: {
    welcome: "Bonjour",
    signedInAs: "Connecté en tant que",
    signOut: "Se déconnecter",
    newProject: "Nouveau projet",
    projectsTitle: "Vos projets",
    emptyTitle: "Aucun projet pour l'instant",
    emptyBody:
      "Créez votre premier projet pour rassembler les informations de votre produit et préparer votre future page de prévente.",
    emptyCta: "Créer un projet",
    createdOn: "Créé le",
    open: "Ouvrir",
    backHome: "Retour à l'accueil",
    nextMilestone:
      "La génération d'advertoriaux à partir de ces informations arrivera dans une prochaine étape.",
  },
  status: {
    draft: "Brouillon",
    unknown: "Statut inconnu",
  },
  form: {
    newTitle: "Nouveau projet",
    newSubtitle:
      "Renseignez les informations de votre produit. Vous pourrez tout modifier plus tard.",
    editTitle: "Modifier le projet",
    editSubtitle: "Mettez à jour les informations de votre produit.",
    backToProjects: "Retour aux projets",
    sectionProject: "Projet",
    sectionProduct: "Produit",
    sectionCampaign: "Campagne",
    nameLabel: "Nom du projet",
    namePlaceholder: "Ma campagne de rentrée",
    productUrlLabel: "URL du produit",
    productTitleLabel: "Titre du produit",
    productDescriptionLabel: "Description",
    productBenefitsLabel: "Bénéfices principaux",
    targetAudienceLabel: "Audience cible",
    offerLabel: "Offre",
    productImageUrlLabel: "URL de l'image principale",
    destinationUrlLabel: "URL de destination",
    optional: "facultatif",
    urlHint: "Doit commencer par http:// ou https://",
    createSubmit: "Créer le projet",
    createSubmitting: "Création…",
    saveSubmit: "Enregistrer",
    saveSubmitting: "Enregistrement…",
    saved: "Modifications enregistrées.",
  },
  delete: {
    action: "Supprimer",
    confirmQuestion: "Supprimer ce projet ?",
    confirm: "Oui, supprimer",
    cancel: "Annuler",
    deleting: "Suppression…",
  },
  validation: {
    nameRequired: "Veuillez donner un nom à votre projet.",
    nameTooLong: "Le nom est trop long (120 caractères maximum).",
    urlInvalid: "Cette URL n'est pas valide (http:// ou https:// attendu).",
    tooLong: "Ce champ est trop long (5000 caractères maximum).",
  },
  errors: {
    notConfigured:
      "La base de données n'est pas encore configurée sur ce déploiement. Réessayez plus tard.",
    notFound: "Ce projet est introuvable ou vous n'y avez pas accès.",
    saveFailed:
      "L'enregistrement a échoué. Veuillez réessayer dans un instant.",
    deleteFailed: "La suppression a échoué. Veuillez réessayer.",
    generic: "Une erreur est survenue. Veuillez réessayer.",
  },
});
