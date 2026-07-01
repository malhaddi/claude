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

## Stack

| Couche | Choix | Pourquoi |
| --- | --- | --- |
| Frontend | **Next.js 16** (App Router, RSC) + **Tailwind CSS v4** + **shadcn/ui** | SSR/SSG pour un annuaire indexable (SEO = acquisition), composants copiés dans le repo (pas de dépendance à un kit fermé) |
| Backend / BDD | **Supabase** (Postgres + Auth + RLS + Realtime) | Auth deux rôles clé en main, sécurité déclarative en SQL (RLS), Realtime pour la messagerie, PostGIS pour la géolocalisation |
| Monétisation | **Stripe Connect** (comptes Express) | Le coach encaisse directement, la plateforme prélève une commission (`application_fee_amount`) — le modèle marketplace standard |

## Arborescence

```
coachmatch/
├── .env.example                 # Variables Supabase + Stripe (modèle commenté)
├── package.json                 # Dépendances (npm install à lancer soi-même)
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

## Modèle de données (Supabase)

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

## Décisions d'architecture

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

## Démarrage

```bash
npm install                      # dépendances (non lancé dans ce dépôt)
cp .env.example .env.local       # puis renseigner Supabase / Stripe
supabase db reset                # applique migrations + seed (stack locale)
npm run dev                      # http://localhost:3000
```

Sans `.env.local`, l'app fonctionne intégralement sur les données mock.

## Prochaines itérations

1. **Auth** Supabase (deux rôles) + proxy de session, puis brancher le
   formulaire de contact sur `coaching_requests`.
2. **Messagerie** : boîte de réception par rôle + Supabase Realtime.
3. **Recherche serveur** : `searchParams` → RPC `search_coaches` (+ rayon GPS
   via la géolocalisation navigateur).
4. **Espace coach** : édition de fiche, gestion des créneaux, onboarding
   Stripe Connect et paiement des séances (commission plateforme).
5. **Avis clients** (table `reviews` + trigger de recalcul de `rating_avg`).
