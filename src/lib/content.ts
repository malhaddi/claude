import { z } from "zod";

import {
  capabilitySchema,
  comparisonApproachSchema,
  comparisonRowSchema,
  ctaSchema,
  differentiatorSchema,
  faqItemSchema,
  finalCtaSchema,
  footerGroupSchema,
  heroSchema,
  navLinkSchema,
  pricingPlanSchema,
  problemSchema,
  templateSchema,
  workflowStepSchema,
} from "./content-schema";

/**
 * All customer-facing marketing copy for the site, in French.
 * Code, keys and comments stay in English (see DECISIONS.md).
 * Every export is parsed against its schema at module load.
 *
 * Honesty rules enforced by convention and tests:
 * - No guaranteed conversions, ROAS, CAC or revenue claims.
 * - No invented testimonials, logos, customer counts or performance data.
 * - Planned features are clearly labelled "Bientôt" / "soon".
 */

export const siteName = "AdvertoAI";

export const siteTagline =
  "Transformez votre produit en advertorial français prêt à convertir.";

export const siteDescription =
  "AdvertoAI transforme votre URL produit en advertorial français : structuration de l'angle, rédaction de la page et préparation pour votre trafic Meta et TikTok. Pensé pour les marques Shopify et DTC francophones.";

// Section anchors shown in the navigation.
export const navLinks = z.array(navLinkSchema).min(1).parse([
  { href: "#produit", label: "Produit" },
  { href: "#modeles", label: "Modèles" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
]);

// Auth / conversion CTAs in the navigation. Both point to the placeholder
// app for now (no auth implemented yet).
export const navCtas = z
  .object({ login: ctaSchema, signup: ctaSchema })
  .parse({
    login: { label: "Connexion", href: "/dashboard" },
    signup: { label: "Commencer gratuitement", href: "/dashboard" },
  });

export const hero = heroSchema.parse({
  badge: "Advertoriaux français pour Shopify & DTC",
  headline: siteTagline,
  promise:
    "Collez votre URL produit. AdvertoAI structure votre angle, rédige votre page en français et la prépare pour votre trafic Meta et TikTok.",
  primaryCta: { label: "Créer mon premier advertorial", href: "/dashboard" },
  secondaryCta: { label: "Voir comment ça fonctionne", href: "#produit" },
  noCardNote: "Aucune carte bancaire requise",
  previewLabel: "Démonstration produit",
});

export const problemIntro =
  "Envoyer un trafic Meta ou TikTok froid directement vers une fiche produit classique laisse souvent des ventes sur la table. Voici pourquoi.";

export const problems = z.array(problemSchema).min(3).parse([
  {
    title: "Rupture entre la pub et la page",
    description:
      "La promesse de votre publicité et le message de votre fiche produit ne coïncident pas toujours. Le visiteur arrive, ne retrouve pas l'angle qui l'a fait cliquer, et repart.",
  },
  {
    title: "Objections non levées",
    description:
      "Une fiche produit liste des caractéristiques. Elle répond rarement aux doutes concrets — prix, livraison, efficacité, comparaison — qui bloquent un acheteur qui découvre la marque.",
  },
  {
    title: "Bénéfices sortis de leur contexte",
    description:
      "Un trafic froid ne connaît ni votre marque ni votre produit. Sans mise en situation, les bénéfices restent abstraits et ne créent pas l'envie d'acheter.",
  },
  {
    title: "Page non pensée pour un angle de campagne",
    description:
      "Une même fiche produit sert toutes les audiences. Elle n'est pas construite autour de l'angle précis d'une campagne, alors que c'est cet angle qui a généré le clic.",
  },
]);

export const workflowIntro =
  "De l'URL produit à la page prête à publier, un parcours en quatre étapes.";

export const workflowSteps = z.array(workflowStepSchema).length(4).parse([
  {
    id: "url",
    label: "Étape 1",
    title: "Collez votre URL",
    description:
      "Partez de votre fiche produit existante et de quelques informations clés : promesse, audience, offre.",
  },
  {
    id: "angle",
    label: "Étape 2",
    title: "Choisissez un angle",
    description:
      "Sélectionnez le cadre d'advertorial adapté à votre campagne et à l'étape du funnel que vous visez.",
  },
  {
    id: "generate",
    label: "Étape 3",
    title: "Générez la page",
    description:
      "AdvertoAI rédige un advertorial structuré en français, pensé pour le marché francophone — pas une traduction.",
  },
  {
    id: "publish",
    label: "Étape 4",
    title: "Modifiez et publiez",
    description:
      "Ajustez chaque section dans l'éditeur, configurez votre CTA et votre Pixel, puis publiez une page hébergée.",
  },
]);

export const templates = z.array(templateSchema).min(5).parse([
  {
    id: "listicle",
    name: "« 5 raisons de… »",
    bestFor: "Offres à bénéfices multiples et produits tendance.",
    funnelStage: "Trafic froid",
    structure: [
      "Accroche chiffrée qui promet une liste",
      "Une raison par bénéfice, preuve à l'appui",
      "Levée d'objections intercalée",
      "Appel à l'action vers l'offre",
    ],
    availability: "launch",
  },
  {
    id: "tested",
    name: "« J'ai testé… »",
    bestFor: "Produits du quotidien qui gagnent à être racontés.",
    funnelStage: "Trafic froid à tiède",
    structure: [
      "Situation de départ et problème vécu",
      "Découverte du produit à la première personne",
      "Résultat concret après utilisation",
      "Recommandation et appel à l'action",
    ],
    availability: "launch",
  },
  {
    id: "pas",
    name: "Problème → agitation → solution",
    bestFor: "Produits qui résolvent une douleur bien identifiée.",
    funnelStage: "Trafic froid",
    structure: [
      "Nommer le problème du lecteur",
      "Agiter les conséquences concrètes",
      "Présenter le produit comme la solution",
      "Rassurer puis appeler à l'action",
    ],
    availability: "launch",
  },
  {
    id: "comparison",
    name: "Comparatif",
    bestFor: "Produits techniques ou à panier élevé.",
    funnelStage: "Trafic tiède",
    structure: [
      "Critères de choix expliqués",
      "Mise en regard des options",
      "Points forts et limites honnêtes",
      "Verdict et appel à l'action",
    ],
    availability: "soon",
  },
  {
    id: "buying-guide",
    name: "Guide d'achat",
    bestFor: "Catégories où l'acheteur hésite entre plusieurs modèles.",
    funnelStage: "Trafic tiède à chaud",
    structure: [
      "Ce qu'il faut savoir avant d'acheter",
      "Les erreurs fréquentes à éviter",
      "Comment bien choisir selon son besoin",
      "Recommandation et appel à l'action",
    ],
    availability: "soon",
  },
]);

export const launchCapabilities = z.array(capabilitySchema).min(3).parse([
  { label: "Structure de copy nativement française", availability: "launch" },
  { label: "Mises en page mobile-first", availability: "launch" },
  { label: "Édition structurée par sections", availability: "launch" },
  { label: "Configuration du bouton d'action (CTA)", availability: "launch" },
  { label: "Configuration du Pixel Meta", availability: "launch" },
  { label: "Page advertorial hébergée", availability: "launch" },
]);

export const plannedCapabilities = z.array(capabilitySchema).min(3).parse([
  { label: "Variantes A/B", availability: "soon" },
  { label: "Analytics de conversion", availability: "soon" },
  { label: "Gestion de plusieurs marques", availability: "soon" },
  { label: "Marchés francophones supplémentaires", availability: "soon" },
]);

export const differentiators = z.array(differentiatorSchema).min(4).parse([
  {
    title: "Un français rédigé, pas traduit",
    description:
      "Les textes sont pensés directement en français, avec les tournures et le rythme attendus par un lecteur francophone — pas une traduction littérale de l'anglais.",
  },
  {
    title: "Le vocabulaire e-commerce français",
    description:
      "Livraison, retours, paiement, garanties : les termes utilisés sont ceux du e-commerce français, ceux que vos clients reconnaissent.",
  },
  {
    title: "Des objections et un ton de confiance localisés",
    description:
      "Les doutes d'un acheteur francophone et les formulations qui rassurent lui sont propres. AdvertoAI les adresse avec les bons mots.",
  },
  {
    title: "Une présentation d'offre en euros",
    description:
      "Prix, promotions et formats d'offre sont présentés en euros et selon les habitudes du marché francophone.",
  },
  {
    title: "Un onboarding en français",
    description:
      "L'interface et l'accompagnement sont en français, pour une prise en main sans friction de langue.",
  },
  {
    title: "Un tracking pensé RGPD",
    description:
      "La configuration du suivi est conçue en gardant le RGPD à l'esprit. AdvertoAI ne fournit pas de certification de conformité : la responsabilité juridique reste la vôtre.",
  },
]);

// Whole-euro monthly prices; 0 means free. Growth is not yet available, so
// its CTA is a disabled waitlist (href null) — no checkout is implemented.
export const pricingPlans = z.array(pricingPlanSchema).length(3).parse([
  {
    id: "discovery",
    name: "Découverte",
    priceMonthlyEur: 0,
    tagline: "Pour tester AdvertoAI sans engagement.",
    features: [
      "1 brouillon d'advertorial",
      "Aperçu de la page",
      "Marque AdvertoAI affichée",
    ],
    badge: null,
    cta: { label: "Essayer gratuitement", href: "/dashboard" },
    recommended: false,
    available: true,
  },
  {
    id: "launcher",
    name: "Lanceur",
    priceMonthlyEur: 39,
    tagline: "Pour lancer vos campagnes avec de vraies pages de pré-vente.",
    features: [
      "10 générations IA par mois",
      "Jusqu'à 5 advertoriaux publiés",
      "Cadres français initiaux",
      "Édition du texte et des images",
      "Configuration du Pixel Meta",
      "Aperçu mobile",
      "Marque AdvertoAI retirée",
    ],
    badge: "Recommandé",
    cta: { label: "Commencer avec Lanceur", href: "/dashboard" },
    recommended: true,
    available: true,
  },
  {
    id: "growth",
    name: "Croissance",
    priceMonthlyEur: 79,
    tagline: "Pour passer à l'échelle sur plusieurs marques et campagnes.",
    features: [
      "Plus de générations IA",
      "Plus de pages publiées",
      "Gestion de plusieurs marques",
      "Duplication de page",
      "Analytics de conversion de base",
      "Variantes A/B",
    ],
    badge: "Bientôt disponible",
    cta: { label: "Rejoindre la liste d'attente", href: null },
    recommended: false,
    available: false,
  },
]);

export const pricingNote = "Sans engagement. Résiliable à tout moment.";

// Monthly/annual toggle is a PREVIEW only — no billing is implemented and
// the annual figure is exactly 12× the monthly price (no discount claimed).
export const pricingBillingPreviewNote =
  "Aperçu — la facturation en ligne sera activée au lancement. Le tarif annuel correspond à douze mois, sans réduction affichée.";

export const comparisonApproaches = z
  .array(comparisonApproachSchema)
  .length(4)
  .parse([
    { id: "generic-ai", label: "Chat IA générique", highlight: false },
    { id: "page-builder", label: "Constructeur de page", highlight: false },
    { id: "agency", label: "Freelance / agence", highlight: false },
    { id: "advertoai", label: "AdvertoAI", highlight: true },
  ]);

export const comparisonRows = z.array(comparisonRowSchema).min(6).parse([
  {
    dimension: "Stratégie nativement française",
    values: {
      "generic-ai": "Variable",
      "page-builder": "À votre charge",
      agency: "Selon le prestataire",
      advertoai: "Au cœur du produit",
    },
  },
  {
    dimension: "Cadres d'advertorial",
    values: {
      "generic-ai": "À décrire vous-même",
      "page-builder": "Non fournis",
      agency: "Selon le prestataire",
      advertoai: "Intégrés",
    },
  },
  {
    dimension: "Vitesse de génération",
    values: {
      "generic-ai": "Rapide mais brut",
      "page-builder": "Manuelle",
      agency: "Jours à semaines",
      advertoai: "Rapide et structurée",
    },
  },
  {
    dimension: "Publication hébergée",
    values: {
      "generic-ai": "Non",
      "page-builder": "Oui",
      agency: "Selon le prestataire",
      advertoai: "Incluse",
    },
  },
  {
    dimension: "Édition",
    values: {
      "generic-ai": "Copier-coller",
      "page-builder": "Par blocs",
      agency: "Aller-retours",
      advertoai: "Par sections",
    },
  },
  {
    dimension: "Focalisation sur l'angle de campagne",
    values: {
      "generic-ai": "Si vous la guidez",
      "page-builder": "À votre charge",
      agency: "Selon le brief",
      advertoai: "Par conception",
    },
  },
  {
    dimension: "Configuration du tracking",
    values: {
      "generic-ai": "Non",
      "page-builder": "Selon l'outil",
      agency: "Selon le prestataire",
      advertoai: "Pixel Meta intégré",
    },
  },
  {
    dimension: "Coût de départ",
    values: {
      "generic-ai": "Faible",
      "page-builder": "Abonnement",
      agency: "Élevé",
      advertoai: "Offre gratuite pour démarrer",
    },
  },
]);

export const faqItems = z.array(faqItemSchema).min(9).parse([
  {
    question: "Qu'est-ce qu'un advertorial ?",
    answer:
      "Un advertorial est une page de pré-vente qui présente votre produit sous la forme d'un article : une accroche, une histoire ou des arguments, des preuves, puis un appel à l'action. Placé entre votre publicité et votre fiche produit, il prépare le visiteur à l'achat au lieu de l'envoyer directement sur une page de vente.",
  },
  {
    question: "Est-ce réservé à Shopify ?",
    answer:
      "Non. AdvertoAI est pensé en priorité pour les marques Shopify et DTC, mais la page advertorial est hébergée par nos soins : vous pouvez y envoyer votre trafic quelle que soit la plateforme de votre boutique, puis rediriger vers votre fiche produit.",
  },
  {
    question: "Puis-je modifier le texte ?",
    answer:
      "Oui. La génération fournit un premier jet structuré selon le cadre choisi ; vous modifiez ensuite chaque section — accroche, corps, arguments, appel à l'action — ainsi que les images, avant de publier.",
  },
  {
    question: "Les pages sont-elles adaptées au mobile ?",
    answer:
      "Oui. Les mises en page sont mobile-first, car l'essentiel du trafic Meta et TikTok se consulte sur mobile. Un aperçu mobile vous permet de vérifier le rendu avant publication.",
  },
  {
    question: "Puis-je ajouter mon Pixel Meta ?",
    answer:
      "Oui. La configuration du Pixel Meta est prévue dès le lancement, afin que vous puissiez mesurer et optimiser vos campagnes depuis votre propre compte publicitaire.",
  },
  {
    question: "Est-ce que l'outil garantit de meilleures conversions ?",
    answer:
      "Non. Aucun outil ne peut garantir vos conversions. AdvertoAI vous fait gagner du temps et structure vos pages selon des cadres éprouvés, mais vos résultats dépendent de votre produit, de votre offre, de votre trafic et de votre marché.",
  },
  {
    question: "Où la page sera-t-elle publiée ?",
    answer:
      "Votre advertorial devient une page publique hébergée par AdvertoAI, accessible via une URL dédiée. Vous y dirigez votre trafic publicitaire, sans toucher au code ni au thème de votre boutique.",
  },
  {
    question: "Puis-je annuler mon abonnement ?",
    answer:
      "Oui, à tout moment et sans engagement. Le paiement en ligne sera activé au lancement ; d'ici là, vous pouvez tester l'offre Découverte gratuitement.",
  },
  {
    question: "Le plan Croissance est-il disponible ?",
    answer:
      "Pas encore. Le plan Croissance — plusieurs marques, duplication de page, analytics et variantes A/B — est en préparation et signalé « Bientôt disponible ». Vous pouvez rejoindre la liste d'attente ; aucun paiement n'est demandé aujourd'hui.",
  },
]);

export const finalCta = finalCtaSchema.parse({
  title:
    "Votre prochaine campagne mérite mieux qu'une fiche produit générique.",
  description:
    "Créez votre premier advertorial français et préparez une vraie page de pré-vente pour votre trafic Meta et TikTok.",
  cta: { label: "Créer mon premier advertorial", href: "/dashboard" },
});

export const footerGroups = z.array(footerGroupSchema).min(2).parse([
  {
    title: "Produit",
    links: [
      { href: "#produit", label: "Produit" },
      { href: "#modeles", label: "Modèles" },
      { href: "#tarifs", label: "Tarifs" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/dashboard", label: "Commencer gratuitement" },
      { href: "/dashboard", label: "Connexion" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/dashboard", label: "Mentions légales" },
      { href: "/dashboard", label: "Politique de confidentialité" },
      { href: "/dashboard", label: "Contact" },
    ],
  },
]);

export const footerLegalNote =
  "Les pages Mentions légales, Politique de confidentialité et Contact seront publiées avant l'ouverture commerciale.";
