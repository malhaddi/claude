-- ============================================================================
-- CoachMatch — migration 0002 : Row Level Security
-- ============================================================================
-- Principe : la clé anon (NEXT_PUBLIC_SUPABASE_ANON_KEY) est publique, donc
-- TOUTE la sécurité repose sur ces policies. Règles retenues :
--   * Annuaire public : profils, fiches coachs publiées, critères et
--     disponibilités sont lisibles par tout le monde (y compris non connecté)
--     — c'est un annuaire, il doit être indexable et consultable sans compte.
--   * Écriture : chacun ne modifie que ses propres données (auth.uid()).
--   * Messagerie : STRICTEMENT réservée aux deux participants — c'est
--     l'exigence « les coachs ont accès à des messages privés ».
-- ============================================================================

alter table public.profiles              enable row level security;
alter table public.specializations       enable row level security;
alter table public.coaches               enable row level security;
alter table public.coach_specializations enable row level security;
alter table public.availability_slots    enable row level security;
alter table public.coaching_requests     enable row level security;
alter table public.conversations         enable row level security;
alter table public.messages              enable row level security;

-- ── profiles ────────────────────────────────────────────────────────────────
-- Lecture publique : nom, ville, avatar sont des données d'annuaire. Les
-- données sensibles (email…) restent dans auth.users, jamais exposé.
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── specializations ─────────────────────────────────────────────────────────
-- Référentiel en lecture seule pour les clients ; l'écriture passe par la clé
-- service_role (aucune policy insert/update = interdit via la clé anon).
create policy "specializations_select_public"
  on public.specializations for select
  using (true);

-- ── coaches ─────────────────────────────────────────────────────────────────
-- Une fiche non publiée n'est visible que par son propriétaire (brouillon).
create policy "coaches_select_published_or_own"
  on public.coaches for select
  using (is_published or auth.uid() = id);

create policy "coaches_insert_own"
  on public.coaches for insert
  with check (auth.uid() = id);

create policy "coaches_update_own"
  on public.coaches for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── coach_specializations ───────────────────────────────────────────────────
create policy "coach_specializations_select_public"
  on public.coach_specializations for select
  using (true);

create policy "coach_specializations_manage_own"
  on public.coach_specializations for all
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);

-- ── availability_slots ──────────────────────────────────────────────────────
create policy "availability_select_public"
  on public.availability_slots for select
  using (true);

create policy "availability_manage_own"
  on public.availability_slots for all
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);

-- ── coaching_requests ───────────────────────────────────────────────────────
-- Le demandeur crée sa demande ; seuls les deux intéressés la voient ; seul
-- le coach change le statut (accepter / refuser).
create policy "requests_insert_as_client"
  on public.coaching_requests for insert
  with check (auth.uid() = client_id);

create policy "requests_select_participants"
  on public.coaching_requests for select
  using (auth.uid() in (client_id, coach_id));

create policy "requests_update_by_coach"
  on public.coaching_requests for update
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);

-- ── conversations ───────────────────────────────────────────────────────────
create policy "conversations_select_participants"
  on public.conversations for select
  using (auth.uid() in (client_id, coach_id));

-- L'un ou l'autre des participants peut ouvrir le fil (en pratique : créé
-- côté client à l'envoi de la demande, ou côté coach à l'acceptation).
create policy "conversations_insert_participant"
  on public.conversations for insert
  with check (auth.uid() in (client_id, coach_id));

-- ── messages ────────────────────────────────────────────────────────────────
-- Visibles uniquement par les participants de la conversation parente.
create policy "messages_select_participants"
  on public.messages for select
  using (exists (
    select 1 from public.conversations v
    where v.id = conversation_id
      and auth.uid() in (v.client_id, v.coach_id)
  ));

-- On ne peut écrire qu'en son nom, et que dans ses propres conversations.
create policy "messages_insert_as_participant"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations v
      where v.id = conversation_id
        and auth.uid() in (v.client_id, v.coach_id)
    )
  );

-- Le destinataire peut marquer un message comme lu (update de read_at).
create policy "messages_update_by_recipient"
  on public.messages for update
  using (
    sender_id <> auth.uid()
    and exists (
      select 1 from public.conversations v
      where v.id = conversation_id
        and auth.uid() in (v.client_id, v.coach_id)
    )
  );
