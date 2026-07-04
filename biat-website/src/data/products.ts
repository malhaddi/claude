export type CardTier = 'essentielle' | 'premium' | 'infinite' | 'jeune'

export interface BankCardProduct {
  id: CardTier
  name: string
  network: string
  tagline: string
  monthlyFee: string
  color: 'navy' | 'black' | 'platinum' | 'coral'
  perks: string[]
  plafond: string
}

export const cards: BankCardProduct[] = [
  {
    id: 'jeune',
    name: 'Carte Jeune',
    network: 'Mastercard',
    tagline: 'Votre première carte, dès 12 ans. Gratuite, sécurisée, pilotée depuis MyBIAT.',
    monthlyFee: '0 DT / mois',
    color: 'coral',
    plafond: '500 DT / semaine',
    perks: [
      'Gratuite jusqu’à 25 ans',
      'Plafonds ajustables par les parents',
      'Paiement mobile & sans contact',
      'Notifications instantanées',
    ],
  },
  {
    id: 'essentielle',
    name: 'Carte Essentielle',
    network: 'Visa',
    tagline: 'L’essentiel du quotidien : payer, retirer, suivre. Simplement.',
    monthlyFee: '3 DT / mois',
    color: 'navy',
    plafond: '2 000 DT / semaine',
    perks: [
      'Paiements en Tunisie et à l’étranger',
      'Verrouillage instantané depuis l’app',
      'Plafonds personnalisables',
      'e-Commerce sécurisé 3-D Secure',
    ],
  },
  {
    id: 'premium',
    name: 'Carte Premium',
    network: 'Visa Platinum',
    tagline: 'Des plafonds élevés, des assurances voyage et un service prioritaire.',
    monthlyFee: '12 DT / mois',
    color: 'platinum',
    plafond: '8 000 DT / semaine',
    perks: [
      'Assurances voyage & achats',
      'Assistance médicale à l’étranger',
      'Conseiller dédié prioritaire',
      'Cashback partenaires jusqu’à 5 %',
    ],
  },
  {
    id: 'infinite',
    name: 'Carte Infinite',
    network: 'Visa Infinite',
    tagline: 'L’excellence sans limite : conciergerie, salons d’aéroport, plafonds sur mesure.',
    monthlyFee: 'Sur invitation',
    color: 'black',
    plafond: 'Sur mesure',
    perks: [
      'Conciergerie 24/7 dans le monde entier',
      'Accès illimité aux salons LoungeKey',
      'Assurances premium famille',
      'Banquier privé dédié',
    ],
  },
]

export interface Pack {
  name: string
  audience: string
  price: string
  highlight?: boolean
  features: string[]
}

export const packs: Pack[] = [
  {
    name: 'Pack Étudiant',
    audience: 'Étudiants & jeunes de 18 à 25 ans',
    price: '0 DT/mois',
    features: [
      'Compte courant sans frais de tenue',
      'Carte Jeune gratuite',
      'MyBIAT + paiement mobile',
      'Virements instantanés gratuits',
    ],
  },
  {
    name: 'Pack Sérénité',
    audience: 'Le quotidien, sans friction',
    price: '9 DT/mois',
    highlight: true,
    features: [
      'Compte courant + Carte Essentielle',
      'Découvert autorisé personnalisé',
      'Assurance moyens de paiement',
      'SMS + notifications en temps réel',
      'Chéquier & virements illimités',
    ],
  },
  {
    name: 'Pack Excellence',
    audience: 'Patrimoine & projets ambitieux',
    price: '25 DT/mois',
    features: [
      'Carte Premium incluse',
      'Conseiller patrimonial dédié',
      'Taux préférentiels sur crédits',
      'Épargne pilotée & placements',
    ],
  },
]

export interface CreditProduct {
  id: string
  name: string
  description: string
  rate: number
  rateLabel: string
  maxMonths: number
  minAmount: number
  maxAmount: number
  defaultAmount: number
  icon: 'home' | 'car' | 'wallet' | 'sprout'
}

export const credits: CreditProduct[] = [
  {
    id: 'immobilier',
    name: 'Crédit Immobilier',
    description: 'Financez l’achat, la construction ou l’aménagement de votre logement jusqu’à 25 ans.',
    rate: 8.2,
    rateLabel: 'à partir de 8,2 % fixe',
    maxMonths: 300,
    minAmount: 20000,
    maxAmount: 1000000,
    defaultAmount: 250000,
    icon: 'home',
  },
  {
    id: 'auto',
    name: 'Crédit Auto',
    description: 'Neuve ou d’occasion, roulez dès aujourd’hui et remboursez jusqu’à 7 ans.',
    rate: 9.1,
    rateLabel: 'à partir de 9,1 %',
    maxMonths: 84,
    minAmount: 5000,
    maxAmount: 200000,
    defaultAmount: 60000,
    icon: 'car',
  },
  {
    id: 'conso',
    name: 'Crédit Consommation',
    description: 'Équipement, travaux, événements de la vie : une réponse de principe en 24 h.',
    rate: 10.5,
    rateLabel: 'à partir de 10,5 %',
    maxMonths: 60,
    minAmount: 1000,
    maxAmount: 50000,
    defaultAmount: 15000,
    icon: 'wallet',
  },
]

export const savingsProducts = [
  {
    name: 'Compte Épargne BIAT',
    rate: 7.0,
    description: 'L’épargne disponible à tout moment, rémunérée au taux du marché monétaire.',
  },
  {
    name: 'Plan Épargne Projet',
    rate: 7.8,
    description: 'Versements programmés pour concrétiser un projet à 2–10 ans, taux bonifié.',
  },
  {
    name: 'Dépôt à Terme',
    rate: 8.5,
    description: 'Bloquez un capital de 3 mois à 5 ans et sécurisez un rendement garanti.',
  },
]
