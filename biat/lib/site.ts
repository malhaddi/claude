/** Central content model for the BIAT site (French-first, matching the
 *  real brand: segments, product names, key figures, awards). */

export const SITE = {
  name: "BIAT",
  fullName: "Banque Internationale Arabe de Tunisie",
  slogan: "Engagés avec vous",
  phone: "(+216) 71 131 000",
  phoneIntl: "(+216) 31 311 818",
  address: "70-72, Avenue Habib Bourguiba, 1080 Tunis, Tunisie",
  facebook: "https://www.facebook.com/BanqueInternationaleArabedeTunisie/",
  linkedin: "https://www.linkedin.com/company/biat",
};

export const STATS = [
  { value: 1976, label: "Année de création", suffix: "", isYear: true },
  { value: 205, label: "Agences partout en Tunisie", suffix: "+" },
  { value: 26.3, label: "Milliards DT de total bilan", suffix: " Mds", decimals: 1 },
  { value: 2000, label: "Collaborateurs engagés", suffix: "+" },
];

export const AWARDS = [
  { title: "Best Bank in Tunisia", by: "Euromoney", year: "2024" },
  { title: "Best Bank in Tunisia", by: "Euromoney", year: "2023" },
  { title: "Best Innovation in Retail Banking", by: "International Banker", year: "2023" },
  { title: "Outstanding Contribution to Youth Development", by: "CFI.co", year: "2024" },
];

export type NavColumn = {
  title: string;
  links: { label: string; desc: string; href: string; icon: string }[];
};

export const NAV: { label: string; href: string; columns?: NavColumn[] }[] = [
  {
    label: "Particuliers",
    href: "/particuliers",
    columns: [
      {
        title: "Au quotidien",
        links: [
          { label: "Comptes & Packs", desc: "Compte courant, Pack FIRST", href: "/particuliers#comptes", icon: "🏦" },
          { label: "Cartes bancaires", desc: "De la CASH à la VISA Infinite", href: "/cartes", icon: "💳" },
          { label: "MyBIAT", desc: "Votre banque dans votre poche", href: "/#mybiat", icon: "📱" },
        ],
      },
      {
        title: "Vos projets",
        links: [
          { label: "Crédits", desc: "BIATIMMO, CREDIAUTO, CREDIMEDIA", href: "/particuliers#credits", icon: "🔑" },
          { label: "Épargne & Placements", desc: "Épargne WLEDNA, CEA, comptes à terme", href: "/particuliers#epargne", icon: "🌱" },
          { label: "Bancassurance", desc: "Protégez ce qui compte", href: "/particuliers#assurance", icon: "🛡️" },
        ],
      },
      {
        title: "Pour vous",
        links: [
          { label: "Jeunes & Étudiants", desc: "Carte CHABEB 13–25 ans", href: "/particuliers#jeunes", icon: "🎓" },
          { label: "Tunisiens à l'étranger", desc: "Offre TRE dédiée", href: "/particuliers#tre", icon: "🌍" },
          { label: "Simulateurs", desc: "Calculez votre crédit en 30 s", href: "/simulateurs", icon: "🧮" },
        ],
      },
    ],
  },
  {
    label: "Entreprises",
    href: "/entreprises",
    columns: [
      {
        title: "Gérer",
        links: [
          { label: "Comptes & Cash Management", desc: "Pilotez votre trésorerie", href: "/entreprises#cash", icon: "📊" },
          { label: "MyBIAT Corporate", desc: "Portail web + validation mobile", href: "/entreprises#corporate", icon: "🖥️" },
          { label: "Cartes Affaires", desc: "Maîtrisez les dépenses pro", href: "/entreprises#cartes", icon: "💼" },
        ],
      },
      {
        title: "Financer",
        links: [
          { label: "Crédits d'investissement", desc: "CREDIMMO Pro et solutions dédiées", href: "/entreprises#financement", icon: "🏗️" },
          { label: "Commerce international", desc: "Trade finance, change, crédits doc.", href: "/entreprises#international", icon: "🚢" },
          { label: "Marché des capitaux", desc: "Tunisie Valeurs, BIAT Capital Risque", href: "/entreprises#capitaux", icon: "📈" },
        ],
      },
    ],
  },
  { label: "Cartes", href: "/cartes" },
  { label: "Simulateurs", href: "/simulateurs" },
  { label: "Agences", href: "/agences" },
];

export type CardTier = {
  id: string;
  name: string;
  variant: "classic" | "gold" | "platinum" | "elite" | "jeune";
  price: string;
  audience: string;
  features: string[];
  highlight?: boolean;
  plafond: string;
};

export const CARD_TIERS: CardTier[] = [
  {
    id: "chabeb",
    name: "Carte CHABEB",
    variant: "jeune",
    price: "Gratuite",
    audience: "Jeunes 13–25 ans",
    plafond: "500 DT / semaine",
    features: [
      "0 DT de frais de tenue de compte",
      "Retraits gratuits aux GAB BIAT",
      "Paiement mobile & en ligne",
      "Rechargeable par les parents en 1 clic",
    ],
  },
  {
    id: "classique",
    name: "VISA / Mastercard Classique",
    variant: "classic",
    price: "30 DT / an",
    audience: "Le quotidien, en Tunisie et à l'international",
    plafond: "2 000 DT / semaine",
    features: [
      "Nationale ou internationale",
      "Sans contact & 3-D Secure",
      "Blocage instantané depuis MyBIAT",
      "Assistance carte 24/7",
    ],
  },
  {
    id: "platinum",
    name: "Mastercard Platinum",
    variant: "platinum",
    price: "180 DT / an",
    audience: "Voyageurs et clients premium",
    plafond: "8 000 DT / semaine",
    highlight: true,
    features: [
      "Plafonds majorés en devises (AVA)",
      "Assurance voyage & achats incluse",
      "Accès salons d'aéroport",
      "Conseiller dédié Espace Patrimoine",
    ],
  },
  {
    id: "infinite",
    name: "VISA Infinite",
    variant: "elite",
    price: "Sur invitation",
    audience: "Banque privée",
    plafond: "Sur mesure",
    features: [
      "Plafonds personnalisés",
      "Conciergerie internationale 24/7",
      "LoungeKey illimité",
      "Assurances premium famille",
    ],
  },
];

export const NEWS = [
  {
    tag: "Innovation",
    date: "Juin 2026",
    title: "MyBIAT franchit le cap du million d'utilisateurs",
    desc: "Virements instantanés, paiement de factures et gestion de cartes : l'app la mieux notée du secteur bancaire tunisien.",
  },
  {
    tag: "Distinction",
    date: "Mai 2026",
    title: "BIAT élue « Best Bank in Tunisia » par Euromoney",
    desc: "Une reconnaissance internationale qui salue la solidité et l'innovation de la première banque du pays.",
  },
  {
    tag: "Engagement",
    date: "Avril 2026",
    title: "La Fondation BIAT lance sa 10ᵉ promotion d'entrepreneurs",
    desc: "Éducation, culture et entrepreneuriat : 10 ans d'engagement pour la jeunesse tunisienne.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Syrine B.",
    role: "Architecte, Tunis",
    text: "J'ai ouvert mon compte en ligne un dimanche soir, ma carte est arrivée le mercredi. L'app MyBIAT est d'une fluidité incroyable.",
    rating: 5,
  },
  {
    name: "Mehdi K.",
    role: "Fondateur de start-up, Sfax",
    text: "MyBIAT Corporate a changé notre quotidien : double validation des virements, habilitations par profil… on gagne des heures chaque semaine.",
    rating: 5,
  },
  {
    name: "Leïla T.",
    role: "Enseignante, Sousse",
    text: "Le simulateur m'a donné ma mensualité BIATIMMO en 30 secondes, et mon conseiller avait déjà le dossier au rendez-vous. Efficace.",
    rating: 5,
  },
];
