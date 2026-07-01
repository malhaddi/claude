# CoachMatch — annuaire intelligent de coachs sportifs

Plateforme de mise en relation entre pratiquants et coachs sportifs
qualifiés : recherche à filtres granulaires (spécialisation, format, sexe,
budget, ville/géolocalisation, disponibilités), fiches coach détaillées
(photo, tarifs, méthodologie), demande de coaching et messagerie privée.

**État — itération 1 (MVP front) :** structure complète du projet, schéma de
base de données Supabase (SQL + RLS), et moteur de recherche fonctionnel sur
données mock (barre de recherche + filtres + grille de profils + fiche coach
+ formulaire de contact simulé). Pas encore branché : auth, persistance des
demandes, messagerie temps réel, paiements.

> ⚠️ Ce projet vit dans le **sous-dossier `coachmatch/`** du dépôt
> `malhaddi/claude`, sur la branche `claude/coach-matching-app-mkfiuu`.
> Toutes les commandes ci-dessous en tiennent compte.

---

## 🚀 Démarrage rapide

Les 4 commandes essentielles (détail pas-à-pas plus bas) :

```bash
git clone --branch claude/coach-matching-app-mkfiuu https://github.com/malhaddi/claude.git
cd claude/coachmatch
npm install
npm run dev
```

Puis ouvrez **http://localhost:3000** — la home redirige vers l'annuaire
`/coachs`. Aucune configuration n'est nécessaire : sans `.env.local`, l'app
tourne intégralement sur les données mock.

### 0. Prérequis

| Outil | Version | Vérifier |
| --- | --- | --- |
| **Node.js** | ≥ 20.9 (LTS 22 recommandée — Next.js 16 refuse les versions plus anciennes) | `node -v` |
| **npm** | ≥ 10 (fourni avec Node) | `npm -v` |
| **Git** | récent | `git --version` |

Si Node manque ou est trop vieux, le plus simple est [nvm](https://github.com/nvm-sh/nvm) :

```bash
nvm install --lts
nvm use --lts
```

### 1. Cloner le projet

Dans un terminal (VS Code / Cursor : `Terminal → New Terminal` ou `` Ctrl+` ``) :

```bash
# Clone le dépôt directement sur la bonne branche…
git clone --branch claude/coach-matching-app-mkfiuu https://github.com/malhaddi/claude.git

# …puis descend dans le sous-dossier de l'application
cd claude/coachmatch
```

Dépôt déjà cloné ? Placez-vous simplement sur la branche :

```bash
git fetch origin claude/coach-matching-app-mkfiuu
git checkout claude/coach-matching-app-mkfiuu
cd coachmatch
```

Astuce éditeur : ouvrez **le dossier `coachmatch/`** (pas la racine du dépôt)
dans VS Code/Cursor — `code .` ou `cursor .` depuis ce dossier — pour que
TypeScript et ESLint pointent sur le bon `tsconfig.json`.

### 2. Installer les dépendances

```bash
npm install
```

Environ une minute. C'est ce qui crée `node_modules/` (le dépôt ne le
versionne pas) ; à relancer après chaque changement de `package.json`.

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Sortie attendue :

```
▲ Next.js 16.x (Turbopack)
- Local:   http://localhost:3000
✓ Ready in …
```

Ouvrez http://localhost:3000. Rechargement à chaud : modifiez un fichier de
`src/`, le navigateur se met à jour tout seul. Arrêt du serveur : `Ctrl+C`.

À voir dans cette itération :

- **/coachs** — le moteur de recherche : barre libre + filtres (spécialisation,
  format, sexe, budget, ville, disponibilités) + tri + grille de profils ;
- **/coachs/camille-roussel** (ou toute carte) — fiche coach complète et
  formulaire de demande de coaching (envoi simulé) ;
- **/messages**, **/connexion**, **/inscription** — gabarits de l'itération 2.

> Les photos de profil sont des placeholders chargés depuis `i.pravatar.cc` :
> sans accès internet, l'avatar retombe proprement sur les initiales — c'est
> voulu, pas un bug.

### Scripts disponibles

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement (Turbopack) sur :3000 |
| `npm run build` | Build de production |
| `npm run start` | Sert le build de production (après `npm run build`) |
| `npm run lint` | ESLint (config `eslint-config-next`) |

Port 3000 occupé ? `npm run dev -- -p 3001`.

---

## ⚙️ Configuration (optionnelle en itération 1)

L'app fonctionne sans aucune variable d'environnement (mode mock). Pour
préparer l'itération 2 :

```bash
cp .env.example .env.local   # puis éditer .env.local
```

| Variable | Rôle | Exposée au navigateur ? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Oui (voulu) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique — la sécurité repose sur les policies RLS | Oui (voulu) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé d'admin, serveur uniquement | **Jamais** |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (serveur) | **Jamais** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | Oui (voulu) |
| `STRIPE_WEBHOOK_SECRET` | Signature des webhooks Stripe | **Jamais** |

`.env.local` est ignoré par Git — les secrets ne partent jamais dans le dépôt.

### Base de données Supabase

Deux options, au choix :

**A. Projet hébergé (supabase.com — le plus simple)**

```bash
npx supabase login                          # une fois
npx supabase link --project-ref <REF>      # REF visible dans l'URL du dashboard
npx supabase db push                        # applique supabase/migrations/*.sql
```

Puis copier l'URL et la clé anon du projet (Dashboard → Settings → API) dans
`.env.local`. Le `seed.sql` étant réservé au dev local, insérer d'éventuelles
données de test via le SQL Editor du dashboard.

**B. Stack locale (nécessite Docker)**

```bash
npx supabase init      # crée supabase/config.toml (répondre non aux questions IDE)
npx supabase start     # démarre Postgres + Auth + API en local
npx supabase db reset  # applique les migrations + seed.sql
```

`npx supabase status` affiche l'URL et les clés locales à recopier dans
`.env.local`.

---

## 🧱 Stack

| Couche | Choix | Pourquoi |
| --- | --- | --- |
| Frontend | **Next.js 16** (App Router, RSC) + **Tailwind CSS v4** + **shadcn/ui** | SSR/SSG pour un annuaire indexable (SEO = acquisition), composants copiés dans le repo (pas de dépendance à un kit fermé) |
| Backend / BDD | **Supabase** (Postgres + Auth + RLS + Realtime) | Auth deux rôles clé en main, sécurité déclarative en SQL (RLS), Realtime pour la messagerie, PostGIS pour la géolocalisation |
| Monétisation | **Stripe Connect** (comptes Express) | Le coach encaisse directement, la plateforme prélève une commission (`application_fee_amount`) — le modèle marketplace standard |

## 📁 Arborescence

```
coachmatch/
├── .env.example                 # Variables Supabase + Stripe (modèle commenté)
├── package.json                 # Dépendances (installées via npm install)
├── next.config.ts / tsconfig.json / postcss.config.mjs / eslint.config.mjs
├── components.json              # Config shadcn/ui (style new-york, base neutral)
├── supabase/
│   ├── migrations/
│   │   ├── 0001_schema.sql      # Tables, enums, index, RPC search_coaches
│   │   └── 0002_rls.sql         # Row Level Security (toute la sécurité est là)
│   └── seed.sql                 # Jeu de démo pour le dev local uniquement
└── src/
    ├── app/                     # Routes (Server Components, pages minces)
    │   ├── layout.tsx           # Chrome global : header + main + footer
    │   ├── globals.css          # Tailwind v4 + design tokens (pas de tailwind.config)
    │   ├── page.tsx             # « / » redirige vers /coachs
    │   ├── coachs/
    │   │   ├── page.tsx         # Annuaire : charge les données, rend <CoachSearch>
    │   │   └── [slug]/page.tsx  # Fiche coach (SSG) + formulaire de contact
    │   ├── messages/page.tsx    # Messagerie (placeholder — modèle BDD prêt)
    │   ├── connexion/page.tsx   # Auth (placeholder Supabase Auth)
    │   └── inscription/page.tsx # Choix du rôle : utilisateur ou coach
    ├── components/
    │   ├── layout/site-header.tsx      # Nav globale (client : usePathname)
    │   ├── search/
    │   │   ├── coach-search.tsx        # COMPOSANT PRINCIPAL : barre + filtres + grille
    │   │   ├── search-filters.tsx      # Panneau de filtres (contrôlé, sans état)
    │   │   └── coach-card.tsx          # Carte profil (photo, prix, specs, note)
    │   ├── coach/contact-form.tsx      # Demande de coaching (envoi simulé)
    │   └── ui/                         # Primitives shadcn/ui copiées dans le repo
    └── lib/
        ├── types.ts             # Modèle de domaine (miroir des enums SQL) + meta UI
        ├── filters.ts           # Filtrage/tri PURS — sérialisables vers la RPC SQL
        ├── mock-coaches.ts      # 12 profils fictifs couvrant tous les critères
        ├── coaches.ts           # Façade données : mock aujourd'hui, Supabase demain
        ├── supabase/            # Clients navigateur + serveur (@supabase/ssr)
        ├── stripe.ts            # Couture Stripe Connect (serveur uniquement)
        └── utils.ts             # cn()
```

## 🗄️ Modèle de données (Supabase)

Correspondance avec le brief : **Users** → `profiles`, **Coaches** →
`coaches`, **Criteria** → `specializations` + colonnes filtrables.

```
auth.users (géré par Supabase Auth)
   │ 1-1
profiles ─────────── « Users » : rôle (client|coach), nom, sexe, ville,
   │ 1-1 (si coach)              point GPS PostGIS, avatar
coaches ──────────── « Coaches » : slug, accroche, bio, méthodologie, modes
   │                              (online|in_person), prix (centimes), expérience,
   │                              certifications, stripe_account_id, note agrégée,
   │                              tsvector de recherche plein texte
   ├── n-n → specializations ─── « Criteria » : force / hybride / bodybuilding
   │                              (table de référence : extensible par INSERT)
   ├── 1-n → availability_slots  (jour de semaine + plage horaire)
   ├── 1-n → coaching_requests   (demande : objectif, format, budget, message, statut)
   └── 1-n → conversations ── 1-n → messages   (messagerie privée)
```

Points clés :

- **RLS partout** (`0002_rls.sql`) : la clé anon est publique, la sécurité
  est déclarée en SQL. Annuaire lisible sans compte ; chacun n'écrit que ses
  données ; **une conversation n'est visible que par ses deux participants**.
- **RPC `search_coaches`** : le moteur de recherche version SQL (plein texte
  français, filtres optionnels, rayon géographique PostGIS). L'objet
  `CoachFilters` du front s'y sérialise tel quel — le passage du filtrage
  client au filtrage serveur ne touchera pas les composants.
- **Prix en centimes** (integer) : jamais de flottants pour l'argent, et
  c'est l'unité de Stripe.

## 🏗️ Décisions d'architecture

1. **Façade de données** (`lib/coaches.ts`) : les composants ignorent la
   provenance des données. Itération 1 = mocks ; itération 2 = Supabase, même
   signature, zéro refonte.
2. **Filtres = fonctions pures** (`lib/filters.ts`) : testables sans DOM, et
   le même objet de filtres pilote le client aujourd'hui et la RPC demain.
3. **Server Components par défaut** : seules la nav (usePathname), la
   recherche (état des filtres) et le formulaire de contact sont
   `"use client"`. Les fiches coach sont pré-rendues (`generateStaticParams`).
4. **Meta-objets par enum** (`specializationMeta`, `modeMeta`…) : libellés et
   styles centralisés — ajouter un critère est une édition en un seul point
   (+ un INSERT en base).
5. **shadcn/ui copié dans le repo** : composants possédés, pas de dépendance
   registry au build.

## 🔧 Dépannage

| Symptôme | Cause / remède |
| --- | --- |
| `You are using Node.js X. Next.js requires ≥ 20.9` | Mettre Node à jour (`nvm install --lts && nvm use --lts`), puis relancer `npm install` |
| `EADDRINUSE: port 3000` | Un autre serveur tourne : `npm run dev -- -p 3001` |
| Avatars remplacés par des initiales | Normal hors ligne : les photos mock viennent d'internet, le fallback est prévu |
| Erreurs TypeScript dans l'éditeur avant `npm install` | Attendu : les types viennent de `node_modules`. Installer, puis recharger la fenêtre |
| `next: command not found` | `npm install` n'a pas été lancé dans `coachmatch/` (vérifier le dossier courant avec `pwd`) |

## 🗺️ Prochaines itérations

1. **Auth Supabase** (deux rôles) : rafraîchissement de session dans
   `proxy.ts`, inscription client/coach via Server Actions + trigger
   `handle_new_user` créant le `profiles`, puis session dans l'UI et gardes
   de routes.
2. **Demandes réelles** : le formulaire de contact insère dans
   `coaching_requests` (policy RLS déjà en place).
3. **Messagerie** : boîte de réception par rôle + Supabase Realtime.
4. **Recherche serveur** : `searchParams` → RPC `search_coaches` (+ rayon GPS
   via la géolocalisation navigateur).
5. **Espace coach** : édition de fiche, créneaux, onboarding Stripe Connect
   et paiement des séances (commission plateforme).
6. **Avis clients** (table `reviews` + trigger de recalcul de `rating_avg`).
