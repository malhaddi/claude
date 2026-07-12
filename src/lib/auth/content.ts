import { z } from "zod";

/**
 * All customer-facing French copy for the authentication flow, validated at
 * module load (consistent with src/lib/content.ts for the marketing site).
 * Keeping it here co-locates auth copy with auth logic; validation messages
 * and the Supabase-error French mapping both read from this single source.
 */

const nonEmpty = z.string().min(1);

const authContentSchema = z.object({
  shared: z.object({
    emailLabel: nonEmpty,
    emailPlaceholder: nonEmpty,
    passwordLabel: nonEmpty,
    showPassword: nonEmpty,
    hidePassword: nonEmpty,
    orSeparator: nonEmpty,
    backHome: nonEmpty,
  }),
  login: z.object({
    title: nonEmpty,
    subtitle: nonEmpty,
    submit: nonEmpty,
    submitting: nonEmpty,
    noAccount: nonEmpty,
    noAccountCta: nonEmpty,
  }),
  register: z.object({
    title: nonEmpty,
    subtitle: nonEmpty,
    confirmLabel: nonEmpty,
    passwordHint: nonEmpty,
    submit: nonEmpty,
    submitting: nonEmpty,
    hasAccount: nonEmpty,
    hasAccountCta: nonEmpty,
    // Neutral post-signup notice (enumeration-safe — same for new or existing).
    noticeTitle: nonEmpty,
    noticeBody: nonEmpty,
    noticeSignIn: nonEmpty,
    resendCta: nonEmpty,
    resendDone: nonEmpty,
  }),
  validation: z.object({
    emailRequired: nonEmpty,
    emailInvalid: nonEmpty,
    passwordRequired: nonEmpty,
    passwordMin: nonEmpty,
    passwordUppercase: nonEmpty,
    passwordLowercase: nonEmpty,
    passwordNumber: nonEmpty,
    confirmRequired: nonEmpty,
    confirmMismatch: nonEmpty,
  }),
  errors: z.object({
    invalidCredentials: nonEmpty,
    emailNotConfirmed: nonEmpty,
    weakPassword: nonEmpty,
    rateLimited: nonEmpty,
    notConfigured: nonEmpty,
    generic: nonEmpty,
  }),
  // Banners shown on /connexion based on a ?status= indicator.
  notices: z.object({
    emailNotConfirmed: nonEmpty,
    confirmationInvalid: nonEmpty,
  }),
  dashboard: z.object({
    title: nonEmpty,
    signedInAs: nonEmpty,
    signOut: nonEmpty,
    emptyTitle: nonEmpty,
    emptyBody: nonEmpty,
    nextMilestone: nonEmpty,
    backHome: nonEmpty,
  }),
});

export type AuthContent = z.infer<typeof authContentSchema>;

export const authContent = authContentSchema.parse({
  shared: {
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.fr",
    passwordLabel: "Mot de passe",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    orSeparator: "ou",
    backHome: "Retour à l'accueil",
  },
  login: {
    title: "Connexion",
    subtitle: "Connectez-vous à votre espace Publy.",
    submit: "Se connecter",
    submitting: "Connexion…",
    noAccount: "Pas encore de compte ?",
    noAccountCta: "Créer un compte",
  },
  register: {
    title: "Créer un compte",
    subtitle: "Commencez gratuitement, sans carte bancaire.",
    confirmLabel: "Confirmer le mot de passe",
    passwordHint:
      "Au moins 8 caractères, avec une majuscule, une minuscule et un chiffre.",
    submit: "Créer mon compte",
    submitting: "Création…",
    hasAccount: "Vous avez déjà un compte ?",
    hasAccountCta: "Se connecter",
    noticeTitle: "Vérifiez votre boîte mail",
    noticeBody:
      "Si cette adresse peut être utilisée, vous recevrez un e-mail contenant les prochaines étapes. Cliquez sur le lien qu'il contient pour activer votre compte, puis connectez-vous.",
    noticeSignIn: "Se connecter",
    resendCta: "Renvoyer l'e-mail de confirmation",
    resendDone:
      "Si l'adresse est valide, un nouvel e-mail de confirmation a été envoyé.",
  },
  validation: {
    emailRequired: "Veuillez saisir votre adresse e-mail.",
    emailInvalid: "Cette adresse e-mail n'est pas valide.",
    passwordRequired: "Veuillez saisir un mot de passe.",
    passwordMin: "Le mot de passe doit contenir au moins 8 caractères.",
    passwordUppercase: "Le mot de passe doit contenir au moins une majuscule.",
    passwordLowercase: "Le mot de passe doit contenir au moins une minuscule.",
    passwordNumber: "Le mot de passe doit contenir au moins un chiffre.",
    confirmRequired: "Veuillez confirmer votre mot de passe.",
    confirmMismatch: "Les deux mots de passe ne correspondent pas.",
  },
  errors: {
    invalidCredentials: "E-mail ou mot de passe incorrect.",
    emailNotConfirmed:
      "Confirmez votre adresse e-mail avant de vous connecter.",
    weakPassword:
      "Ce mot de passe ne respecte pas les règles requises (8 caractères, majuscule, minuscule, chiffre).",
    rateLimited:
      "Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.",
    notConfigured:
      "L'authentification n'est pas encore configurée sur ce déploiement. Réessayez plus tard.",
    generic: "Une erreur est survenue. Veuillez réessayer.",
  },
  notices: {
    emailNotConfirmed:
      "Confirmez votre adresse e-mail avant de vous connecter.",
    confirmationInvalid:
      "Le lien de confirmation est invalide ou a expiré. Veuillez réessayer.",
  },
  dashboard: {
    title: "Tableau de bord",
    signedInAs: "Connecté en tant que",
    signOut: "Se déconnecter",
    emptyTitle: "Votre espace est prêt",
    emptyBody:
      "Vous êtes bien connecté. Votre compte Publy est actif et sécurisé.",
    nextMilestone:
      "La création de projets et la génération d'advertoriaux arriveront dans la prochaine étape. Cette page est volontairement un espace vide pour l'instant.",
    backHome: "Retour à l'accueil",
  },
});
