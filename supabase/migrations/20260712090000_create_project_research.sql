-- Milestone 2C — structured product & audience research, one row per project.
--
-- Safe to run once (and re-runnable during development). Every access path is
-- scoped to the authenticated user via RLS — RLS is the final enforcement
-- layer, not the application. No service-role key is required.

-- 1. Table -------------------------------------------------------------------
create table if not exists public.project_research (
  id                       uuid primary key default gen_random_uuid(),
  -- One research row per project (enables safe upsert on project_id).
  project_id               uuid not null unique
                             references public.projects (id) on delete cascade,
  user_id                  uuid not null
                             references auth.users (id) on delete cascade,
  brand_name               text,
  product_category         text,
  product_price            text,
  customer_age_range       text,
  customer_gender          text,
  customer_awareness_level text,
  main_problem             text,
  desired_outcome          text,
  main_promise             text,
  unique_mechanism         text,
  main_objections          text,
  competitor_names         text,
  proof_points             text,
  offer_details            text,
  guarantee_details        text,
  urgency_details          text,
  preferred_tone           text,
  call_to_action           text,
  additional_notes         text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

comment on table public.project_research is
  'One structured research profile per project (RLS-enforced, owner-only).';

-- 2. Indexes -----------------------------------------------------------------
-- project_id already has a unique index. Add user_id for owner-scoped scans.
create index if not exists project_research_user_id_idx
  on public.project_research (user_id);

-- 3. updated_at trigger (function is shared with the projects migration) ------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists project_research_set_updated_at on public.project_research;
create trigger project_research_set_updated_at
  before update on public.project_research
  for each row
  execute function public.set_updated_at();

-- 4. Ownership-integrity trigger --------------------------------------------
-- DB-level guarantee (independent of RLS) that a research row's user_id equals
-- the owner of the referenced project, so research can never be attached to a
-- project the user does not own.
create or replace function public.enforce_research_project_owner()
returns trigger
language plpgsql
as $$
declare
  project_owner uuid;
begin
  select user_id into project_owner
    from public.projects
    where id = new.project_id;

  if project_owner is null then
    raise exception 'project % does not exist', new.project_id;
  end if;

  if project_owner <> new.user_id then
    raise exception 'research user_id must match the project owner';
  end if;

  return new;
end;
$$;

drop trigger if exists project_research_enforce_owner on public.project_research;
create trigger project_research_enforce_owner
  before insert or update on public.project_research
  for each row
  execute function public.enforce_research_project_owner();

-- 5. Row Level Security ------------------------------------------------------
alter table public.project_research enable row level security;

drop policy if exists "project_research_select_own" on public.project_research;
drop policy if exists "project_research_insert_own" on public.project_research;
drop policy if exists "project_research_update_own" on public.project_research;
drop policy if exists "project_research_delete_own" on public.project_research;

-- Read only your own research.
create policy "project_research_select_own"
  on public.project_research
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Insert only for yourself AND only for a project you own.
create policy "project_research_insert_own"
  on public.project_research
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.projects p
      where p.id = project_research.project_id
        and p.user_id = auth.uid()
    )
  );

-- Update only your own research, and only keeping it tied to a project you own
-- (project_id cannot be repointed to another user's project).
create policy "project_research_update_own"
  on public.project_research
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.projects p
      where p.id = project_research.project_id
        and p.user_id = auth.uid()
    )
  );

-- Delete only your own research.
create policy "project_research_delete_own"
  on public.project_research
  for delete
  to authenticated
  using (auth.uid() = user_id);
