-- ============================================================================
-- CoachMatch — migration 0001 : schéma initial
-- ============================================================================
-- Correspondance avec le brief :
--   « Users »    → public.profiles        (1-1 avec auth.users, géré par
--                                          Supabase Auth : email/mot de passe,
--                                          OAuth… ne se recode pas ici)
--   « Coaches »  → public.coaches         (extension 1-1 du profil quand
--                                          role = 'coach')
--   « Criteria » → public.specializations (table de référence) + colonnes
--                  filtrables portées par coaches/profiles (mode, sexe, prix,
--                  ville, géolocalisation, disponibilités).
--
-- Choix d'architecture :
--   * Un seul compte auth par personne ; le rôle (client / coach) est une
--     donnée du profil. Un coach EST un profil — pas de duplication
--     nom/avatar/ville entre deux tables.
--   * Les critères de recherche sont des DONNÉES (table specializations),
--     pas des valeurs codées en dur : ajouter « crossfit » = un INSERT,
--     zéro migration.
--   * Les prix sont stockés en centimes (integer) — jamais de float pour de
--     l'argent, et c'est l'unité native de Stripe.
--   * La géolocalisation utilise PostGIS (geography + index GIST) : la
--     recherche « dans un rayon de X km » se fait en SQL, pas en JS.
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()
create extension if not exists "postgis";  -- recherche par rayon géographique

-- ── Enums ───────────────────────────────────────────────────────────────────
-- Les valeurs miroir côté TypeScript vivent dans src/lib/types.ts ; les deux
-- doivent rester synchronisées (source de vérité : la base).
create type public.user_role      as enum ('client', 'coach');
create type public.gender_type    as enum ('female', 'male');
create type public.coaching_mode  as enum ('online', 'in_person');
create type public.request_status as enum ('pending', 'accepted', 'declined');

-- ── 1. profiles — « Users » ─────────────────────────────────────────────────
create table public.profiles (
  -- Même id que auth.users : le profil est le prolongement métier du compte.
  id         uuid primary key references auth.users (id) on delete cascade,
  role       public.user_role not null default 'client',
  full_name  text not null,
  gender     public.gender_type,
  avatar_url text,
  city       text,
  -- Point GPS (SRID 4326 = WGS84) pour le filtre « autour de moi ».
  location   geography(point, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_location_idx on public.profiles using gist (location);

-- ── 2. specializations — « Criteria » ───────────────────────────────────────
create table public.specializations (
  id    smallint generated always as identity primary key,
  key   text not null unique, -- identifiant stable utilisé par le code ("strength")
  label text not null         -- libellé affiché ("Force")
);

-- Données de référence : seedées dans la migration (et non dans seed.sql)
-- car l'application ne fonctionne pas sans elles.
insert into public.specializations (key, label) values
  ('strength',     'Force'),
  ('hybrid',       'Hybride'),
  ('bodybuilding', 'Bodybuilding');

-- ── 3. coaches — « Coaches » ────────────────────────────────────────────────
create table public.coaches (
  -- Clé partagée avec profiles : un coach est un profil enrichi (relation 1-1).
  id                      uuid primary key references public.profiles (id) on delete cascade,
  slug                    text not null unique,       -- URL publique /coachs/<slug>
  headline                text not null default '',   -- accroche courte de la carte
  bio                     text not null default '',
  methodology             text not null default '',   -- ex: « faible volume, haute intensité »
  modes                   public.coaching_mode[] not null default '{}', -- {online, in_person}
  price_per_session_cents integer not null check (price_per_session_cents >= 0),
  price_monthly_cents     integer check (price_monthly_cents >= 0), -- suivi mensuel (optionnel)
  years_experience        smallint not null default 0,
  certifications          text[] not null default '{}', -- BPJEPS, CQP, etc.
  languages               text[] not null default '{fr}',
  is_published            boolean not null default false, -- brouillon tant que la fiche n'est pas complète
  -- Monétisation : id du compte Stripe Connect (Express) du coach.
  stripe_account_id       text,
  -- Agrégats dénormalisés (recalculés par trigger quand la table reviews
  -- arrivera) : évite un join/count sur chaque carte de l'annuaire.
  rating_avg              numeric(3, 2) check (rating_avg between 0 and 5),
  review_count            integer not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  -- Recherche plein texte sur les champs libres (barre de recherche).
  search_tsv tsvector generated always as (
    to_tsvector('french',
      coalesce(headline, '') || ' ' || coalesce(bio, '') || ' ' || coalesce(methodology, ''))
  ) stored
);

create index coaches_search_idx on public.coaches using gin (search_tsv);
create index coaches_price_idx  on public.coaches (price_per_session_cents);
create index coaches_modes_idx  on public.coaches using gin (modes);

-- ── 4. coach_specializations — n-n coach ↔ critère ──────────────────────────
create table public.coach_specializations (
  coach_id          uuid     not null references public.coaches (id) on delete cascade,
  specialization_id smallint not null references public.specializations (id) on delete cascade,
  primary key (coach_id, specialization_id)
);

-- ── 5. availability_slots — créneaux hebdomadaires récurrents ───────────────
-- Modèle simple pour le MVP : « le mardi de 18h à 21h ». La réservation de
-- séances datées (bookings) viendra dans une itération ultérieure.
create table public.availability_slots (
  id         uuid primary key default gen_random_uuid(),
  coach_id   uuid not null references public.coaches (id) on delete cascade,
  weekday    smallint not null check (weekday between 0 and 6), -- 0 = lundi … 6 = dimanche
  start_time time not null,
  end_time   time not null,
  check (start_time < end_time)
);

create index availability_slots_coach_idx on public.availability_slots (coach_id);

-- ── 6. coaching_requests — formulaire « demande de coaching » ───────────────
-- Première prise de contact structurée (objectif, budget, mode souhaité).
-- Quand le coach accepte, une conversation est ouverte.
create table public.coaching_requests (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references public.profiles (id) on delete cascade,
  coach_id       uuid not null references public.coaches (id) on delete cascade,
  goal           text,                  -- ex: « préparer ma première compétition »
  preferred_mode public.coaching_mode,
  budget_cents   integer,
  message        text not null,
  status         public.request_status not null default 'pending',
  created_at     timestamptz not null default now()
);

create index coaching_requests_coach_idx on public.coaching_requests (coach_id, status);

-- ── 7. conversations + messages — messagerie privée ─────────────────────────
-- Une conversation par paire (client, coach) : les relances successives
-- restent dans le même fil. Brancher Supabase Realtime sur messages pour le
-- temps réel côté UI.
create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid references public.coaching_requests (id) on delete set null,
  client_id  uuid not null references public.profiles (id) on delete cascade,
  coach_id   uuid not null references public.coaches (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, coach_id)
);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  body            text not null,
  created_at      timestamptz not null default now(),
  read_at         timestamptz -- null = non lu (badge « nouveaux messages »)
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);

-- ── Trigger updated_at ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger coaches_updated_at
  before update on public.coaches
  for each row execute function public.set_updated_at();

-- ── RPC search_coaches — le moteur de recherche côté serveur ────────────────
-- Miroir SQL du filtrage client de src/lib/filters.ts. L'itération 1 filtre
-- les mocks dans le navigateur ; l'itération 2 appellera :
--   supabase.rpc('search_coaches', { p_query, p_specializations, ... })
-- Tous les paramètres sont optionnels (null = filtre inactif), ce qui permet
-- de sérialiser tel quel l'objet CoachFilters du front.
create or replace function public.search_coaches(
  p_query           text default null,
  p_specializations text[] default null,               -- keys: {'strength','hybrid'}
  p_mode            public.coaching_mode default null,
  p_gender          public.gender_type default null,
  p_max_price_cents integer default null,
  p_city            text default null,
  p_lat             double precision default null,     -- géolocalisation :
  p_lng             double precision default null,     -- point + rayon
  p_radius_km       double precision default 25
)
returns setof public.coaches
language sql
stable
as $$
  select c.*
  from public.coaches c
  join public.profiles p on p.id = c.id
  where c.is_published
    -- Barre de recherche : plein texte (français) sur la fiche + nom exact.
    and (p_query is null
         or c.search_tsv @@ websearch_to_tsquery('french', p_query)
         or p.full_name ilike '%' || p_query || '%')
    -- Spécialisations : au moins une de celles demandées (sémantique OU).
    and (p_specializations is null or exists (
          select 1
          from public.coach_specializations cs
          join public.specializations s on s.id = cs.specialization_id
          where cs.coach_id = c.id
            and s.key = any (p_specializations)))
    and (p_mode is null or p_mode = any (c.modes))
    and (p_gender is null or p.gender = p_gender)
    and (p_max_price_cents is null or c.price_per_session_cents <= p_max_price_cents)
    and (p_city is null or p.city ilike p_city)
    -- « Autour de moi » : distance sphérique via PostGIS (index GIST utilisé).
    and (p_lat is null or p_lng is null
         or st_dwithin(p.location,
                       st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography,
                       p_radius_km * 1000))
  order by c.rating_avg desc nulls last, c.review_count desc;
$$;
