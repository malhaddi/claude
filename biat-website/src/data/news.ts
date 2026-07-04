export interface NewsItem {
  tag: string
  date: string
  title: string
  excerpt: string
}

export const news: NewsItem[] = [
  {
    tag: 'Innovation',
    date: '28 juin 2026',
    title: 'MyBIAT 4.0 : le paiement mobile arrive pour tous nos clients',
    excerpt:
      'Payez avec votre téléphone chez plus de 40 000 commerçants en Tunisie. Une première nationale, sécurisée par la tokenisation.',
  },
  {
    tag: 'Engagement',
    date: '15 juin 2026',
    title: 'La Fondation BIAT lance 120 bourses d’excellence pour les régions',
    excerpt:
      'Un programme inédit pour accompagner les meilleurs bacheliers des gouvernorats de l’intérieur vers les grandes écoles.',
  },
  {
    tag: 'Entreprises',
    date: '2 juin 2026',
    title: '500 M DT pour financer la transition énergétique des PME',
    excerpt:
      'Une enveloppe dédiée aux projets solaires, à l’efficacité énergétique et à la modernisation industrielle.',
  },
]

export const stats = [
  { value: '1er', label: 'groupe bancaire privé en Tunisie' },
  { value: '205', label: 'agences dans les 24 gouvernorats' },
  { value: '+1M', label: 'de clients qui nous font confiance' },
  { value: '48', label: 'ans à vos côtés, depuis 1976' },
]
