# Dar Michèle Djerba — Site officiel

Site vitrine + réservation directe pour **Dar Michèle Djerba** (maison d'hôtes, Houmt Souk).
**Un seul fichier** (`index.html`), aucun serveur, aucune base de données, aucune dépendance externe :
il se déploie en 30 secondes et ne peut pas être piraté comme un WordPress
(deux concurrents djerbiens — dardhiafa.tn et darbengacem.com — ont leur blog envahi de spam
indexé par Google à cause de CMS non maintenus ; ce site n'a pas cette surface d'attaque).

## Ce que fait le site

- **6 langues avec détection automatique** : français (défaut), anglais, allemand, italien, **polonais** (les Polonais sont devenus la 3ᵉ nationalité à Djerba en 2025, devant les Allemands) et arabe (avec bascule droite-à-gauche automatique). La langue du navigateur du visiteur est détectée à l'arrivée ; un sélecteur manuel est toujours visible et le choix est mémorisé.
- **Réservation directe via WhatsApp** : le formulaire construit un message pré-rempli (dates, chambre, nom) dans la langue du visiteur et l'envoie sur le WhatsApp de la maison. Zéro commission.
- **Le problème de la garantie, résolu** : parcours en 3 étapes affiché au client — demande → **acompte de 30 % par lien de paiement sécurisé** (Visa/Mastercard internationales) ou virement → solde à l'arrivée. Politique d'annulation claire (remboursement intégral ≥ 7 jours). Voir « Encaisser l'acompte » ci-dessous.
- Preuves sociales (4,5★ / 73 avis Google, 8,3 Booking), section chambres avec prix, galerie, table & expériences, offre « maison entière », accès/carte, FAQ, SEO (JSON-LD `BedAndBreakfast`).

## Déployer (gratuit)

N'importe quel hébergeur statique. Les plus simples :

1. **Netlify Drop** (drag & drop) : https://app.netlify.com/drop — glisser le dossier, c'est en ligne.
2. **GitHub Pages** : pousser ce dossier, activer Pages.
3. Chez un registrar tunisien/OVH avec le domaine (ex. `darmichele-djerba.com`) : uploader `index.html` par FTP.

Domaine conseillé : `darmichele-djerba.com` (~12 €/an). Ensuite, **ajouter le lien du site sur la fiche Google Business et la page Facebook** — c'est de là que viendront 80 % des visiteurs.

## Encaisser l'acompte (la « garantie ») — mode d'emploi pour le propriétaire

Recherche vérifiée (2025-2026) sur les solutions accessibles à un hôte tunisien :

| Canal | Verdict | Détail |
|---|---|---|
| **Konnect** (konnect.network) | ✅ **Recommandé n°1** | Liens de paiement sans site ni code, envoyables par WhatsApp. Accepte les **Visa/Mastercard internationales** (3-D Secure). ~1,6 % local / ~3,3 % international, **zéro abonnement**, versement sur compte bancaire tunisien (2 TND par virement). Inscription en ligne avec CIN + RIB. |
| **Flouci** | ✅ Plan B | Liens de paiement, cartes tunisiennes + internationales, tarifs sur demande. |
| **Wise / Revolut** | ✅ Fallback | L'hôte ne peut pas avoir de compte, mais **le client européen peut envoyer EUR → le RIB tunisien** au taux quasi réel (1-2 jours ouvrés). |
| **Western Union** | ✅ Fallback cash | Réception gratuite en TND (Poste, BIAT…), le client paie les frais. |
| **Paymee** | ❌ Éviter | Fonds gelés depuis 2023 (enquête CTAF), activité menacée. |
| **PayPal** | ❌ Impossible | Un Tunisien **ne peut pas recevoir** d'argent PayPal. |
| **D17** | ❌ Hors sujet | Wallet domestique — inutilisable par un touriste étranger. |

**Flux opérationnel (depuis un téléphone) :**
1. Le client envoie sa demande via le site (elle arrive sur WhatsApp).
2. Confirmer la dispo + le prix total en € et TND, rappeler la politique (30 %, remboursable ≥ 7 j).
3. Créer dans l'app Konnect un **lien de paiement** du montant de l'acompte (libellé : nom + dates), l'envoyer **dans le même fil WhatsApp**, valable 48 h (« chambre en option 48 h »).
4. Paiement reçu → notification → envoyer la **confirmation écrite** (récap dates, montant reçu, solde, conditions). Ce message fait office de contrat.
5. Solde à l'arrivée en espèces (€ ou TND) ou second lien Konnect.
6. Astuce remboursements (les remboursements carte sont pénibles en Tunisie) : proposer d'abord un **report de dates sans frais** ; ne rembourser en dernier recours.

Coût total du dispositif : ~3 % sur l'acompte uniquement, 0 % sur le solde. À comparer aux 15-25 % de commission Booking sur la totalité du séjour.

## Personnaliser

Tout est dans `index.html` :

- **Photos** : chaque emplacement est un `<figure class="ph …">` contenant une illustration SVG. Remplacer le contenu du `<figure>` par `<img src="photos/xxx.jpg" alt="…">` (créer un dossier `photos/`). Les emplacements sont signalés par des commentaires `<!-- PHOTO: … -->`.
- **Prix** : chercher `data-price` (3 occurrences, valeurs indicatives 45/55/70 € à ajuster).
- **Noms des chambres** : « Indigo / Safran / Olivier » sont des propositions — modifier les clés `room1_name…room3_desc` dans chaque bloc de langue de l'objet `I18N`.
- **N° WhatsApp / téléphone** : objet `CONFIG` en haut du `<script>` (une seule fois).
- **Politique d'annulation (7 jours)** : chercher `7` dans les clés `gar_2` et `faq2_a` de chaque langue.
- **Textes** : objet `I18N` (6 blocs de langue, mêmes clés).

## SEO — note importante

La page est servie **en français dans le HTML** (le plus gros marché de Djerba) : c'est cette version que Google indexe. La traduction côté navigateur est parfaite pour l'expérience visiteur mais invisible pour Google. Si un jour le référencement en allemand/polonais devient prioritaire, générer des copies statiques `/de/`, `/pl/`… à partir du même objet `I18N` et ajouter alors les balises `hreflang`. Pour une maison de 3 chambres, la fiche **Google Business** et les avis comptent bien davantage.
