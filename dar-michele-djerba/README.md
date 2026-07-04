# Dar Michèle Djerba — Site officiel

Site vitrine + réservation directe pour **Dar Michèle Djerba** (maison d'hôtes, Houmt Souk).
**Un seul fichier** (`index.html`), aucun serveur, aucune base de données, aucune dépendance externe :
il se déploie en 30 secondes et ne peut pas être piraté comme un WordPress
(deux concurrents djerbiens — dardhiafa.tn et darbengacem.com — ont leur blog envahi de spam
indexé par Google à cause de CMS non maintenus ; ce site n'a pas cette surface d'attaque).

## Ce que fait le site

- **7 langues avec détection automatique** : français (défaut), anglais, allemand, italien, **polonais** (3ᵉ nationalité à Djerba en 2025, devant les Allemands), **russe** et arabe (avec bascule droite-à-gauche automatique). La langue du navigateur du visiteur est détectée à l'arrivée ; un sélecteur manuel est toujours visible et le choix est mémorisé.
- **Réservation directe via WhatsApp** : le formulaire construit un message pré-rempli (dates, chambre, nom) dans la langue du visiteur et l'envoie sur le WhatsApp de la maison. Zéro commission.
- **Le problème de la garantie, résolu SANS paiement en ligne** : demande WhatsApp → **acompte de 30 % via Western Union ou MoneyGram** (le client l'envoie depuis l'appli/le site WU ou une agence ; la maison retire en dinars, gratuitement, à la Poste ou en banque) → le client transmet le code MTCN sur WhatsApp → confirmation écrite → **solde en espèces à l'arrivée (€ ou DT)**. Aucune carte, aucun virement international, aucun lien de paiement — rien d'illégal, rien à installer : Western Union est un simple transfert d'argent entre personnes, parfaitement légal en réception en Tunisie.
- **Chambres réelles de l'établissement** (mêmes intitulés que Booking) : Chambre Double, Chambre Quadruple, Chambre Quadruple avec Terrasse.
- Preuves sociales renforcées : étoiles par avis, badges Tripadvisor/Booking/Google, mention « séjour vérifié », liens vers les fiches Booking, Tripadvisor et Facebook, 4,5★ / 73 avis Google, 8,3 Booking. Galerie, table & expériences, offre « maison entière », accès/carte, FAQ, SEO (JSON-LD `BedAndBreakfast`).
- **Photos réelles prêtes à l'emploi** : déposez les fichiers dans `photos/` (voir `photos/LISEZMOI.txt`) — chaque photo remplace automatiquement l'illustration correspondante, sans toucher au code.

## Déployer (gratuit)

N'importe quel hébergeur statique. Les plus simples :

1. **Netlify Drop** (drag & drop) : https://app.netlify.com/drop — glisser le dossier, c'est en ligne.
2. **GitHub Pages** : pousser ce dossier, activer Pages.
3. Chez un registrar tunisien/OVH avec le domaine (ex. `darmichele-djerba.com`) : uploader `index.html` par FTP.

Domaine conseillé : `darmichele-djerba.com` (~12 €/an). Ensuite, **ajouter le lien du site sur la fiche Google Business et la page Facebook** — c'est de là que viendront 80 % des visiteurs.

## L'acompte sans paiement en ligne — mode d'emploi pour le propriétaire

Contrainte assumée : **aucun paiement en ligne** (pas de carte, pas de compte à l'étranger, pas de
virement international — la réception de paiements marchands depuis l'étranger pose problème
pour un particulier en Tunisie). La solution : le **transfert d'espèces entre personnes**,
100 % légal en réception.

| Canal | Verdict | Détail |
|---|---|---|
| **Western Union** | ✅ **Recommandé n°1** | Le client envoie depuis l'appli/le site wu.com (avec sa carte, côté client c'est son affaire) ou depuis une agence. **Réception gratuite en dinars** à la Poste Tunisienne, BIAT, BTL… sur présentation de la CIN + code MTCN. Le client paie les frais d'envoi (~4-8 € pour un acompte type). |
| **MoneyGram** | ✅ Plan B | Même principe, agences partout en Europe, réception à la Poste/banques tunisiennes. |
| **Espèces à l'arrivée** | ✅ Pour le solde | € ou DT — zéro frais, zéro intermédiaire. |

**Flux opérationnel (depuis un téléphone) :**
1. Le client envoie sa demande via le site (elle arrive sur WhatsApp, déjà dans sa langue → répondre dans la même langue avec une app de traduction si besoin).
2. Confirmer la dispo + le prix total en €, rappeler la politique : acompte 30 %, report gratuit ou remboursement ≥ 7 j.
3. Envoyer au client : nom complet du bénéficiaire (tel que sur la CIN) + ville (Houmt Souk, Tunisie) — c'est tout ce qu'il faut pour un envoi Western Union. Préciser « chambre en option 48 h ».
4. Le client envoie l'acompte et transmet **le code MTCN + son nom** sur WhatsApp.
5. Vérifier/retirer (Poste ou banque, CIN + MTCN) → envoyer la **confirmation écrite** (récap dates, montant reçu, solde, conditions). Ce message WhatsApp fait office de contrat et de reçu.
6. Solde à l'arrivée en espèces (€ ou DT) + reçu écrit.
7. Annulations : proposer d'abord le **report de dates sans frais (12 mois)** ; rembourser (WU dans l'autre sens) seulement en dernier recours — c'est exactement ce que le site annonce au client.

Coût pour la maison : **0 dinar** (les frais d'envoi sont côté client, la réception est gratuite).
À comparer aux 15-25 % de commission Booking sur la totalité du séjour.

## Personnaliser

Tout est dans `index.html` :

- **Photos** : déposer les fichiers dans `photos/` avec les noms listés dans `photos/LISEZMOI.txt` — ils s'affichent automatiquement (aucune modification de code).
- **Prix** : chercher `data-price` (3 occurrences, valeurs indicatives 45/65/75 € à ajuster).
- **N° WhatsApp / téléphone** : objet `CONFIG` en haut du `<script>` (une seule fois).
- **Politique d'annulation (7 jours)** : chercher `7` dans les clés `gar_2` et `faq2_a` de chaque langue.
- **Textes** : objet `I18N` (7 blocs de langue — fr, en, de, it, pl, ru, ar — mêmes clés partout).

## SEO — note importante

La page est servie **en français dans le HTML** (le plus gros marché de Djerba) : c'est cette version que Google indexe. La traduction côté navigateur est parfaite pour l'expérience visiteur mais invisible pour Google. Si un jour le référencement en allemand/polonais devient prioritaire, générer des copies statiques `/de/`, `/pl/`… à partir du même objet `I18N` et ajouter alors les balises `hreflang`. Pour une maison de 3 chambres, la fiche **Google Business** et les avis comptent bien davantage.
