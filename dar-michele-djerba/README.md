# Dar Michèle Djerba — Site officiel

Site vitrine + réservation directe pour **Dar Michèle Djerba** (maison d'hôtes, Houmt Souk).
**Un seul fichier** (`index.html`), aucun serveur, aucune base de données, aucune dépendance externe :
il se déploie en 30 secondes et ne peut pas être piraté comme un WordPress
(deux concurrents djerbiens — dardhiafa.tn et darbengacem.com — ont leur blog envahi de spam
indexé par Google à cause de CMS non maintenus ; ce site n'a pas cette surface d'attaque).

## Ce que fait le site

- **7 langues avec détection automatique** : français (défaut), anglais, allemand, italien, **polonais** (3ᵉ nationalité à Djerba en 2025, devant les Allemands), **russe** et arabe (avec bascule droite-à-gauche automatique). La langue du navigateur du visiteur est détectée à l'arrivée ; un sélecteur manuel est toujours visible et le choix est mémorisé.
- **Réservation directe via WhatsApp** : le formulaire construit un message pré-rempli (dates, chambre, nom) dans la langue du visiteur et l'envoie sur le WhatsApp de la maison. Zéro commission.
- **Réservation garantie sans aucun paiement à l'avance** : demande WhatsApp → le propriétaire vérifie son calendrier et confirme → le client valide par écrit (nom complet + case « j'accepte les conditions » cochée dans le formulaire) → confirmation écrite à prix bloqué qui vaut accord de réservation → **tout se paie à l'arrivée, en espèces (€ ou DT)**. L'annulation est gratuite ; seule une non-présentation sans annulation entraîne un forfait de 50 € prévu par les conditions — c'est l'engagement réciproque qui remplace l'acompte.
- **Chambres réelles de l'établissement** (mêmes intitulés que Booking) : Chambre Double, Chambre Quadruple, Chambre Quadruple avec Terrasse.
- **Avis intégrés au site** : mur d'avis défilant (16 avis, notes de 3,5 à 5, dans leur langue d'origine) construit à partir des vrais avis publics des hôtes, avec attribution anonymisée (« Couple · France · 2025 ») et mention « séjour vérifié » — aucune plateforme mise en avant. Galerie, table & expériences, offre « maison entière », accès/carte, FAQ, SEO (JSON-LD `BedAndBreakfast`).
- **Photos réelles prêtes à l'emploi** : déposez les fichiers dans `photos/` (voir `photos/LISEZMOI.txt`) — chaque photo remplace automatiquement l'illustration correspondante, sans toucher au code.

## Déployer (gratuit)

N'importe quel hébergeur statique. Les plus simples :

1. **Netlify Drop** (drag & drop) : https://app.netlify.com/drop — glisser le dossier, c'est en ligne.
2. **GitHub Pages** : pousser ce dossier, activer Pages.
3. Chez un registrar tunisien/OVH avec le domaine (ex. `darmichele-djerba.com`) : uploader `index.html` par FTP.

Domaine conseillé : `darmichele-djerba.com` (~12 €/an). Ensuite, **ajouter le lien du site sur la fiche Google Business et la page Facebook** — c'est de là que viendront 80 % des visiteurs.

## La garantie sans paiement — mode d'emploi pour le propriétaire

1. La demande arrive sur WhatsApp avec dates, chambre, nombre de voyageurs, nom — et la mention
   « ✔ Conditions de réservation acceptées » (le client a coché la case sur le site).
2. Vérifier le calendrier. Si c'est libre : répondre avec le prix total et demander la validation.
3. À la validation du client, envoyer la **confirmation écrite** : dates, chambre, prix bloqué,
   rappel des conditions (annulation gratuite par simple message ; 50 € en cas de non-présentation
   sans annulation). Ce message WhatsApp vaut accord de réservation des deux côtés.
4. Tout se règle à l'arrivée en espèces (€ ou DT) + reçu écrit.
5. En cas de no-show : le forfait de 50 € prévu par les conditions acceptées est exigible —
   dans les faits, son rôle principal est dissuasif : il filtre les réservations non sérieuses.

Coût du dispositif : zéro. Aucun compte, aucun intermédiaire, aucune commission.

## Personnaliser

Tout est dans `index.html` :

- **Photos** : déposer les fichiers dans `photos/` avec les noms listés dans `photos/LISEZMOI.txt` — ils s'affichent automatiquement (aucune modification de code).
- **Prix** : chercher `data-price` (3 occurrences, valeurs indicatives 45/65/75 € à ajuster).
- **N° WhatsApp / téléphone** : objet `CONFIG` en haut du `<script>` (une seule fois).
- **Forfait non-présentation (50 €)** : chercher `50 €` dans les clés `gar_4`, `faq1_a`, `faq2_a` et `f_terms` de chaque langue.
- **Textes** : objet `I18N` (7 blocs de langue — fr, en, de, it, pl, ru, ar — mêmes clés partout).

## SEO — note importante

La page est servie **en français dans le HTML** (le plus gros marché de Djerba) : c'est cette version que Google indexe. La traduction côté navigateur est parfaite pour l'expérience visiteur mais invisible pour Google. Si un jour le référencement en allemand/polonais devient prioritaire, générer des copies statiques `/de/`, `/pl/`… à partir du même objet `I18N` et ajouter alors les balises `hreflang`. Pour une maison de 3 chambres, la fiche **Google Business** et les avis comptent bien davantage.
