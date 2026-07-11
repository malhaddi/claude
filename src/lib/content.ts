import { z } from "zod";

import {
  benefitSchema,
  faqItemSchema,
  navLinkSchema,
  pricingPlanSchema,
  stepSchema,
  templateExampleSchema,
} from "./content-schema";

/**
 * All customer-facing marketing copy for the site, in French.
 * Code, keys and comments stay in English (see DECISIONS.md).
 * Every export is parsed against its schema at module load.
 */

export const siteName = "AdvertoAI";

export const siteTagline =
  "Transformez votre produit en advertorial français prêt à convertir.";

export const siteDescription =
  "AdvertoAI aide les marques Shopify et DTC à transformer leurs informations produit en advertoriaux de pré-vente mobile-first, rédigés en français et prêts à publier.";

export const navLinks = z.array(navLinkSchema).min(1).parse([
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#modeles", label: "Modèles" },
  { href: "#avantages", label: "Avantages" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
]);

export const steps = z.array(stepSchema).length(4).parse([
  {
    title: "Décrivez votre produit",
    description:
      "Ajoutez l'URL de votre fiche produit et quelques informations clés : promesse, bénéfices, audience visée.",
  },
  {
    title: "Choisissez un cadre éditorial",
    description:
      "Sélectionnez l'un des cadres d'advertorial éprouvés : histoire personnelle, liste d'arguments ou test produit.",
  },
  {
    title: "L'IA rédige en français",
    description:
      "AdvertoAI génère un advertorial structuré, pensé pour le marché francophone — pas une simple traduction.",
  },
  {
    title: "Ajustez et publiez",
    description:
      "Retouchez chaque section dans l'éditeur, puis publiez une page publique rapide et optimisée pour le mobile.",
  },
]);

export const templates = z.array(templateExampleSchema).length(3).parse([
  {
    id: "story",
    name: "Histoire personnelle",
    tagline: "Le récit à la première personne",
    hookExample:
      "« Je ne pensais pas qu'un simple accessoire changerait mes matinées — jusqu'à ce que je l'essaie. »",
    description:
      "Un advertorial narratif qui suit le parcours d'un client : le problème, la découverte du produit, le résultat. Le format le plus efficace pour créer une connexion émotionnelle.",
    bestFor: "Produits qui résolvent un problème du quotidien.",
  },
  {
    id: "listicle",
    name: "Liste d'arguments",
    tagline: "Le format « 5 raisons »",
    hookExample:
      "« 5 raisons pour lesquelles ce produit s'arrache en ce moment »",
    description:
      "Une liste scannable qui empile les bénéfices et lève les objections une par une. Parfait pour un trafic froid venu des publicités Meta ou TikTok.",
    bestFor: "Offres à bénéfices multiples et promotions.",
  },
  {
    id: "review",
    name: "Test produit",
    tagline: "Le ton éditorial de l'avis d'expert",
    hookExample:
      "« Nous l'avons testé pendant 30 jours : voici notre verdict »",
    description:
      "Un advertorial façon comparatif : critères de test, points forts, limites honnêtes et verdict final. Rassure les acheteurs qui hésitent encore.",
    bestFor: "Produits techniques ou à panier élevé.",
  },
]);

export const benefits = z.array(benefitSchema).min(4).parse([
  {
    title: "Pensé mobile d'abord",
    description:
      "Chaque page est conçue pour le trafic publicitaire mobile, là où vos visiteurs découvrent réellement votre produit.",
  },
  {
    title: "Un vrai français",
    description:
      "Des textes rédigés directement en français et adaptés aux codes du marché francophone — pas des traductions approximatives.",
  },
  {
    title: "Des cadres éprouvés",
    description:
      "Chaque advertorial suit une structure de pré-vente utilisée de longue date en vente à distance : accroche, histoire, preuves, appel à l'action.",
  },
  {
    title: "De l'idée à la page en quelques minutes",
    description:
      "Partez de votre fiche produit, pas d'une page blanche. L'IA fournit un premier jet complet que vous affinez.",
  },
  {
    title: "Vous gardez la main",
    description:
      "Chaque section reste modifiable : ton, arguments, images, appel à l'action. Rien n'est publié sans votre validation.",
  },
  {
    title: "Publication sans développeur",
    description:
      "Votre advertorial devient une page publique hébergée, sans thème à modifier ni code à toucher sur votre boutique.",
  },
]);

export const foundingOffer = pricingPlanSchema.parse({
  name: "Offre fondateur",
  priceMonthlyEur: 39,
  description:
    "Un tarif de lancement simple, réservé aux premiers inscrits, pour construire le produit avec vous.",
  features: [
    "Génération d'advertoriaux en français par IA",
    "3 cadres éditoriaux : histoire, liste, test produit",
    "Éditeur par sections pour ajuster chaque texte",
    "Pages publiques hébergées, optimisées mobile",
    "Support par e-mail avec le fondateur",
  ],
  note: "Sans engagement, annulable à tout moment. Le paiement en ligne (Stripe) sera activé à l'ouverture publique.",
});

export const faqItems = z.array(faqItemSchema).min(4).parse([
  {
    question: "Qu'est-ce qu'un advertorial ?",
    answer:
      "Un advertorial est une page de pré-vente qui présente votre produit sous la forme d'un article : une histoire, des arguments, des preuves, puis un appel à l'action. Placé entre votre publicité et votre fiche produit, il prépare le visiteur à l'achat au lieu de l'envoyer directement sur une page de vente.",
  },
  {
    question: "À qui s'adresse AdvertoAI ?",
    answer:
      "Aux marques Shopify et DTC qui vendent en français et achètent du trafic (Meta, TikTok, etc.), et qui veulent des pages de pré-vente sans mobiliser un rédacteur ni un développeur.",
  },
  {
    question: "Le contenu généré est-il modifiable ?",
    answer:
      "Oui. L'IA fournit un premier jet structuré selon le cadre choisi ; vous restez libre de modifier chaque section — accroche, histoire, arguments, appel à l'action — avant de publier.",
  },
  {
    question: "Dois-je savoir coder ?",
    answer:
      "Non. Vous renseignez vos informations produit, choisissez un cadre, ajustez le texte et publiez. La page est hébergée pour vous, sans toucher au code de votre boutique.",
  },
  {
    question: "Garantissez-vous des résultats publicitaires ?",
    answer:
      "Non, et méfiez-vous de ceux qui le promettent. AdvertoAI vous fait gagner du temps et structure vos pages selon des cadres éprouvés, mais vos résultats dépendent de votre produit, de votre offre et de vos campagnes.",
  },
  {
    question: "Puis-je annuler mon abonnement ?",
    answer:
      "Oui, à tout moment et sans engagement. Le tarif fondateur de 39 € par mois reste acquis tant que votre abonnement est actif.",
  },
]);
