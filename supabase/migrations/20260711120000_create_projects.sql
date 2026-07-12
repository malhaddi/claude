-- Milestone 2B — user-owned projects with Row Level Security.
--
-- Safe to run once against a Supabase project. Every access path is scoped to
-- the authenticated user via RLS, so RLS (not the application) is the final
-- enforcement layer. No service-role key is required to use the table from the
-- app: the publishable key + the user's session make auth.uid() resolve to the
-- logged-in user.

-- 1. Table -------------------------------------------------------------------
create table if not exists public.projects (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  name                text not null,
  product_url         text,
  product_title       text,
  product_description text,
  product_benefits    text,
  target_audience     text,
  offer_text          text,
  product_image_url   text,
  destination_url     text,
  status              text not null default 'draft',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.projects is
  'Advertorial projects owned by a single authenticated user (RLS-enforced).';

-- 2. Indexes -----------------------------------------------------------------
-- Listing a user's projects, newest first.
create index if not exists projects_user_id_created_at_idx
  on public.projects (user_id, created_at desc);

-- 3. updated_at trigger ------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- 4. Row Level Security ------------------------------------------------------
alter table public.projects enable row level security;

-- Drop-and-recreate so the migration is re-runnable during development.
drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;

-- Read only your own rows.
create policy "projects_select_own"
  on public.projects
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Insert only rows that belong to you (user_id cannot be forged).
create policy "projects_insert_own"
  on public.projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Update only your own rows, and you cannot reassign ownership.
create policy "projects_update_own"
  on public.projects
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Delete only your own rows.
create policy "projects_delete_own"
  on public.projects
  for delete
  to authenticated
  using (auth.uid() = user_id);
