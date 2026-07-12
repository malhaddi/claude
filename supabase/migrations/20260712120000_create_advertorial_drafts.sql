-- Milestone 3A — structured French advertorial drafts (AI generation output).
--
-- Safe to run once (and re-runnable during development). Every access path is
-- scoped to the authenticated user via RLS — RLS is the final enforcement
-- layer, not the application. No service-role key is required: the publishable
-- key + the user's session make auth.uid() resolve to the logged-in user.
--
-- One row per generation (never overwritten). `generation_version` increases
-- per project; the app computes the next value and the unique constraint below
-- guarantees no two drafts of a project share a version.

-- 1. Table -------------------------------------------------------------------
create table if not exists public.advertorial_drafts (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null
                        references public.projects (id) on delete cascade,
  -- Research snapshot the draft was generated from. Kept for provenance; if the
  -- research row is later deleted the draft survives with a null reference.
  research_id         uuid
                        references public.project_research (id) on delete set null,
  user_id             uuid not null
                        references auth.users (id) on delete cascade,
  framework_key       text not null,
  status              text not null default 'draft',
  generation_version  integer not null default 1,
  headline            text not null,
  subheadline         text,
  introduction        text not null,
  body_sections       jsonb not null,
  call_to_action_text text not null,
  disclaimer          text,
  model_provider      text not null,
  model_name          text not null,
  prompt_version      text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  -- No two drafts of the same project may share a version number.
  constraint advertorial_drafts_project_version_key
    unique (project_id, generation_version)
);

comment on table public.advertorial_drafts is
  'Structured advertorial drafts generated for a project (RLS-enforced, owner-only). One row per generation; never overwritten.';

-- 2. Indexes -----------------------------------------------------------------
-- Listing a project's drafts, newest version first.
create index if not exists advertorial_drafts_project_version_idx
  on public.advertorial_drafts (project_id, generation_version desc);
-- Owner-scoped scans, newest first.
create index if not exists advertorial_drafts_user_created_idx
  on public.advertorial_drafts (user_id, created_at desc);

-- 3. updated_at trigger (function is shared with earlier migrations) ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists advertorial_drafts_set_updated_at on public.advertorial_drafts;
create trigger advertorial_drafts_set_updated_at
  before update on public.advertorial_drafts
  for each row
  execute function public.set_updated_at();

-- 4. Ownership-integrity trigger --------------------------------------------
-- DB-level guarantee (independent of RLS) that a draft's user_id matches the
-- owner of the referenced project, and that any referenced research belongs to
-- the same user AND the same project — so a draft can never be attached to
-- another user's project/research or cross-linked between projects.
create or replace function public.enforce_advertorial_draft_owner()
returns trigger
language plpgsql
as $$
declare
  project_owner    uuid;
  research_owner   uuid;
  research_project uuid;
begin
  select user_id into project_owner
    from public.projects
    where id = new.project_id;

  if project_owner is null then
    raise exception 'project % does not exist', new.project_id;
  end if;

  if project_owner <> new.user_id then
    raise exception 'draft user_id must match the project owner';
  end if;

  if new.research_id is not null then
    select user_id, project_id into research_owner, research_project
      from public.project_research
      where id = new.research_id;

    if research_owner is null then
      raise exception 'research % does not exist', new.research_id;
    end if;

    if research_owner <> new.user_id then
      raise exception 'draft research must belong to the same user';
    end if;

    if research_project <> new.project_id then
      raise exception 'draft research must belong to the same project';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists advertorial_drafts_enforce_owner on public.advertorial_drafts;
create trigger advertorial_drafts_enforce_owner
  before insert or update on public.advertorial_drafts
  for each row
  execute function public.enforce_advertorial_draft_owner();

-- 5. Row Level Security ------------------------------------------------------
alter table public.advertorial_drafts enable row level security;

drop policy if exists "advertorial_drafts_select_own" on public.advertorial_drafts;
drop policy if exists "advertorial_drafts_insert_own" on public.advertorial_drafts;
drop policy if exists "advertorial_drafts_update_own" on public.advertorial_drafts;
drop policy if exists "advertorial_drafts_delete_own" on public.advertorial_drafts;

-- Read only your own drafts.
create policy "advertorial_drafts_select_own"
  on public.advertorial_drafts
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Insert only for yourself, only for a project you own, and only referencing
-- research that is yours AND belongs to the same project (or no research).
create policy "advertorial_drafts_insert_own"
  on public.advertorial_drafts
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.projects p
      where p.id = advertorial_drafts.project_id
        and p.user_id = auth.uid()
    )
    and (
      advertorial_drafts.research_id is null
      or exists (
        select 1 from public.project_research r
        where r.id = advertorial_drafts.research_id
          and r.user_id = auth.uid()
          and r.project_id = advertorial_drafts.project_id
      )
    )
  );

-- Update only your own drafts, keeping the same ownership/linkage invariants.
create policy "advertorial_drafts_update_own"
  on public.advertorial_drafts
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.projects p
      where p.id = advertorial_drafts.project_id
        and p.user_id = auth.uid()
    )
    and (
      advertorial_drafts.research_id is null
      or exists (
        select 1 from public.project_research r
        where r.id = advertorial_drafts.research_id
          and r.user_id = auth.uid()
          and r.project_id = advertorial_drafts.project_id
      )
    )
  );

-- Delete only your own drafts.
create policy "advertorial_drafts_delete_own"
  on public.advertorial_drafts
  for delete
  to authenticated
  using (auth.uid() = user_id);
