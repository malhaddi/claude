# BIAT — Refonte du site web 🏦

Redesign proposé pour **biat.com.tn** (Banque Internationale Arabe de Tunisie), inspiré des
meilleures banques et fintechs au monde — Revolut, Monzo, N26, Wise, BNP Paribas, Chase — et
construit autour de la marque BIAT 2019 : bleu marine, orange « élan », signature
**« Engagés avec vous »**.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — design system complet en variables CSS (`app/globals.css`)
- **API routes** intégrées (le « backend ») — zéro dépendance externe, zéro image binaire :
  toutes les cartes bancaires, le téléphone MyBIAT et le logo sont dessinés en CSS/SVG pur.

## Lancer le site

```bash
cd biat
npm install
npm run dev        # → http://localhost:3000
```

Build de production : `npm run build && npm start`.

## Pages

| Route | Contenu |
|---|---|
| `/` | Hero cinématique, stats animées, produits, app MyBIAT, simulateur, cours de change en direct, sécurité, témoignages, actus + Fondation BIAT |
| `/particuliers` | Comptes & Packs, crédits (BIATIMMO, CREDIAUTO…), épargne (WLEDNA, CEA), bancassurance, Jeunes (CHABEB), TRE |
| `/entreprises` | Cash management, MyBIAT Corporate, financements, commerce international, marché des capitaux |
| `/cartes` | 4 gammes de cartes en rendu 3D interactif + tableau comparatif |
| `/simulateurs` | Simulateur de crédit temps réel (curseurs → mensualité, coût total) |
| `/agences` | Recherche parmi le réseau (filtre région + texte) et prise de rendez-vous |
| `/ouvrir-un-compte` | Onboarding en 3 étapes, « compte en 10 minutes » façon néobanque |

## API (démo)

| Endpoint | Rôle |
|---|---|
| `GET /api/exchange-rates` | Cours de change TND du jour (jitter déterministe par date) |
| `GET /api/simulateur?type=&montant=&duree=` | Calcul d'annuité (mensualité, coût total) |
| `GET /api/agences?q=&region=` | Recherche d'agences |
| `POST /api/contact` | Demande de rendez-vous / rappel (validation + ticket) |
| `POST /api/open-account` | Ouverture de compte (validation CIN 8 chiffres, e-mail, référence) |

## Points de design clés (issus du benchmark)

- **Hero sombre** à la Revolut : titre géant, un CTA orange, rendus 3D de cartes qui suivent le
  pointeur, QR code MyBIAT (pattern de conversion n°1 des néobanques).
- **Barre utilitaire française** : Trouver une agence · Prendre rendez-vous · téléphone —
  comme BNP/SG/Crédit Agricole.
- **Mega-menu** par « jobs-to-be-done » avec segments Particuliers / Entreprises / Jeunes / TRE.
- **Grille de cartes à niveaux** (CHABEB → Infinite) + tableau comparatif, à la Revolut
  Standard/Premium/Metal.
- **Simulateur en direct** avec mention légale « Un crédit vous engage… » (standard FR).
- **Convertisseur de devises** dans la page façon Wise.
- **Preuves de confiance** : chiffres clés animés (1976, 205+ agences, 26,3 Mds DT), prix
  Euromoney, notes app, bande sécurité (3-D Secure, verrouillage carte, BCT).

> ⚠️ Maquette de démonstration : taux, tarifs et données d'agences sont indicatifs.
