export interface Branch {
  name: string
  city: string
  region: string
  address: string
  phone: string
  services: string[]
}

export const regions = [
  'Grand Tunis',
  'Nord-Est',
  'Nord-Ouest',
  'Sahel',
  'Centre',
  'Sud',
] as const

export const branches: Branch[] = [
  { name: 'Agence Habib Bourguiba — Siège', city: 'Tunis', region: 'Grand Tunis', address: '70-72, Avenue Habib Bourguiba, 1000 Tunis', phone: '+216 71 340 733', services: ['Change', 'Coffres', 'Banque privée', 'Espace libre-service 24/7'] },
  { name: 'Agence Lac 2', city: 'Tunis', region: 'Grand Tunis', address: 'Rue du Lac de Côme, Les Berges du Lac 2', phone: '+216 71 960 122', services: ['Entreprises', 'Change', 'Espace libre-service 24/7'] },
  { name: 'Agence La Marsa', city: 'La Marsa', region: 'Grand Tunis', address: 'Avenue Habib Bourguiba, La Marsa Plage', phone: '+216 71 749 400', services: ['Change', 'Espace libre-service 24/7'] },
  { name: 'Agence El Menzah 6', city: 'Ariana', region: 'Grand Tunis', address: 'Avenue Hédi Nouira, El Menzah 6', phone: '+216 71 238 511', services: ['Change', 'Coffres'] },
  { name: 'Agence Ennasr', city: 'Ariana', region: 'Grand Tunis', address: 'Avenue Fethi Zouhir, Cité Ennasr 2', phone: '+216 71 822 640', services: ['Espace libre-service 24/7'] },
  { name: 'Agence Nabeul', city: 'Nabeul', region: 'Nord-Est', address: 'Avenue Habib Thameur, 8000 Nabeul', phone: '+216 72 285 300', services: ['Change', 'Coffres'] },
  { name: 'Agence Hammamet', city: 'Hammamet', region: 'Nord-Est', address: 'Avenue de la Libération, 8050 Hammamet', phone: '+216 72 280 144', services: ['Change', 'Espace libre-service 24/7'] },
  { name: 'Agence Bizerte', city: 'Bizerte', region: 'Nord-Est', address: 'Quai Tarak Ibn Zied, 7000 Bizerte', phone: '+216 72 431 055', services: ['Change', 'Entreprises'] },
  { name: 'Agence Béja', city: 'Béja', region: 'Nord-Ouest', address: 'Avenue de France, 9000 Béja', phone: '+216 78 456 211', services: ['Change'] },
  { name: 'Agence Le Kef', city: 'Le Kef', region: 'Nord-Ouest', address: 'Avenue Habib Bourguiba, 7100 Le Kef', phone: '+216 78 224 090', services: ['Change'] },
  { name: 'Agence Sousse Centre', city: 'Sousse', region: 'Sahel', address: 'Avenue Habib Bourguiba, 4000 Sousse', phone: '+216 73 225 611', services: ['Change', 'Coffres', 'Banque privée'] },
  { name: 'Agence Sahloul', city: 'Sousse', region: 'Sahel', address: 'Avenue Yasser Arafat, Sahloul 4054', phone: '+216 73 820 977', services: ['Espace libre-service 24/7'] },
  { name: 'Agence Monastir', city: 'Monastir', region: 'Sahel', address: 'Avenue Habib Bourguiba, 5000 Monastir', phone: '+216 73 461 855', services: ['Change'] },
  { name: 'Agence Mahdia', city: 'Mahdia', region: 'Sahel', address: 'Avenue Habib Bourguiba, 5100 Mahdia', phone: '+216 73 680 300', services: ['Change'] },
  { name: 'Agence Kairouan', city: 'Kairouan', region: 'Centre', address: 'Avenue de la République, 3100 Kairouan', phone: '+216 77 233 422', services: ['Change', 'Coffres'] },
  { name: 'Agence Sfax Jadida', city: 'Sfax', region: 'Centre', address: 'Avenue des Martyrs, Sfax Jadida 3027', phone: '+216 74 402 511', services: ['Entreprises', 'Change', 'Espace libre-service 24/7'] },
  { name: 'Agence Sfax Bab Bhar', city: 'Sfax', region: 'Centre', address: 'Boulevard de la République, 3000 Sfax', phone: '+216 74 229 700', services: ['Change', 'Coffres'] },
  { name: 'Agence Gabès', city: 'Gabès', region: 'Sud', address: 'Avenue Farhat Hached, 6000 Gabès', phone: '+216 75 270 344', services: ['Change'] },
  { name: 'Agence Djerba Houmt Souk', city: 'Djerba', region: 'Sud', address: 'Avenue Habib Bourguiba, Houmt Souk 4180', phone: '+216 75 650 233', services: ['Change', 'Espace libre-service 24/7'] },
  { name: 'Agence Tozeur', city: 'Tozeur', region: 'Sud', address: 'Avenue Abou El Kacem Chebbi, 2200 Tozeur', phone: '+216 76 454 088', services: ['Change'] },
  { name: 'Agence Gafsa', city: 'Gafsa', region: 'Sud', address: 'Avenue Taïeb Mhiri, 2100 Gafsa', phone: '+216 76 224 466', services: ['Change'] },
  { name: 'Agence Médenine', city: 'Médenine', region: 'Sud', address: 'Avenue Habib Bourguiba, 4100 Médenine', phone: '+216 75 640 122', services: ['Change'] },
]
