# Publy

Publy is a French-first SaaS that helps Shopify and DTC advertisers turn
product information into mobile-first advertorial / pre-sell pages
(« pages de prévente ») for their paid traffic.

> **Naming note:** the customer-facing brand is **Publy**. Some *internal*
> identifiers intentionally keep their original `advertoai` names to avoid
> needless churn/risk: the npm package name (`advertoai`), the comparison
> data id (`advertoai`), and the CSS keyframe (`advertoai-rise`). These are
> never shown to users. The common nouns "advertorial"/"advertoriaux" and
> "page de prévente" are product vocabulary, not the brand.

Core positioning: **« Transformez votre produit en advertorial français prêt à
convertir. »**

This repository contains the application foundation, a conversion-focused
public marketing website (milestone 1 + 1.1), secure Supabase email/password
authentication (milestone 2A, hardened in 2B.1), user-owned **projects** with
Row Level Security + a product-intake form (2B), and a structured **product &
audience research** step per project (2C). AI generation, billing and scraping
come in later milestones — see [TASKS.md](./TASKS.md).

The homepage is intentionally honest about scope: features not yet built are
labelled « Bientôt », the Growth plan is a disabled waitlist (no checkout),
and there are no guaranteed-results/ROAS/CAC claims, testimonials or invented
metrics.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) — this version has
  breaking changes vs. older Next.js; read `node_modules/next/dist/docs/`
  before coding (see `AGENTS.md`).
- React 19
- TypeScript 5, `strict` mode
- Tailwind CSS v4 (configured in CSS — there is intentionally no
  `tailwind.config.js`)
- Zod for runtime validation (env vars, marketing + auth content)
- Vitest for unit tests
- lucide-react for icons
- **Supabase** for authentication **and database** — `@supabase/supabase-js` +
  `@supabase/ssr` (cookie-based sessions; projects table with Row Level
  Security). Email/password auth only; no service-role key is ever used.
- **Anthropic Claude** (`@anthropic-ai/sdk`) for advertorial generation, behind
  a provider-neutral abstraction (`src/lib/ai`). The API key is a server-only
  secret — never exposed to the browser or logged.

Planned but **not** installed yet: Stripe (billing), scraping.

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # optional for local dev — defaults work
npm run dev                  # http://localhost:3000
```

## Scripts

| Script              | Purpose                                |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Dev server (Turbopack) on :3000        |
| `npm run build`     | Production build                       |
| `npm run start`     | Serve the production build             |
| `npm run lint`      | ESLint (eslint-config-next)            |
| `npm run typecheck` | TypeScript `tsc --noEmit`              |
| `npm test`          | Vitest test suite (single run)         |
| `npm run test:watch`| Vitest in watch mode                   |

## Architecture

```
src/
  proxy.ts                # Next.js 16 Proxy (was middleware): session refresh
                          # + optimistic auth redirects
  app/
    layout.tsx            # Root layout: <html>/<body>, fonts, metadata
    globals.css           # Tailwind v4 entry + design tokens
    (marketing)/          # Route group with the public chrome
      layout.tsx          #   header + footer + skip link
      page.tsx            #   marketing homepage (all sections)
    connexion/            # /connexion — login (page + client form + footer)
    inscription/          # /inscription — register (page + client form)
    dashboard/
      page.tsx            #   protected project list + empty state
      projets/nouveau/    #   /dashboard/projets/nouveau — create form
      projets/[id]/       #   /dashboard/projets/[id] — product info (+ tabs)
      projets/[id]/recherche/  #   research profile (product/audience)
    auth/confirm/route.ts # Email-confirmation callback (code / token_hash)
    not-found.tsx         # Custom French 404 page
    icon.svg              # Favicon
  components/
    layout/               # SiteHeader (client: sticky + mobile menu), SiteFooter
    marketing/            # Hero, Problem, WorkflowDemo, TemplateGallery, …
    auth/                 # AuthShell, AuthField, PasswordInput (client toggle)
    dashboard/            # DashboardHeader, ProjectList, ProjectForm (client),
                          # FormField, DeleteProjectButton (client)
    ui/                   # ButtonLink, SectionHeading, Reveal (client)
  lib/
    content.ts / content-schema.ts   # French marketing copy + Zod schemas
    env.ts                # Zod-validated public env vars (site + Supabase)
    format.ts / utils.ts  # fr-FR formatting / cx() class-name helper
    auth/                 # content, validation, errors, actions, dal (guard)
    projects/
      content.ts / types.ts / validation.ts   # project intake (2B)
      dal.ts / actions.ts # getProjects/getProject; create/update/delete (2B)
      research-content.ts # research copy + controlled options (awareness/tone)
      research-types.ts / research-validation.ts
      research-progress.ts # transparent completion score (12 required fields)
      research-dal.ts     # getResearch() — RLS-scoped read
      research-actions.ts # saveResearch() — ownership-checked upsert
    supabase/
      client.ts           # Browser client (publishable key)
      server.ts           # Server client (cookie-based session)
      proxy.ts            # updateSession() used by src/proxy.ts
    *.test.ts             # Vitest unit tests, colocated with the code
supabase/
  migrations/             # SQL migrations (projects table + RLS)
```

Conventions:

- **French for customer-facing copy, English for code.** All UI text lives in
  `src/lib/content.ts`; components stay copy-free and read from it.
- **Content is validated.** `content.ts` parses every export against the Zod
  schemas in `content-schema.ts` at module load, so malformed copy fails the
  build and tests rather than shipping.
- **Server components by default.** Client components are limited to what
  needs browser state: `SiteHeader` (sticky nav + mobile menu), `WorkflowDemo`
  (auto-advancing tabs), `Pricing` (billing-period preview toggle) and the
  `Reveal` scroll-animation wrapper. The FAQ and template cards use native
  `<details>` — no JS required.
- **Motion is restrained and accessible.** Animations use CSS transitions +
  IntersectionObserver (no animation library). Every animation is guarded by
  `prefers-reduced-motion`, reveals fall back to visible without JS (a
  `<noscript>` override), and only opacity/transform are animated so there is
  no layout shift.
- **Semantic Tailwind usage**: slate neutrals + indigo accent, mobile-first
  responsive classes, `cx()` for conditional classes.

## Environment variables

Copy `.env.example` to `.env.local`. The Supabase values are `NEXT_PUBLIC_*` and
public/safe for the browser — this project never uses a Supabase service-role
key, secret key or database password. `ANTHROPIC_API_KEY` is the only secret: it
is **server-only** and must never be prefixed with `NEXT_PUBLIC_`.

| Variable                               | Scope       | Purpose                                              |
| -------------------------------------- | ----------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Public      | Canonical base URL for metadata + the email-confirmation redirect (defaults to localhost) |
| `NEXT_PUBLIC_SUPABASE_URL`             | Public      | Supabase project URL (Dashboard → Project Settings → API Keys) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public      | Supabase publishable key (safe to expose; RLS protects data) |
| `ANTHROPIC_API_KEY`                    | Server-only | Anthropic key for advertorial generation. Read only on the server, never inlined into the client bundle, never logged. Unset → generation is disabled with a clear message. |

The Supabase values fall back to obvious placeholders when unset, so `build`,
tests and CI never need real credentials; `ANTHROPIC_API_KEY` may be left unset
too (generation stays disabled, and tests mock the provider). `.gitignore`
ignores every `.env*` file except `.env.example` — never commit real
credentials.

## Supabase authentication setup

Milestone 2A implements email/password auth (register, login, logout, a
protected `/dashboard`). To run it against a real project:

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Copy the keys** — Dashboard → *Project Settings → API Keys*: the
   **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`, and the **publishable key**
   → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Put both in `.env.local`.
   Do **not** copy the service-role/secret key — it is not used here.
3. **Auth settings** — Dashboard → *Authentication → Providers → Email*:
   **Email must be enabled AND "Confirm email" must be ON** (this is required
   for the hardened flow — see below).
4. **URL configuration** — Dashboard → *Authentication → URL Configuration*:
   - **Site URL:**
     - local: `http://localhost:3000`
     - production: `https://your-domain.com`
   - **Redirect URLs (allow-list):**
     - `http://localhost:3000/auth/confirm`
     - `https://your-domain.com/auth/confirm`
5. **Email confirmation** — with *Confirm email* enabled, `supabase.auth.signUp`
   returns a **user but `session: null`** before confirmation. Registration
   therefore shows a neutral « Vérifiez votre boîte mail » message and creates
   **no usable application session**. The confirmation link lands on
   `/auth/confirm`, which establishes the session and redirects to
   `/dashboard`. The callback supports both the PKCE `?code=` flow (default
   email template) and the `?token_hash=&type=` flow (customized template).

### Email-confirmation enforcement (Milestone 2B.1)

Access is refused until the email is confirmed, defense-in-depth:

- **Guard** — `requireUser()` (`src/lib/auth/dal.ts`) calls
  `supabase.auth.getUser()` and requires a **non-null `email_confirmed_at`**;
  an unconfirmed user is redirected to `/connexion?status=email_non_confirme`
  **before any protected HTML renders**.
- **Proxy** — `src/proxy.ts` treats only confirmed users as authenticated and
  **clears (`sb-*`) cookies of any unconfirmed session** so it is never usable.
- **Login** — an unconfirmed login fails with « Confirmez votre adresse e-mail
  avant de vous connecter. » (both from Supabase's `email_not_confirmed` error
  and a post-success `email_confirmed_at` guard).
- **Sign-up is enumeration-safe** — whether the address is new or already
  registered, the same neutral notice is shown (« Si cette adresse peut être
  utilisée… »), with links to *Se connecter* and *Renvoyer l'e-mail de
  confirmation*.
- **Confirmation callback** rejects malformed/expired tokens → redirects to
  `/connexion?status=confirmation_invalide`; success → `/dashboard`. Targets
  are fixed internal paths (no open redirect).

### Create and test an account

```bash
cp .env.example .env.local   # fill in the two NEXT_PUBLIC_SUPABASE_* values
npm run dev
```

Full manual validation (with *Confirm email* ON):

1. In Supabase → *Authentication → Users*, delete any old unverified test user.
2. Visit `/inscription` and register a **fresh** address (password ≥ 8 chars,
   one uppercase, one lowercase, one digit).
3. Confirm you get the neutral « Vérifiez votre boîte mail » notice and are
   **not** taken to `/dashboard`. Try opening `/dashboard` directly → you are
   redirected to `/connexion` (no dashboard access before confirmation).
4. Try logging in at `/connexion` before confirming → it fails with
   « Confirmez votre adresse e-mail avant de vous connecter. »
5. Open the confirmation email and click the link → you land on `/dashboard`.
6. Create / edit / delete a project — all should work; open a project you own.
7. Log out via the dashboard button → back to `/connexion`; log back in.
8. Confirm the entire visible UI reads **Publy** (header, auth, dashboard,
   footer, favicon) and no customer-facing "AdvertoAI" text remains.

### How route protection works

- **`src/proxy.ts`** (Next.js 16 Proxy, formerly middleware) refreshes the
  session cookie on every request and does *optimistic* redirects
  (unauthenticated → `/connexion`, authenticated on an auth page →
  `/dashboard`).
- **`src/lib/auth/dal.ts`** is the authority: `requireUser()` calls
  `supabase.auth.getUser()` (which re-validates the token with Supabase) and
  redirects **before** any protected markup is rendered. The dashboard uses it,
  so a direct URL visit by an anonymous user never sees protected HTML.
- Redirect targets are fixed internal paths; no user-supplied redirect
  parameter is honored (no open-redirect surface).

## Database & projects (Milestone 2B)

Logged-in users can create, open, edit and delete their own **projects**
(product intake for a future advertorial). Ownership is enforced by Row Level
Security in Postgres — the application is defense-in-depth, RLS is the final
layer. **No service-role key is used**; the app talks to the DB with the
publishable key + the user's session, so `auth.uid()` resolves to the
logged-in user.

### Apply the migration

Migration file: [`supabase/migrations/20260711120000_create_projects.sql`](./supabase/migrations/20260711120000_create_projects.sql).

**Option A — Supabase Dashboard (simplest):** open *SQL Editor → New query*,
paste the file's contents, and **Run**.

**Option B — Supabase CLI:**
```bash
supabase link --project-ref <your-project-ref>
supabase db push        # applies files in supabase/migrations
```

The migration creates `public.projects`, an index on `(user_id, created_at)`,
an `updated_at` trigger, enables RLS, and adds four owner-only policies. It is
re-runnable (idempotent `if not exists` / `drop policy if exists`).

### Verify RLS is on

- Dashboard → *Authentication → Policies*: `public.projects` should show
  **RLS enabled** with `projects_select_own`, `projects_insert_own`,
  `projects_update_own`, `projects_delete_own`.
- Or in SQL:
  ```sql
  select relrowsecurity from pg_class where relname = 'projects';   -- t
  select policyname, cmd from pg_policies where tablename = 'projects';
  ```

### Manual two-user security test

1. Register **User A**, create a project, and note its id from the URL
   `/dashboard/projets/<ID>`.
2. Register **User B** (different email; use a private window / second browser).
3. As **User B**, visit `/dashboard` → you see **only B's** projects (A's are
   absent).
4. As **User B**, visit `/dashboard/projets/<A's ID>` directly → you get a
   **404** (no data, no leak — IDOR blocked).
5. Optional DB check: in the SQL Editor run `select count(*) from projects;`
   as each user via *Run as → authenticated* (impersonate) — each sees only
   their own rows.

## Product & audience research (Milestone 2C)

Each project has one **research profile** (product / customer / offer /
campaign context) for a future AI step. Open a project → the **Recherche
client** tab (`/dashboard/projets/[id]/recherche`). The **Génération** tab is
present but disabled (« Bientôt ») in this milestone, even at 100% research
completion. This milestone adds **no new environment variables**.

### Apply the migration

Migration file:
[`supabase/migrations/20260712090000_create_project_research.sql`](./supabase/migrations/20260712090000_create_project_research.sql).

- **Dashboard:** *SQL Editor → New query* → paste the file → **Run**.
- **CLI:** `supabase db push` (applies files in `supabase/migrations`).
- **Re-runnable:** yes — `create table if not exists`, `create or replace`
  functions, `drop … if exists` triggers/policies.

It creates `public.project_research` with a **unique `project_id`** (one row
per project), a `user_id` index, an `updated_at` trigger, a DB-level
**ownership trigger** (research `user_id` must equal the project's owner),
enables RLS, and adds four owner-only policies.

### Verify the table, constraints, trigger, indexes and RLS

```sql
-- columns
select column_name from information_schema.columns
  where table_name = 'project_research' order by ordinal_position;
-- unique project_id + user_id index
select indexname, indexdef from pg_indexes where tablename = 'project_research';
-- triggers (updated_at + ownership enforcement)
select tgname from pg_trigger where tgrelid = 'public.project_research'::regclass
  and not tgisinternal;
-- RLS on + policies
select relrowsecurity from pg_class where relname = 'project_research';   -- t
select policyname, cmd from pg_policies where tablename = 'project_research';
```

### Progress calculation

Completion is a transparent count of **12 required fields** that are non-empty:
`brand_name, product_category, product_price, customer_awareness_level,
main_problem, desired_outcome, main_promise, main_objections, proof_points,
offer_details, preferred_tone, call_to_action`. The UI shows the percentage and
the *N / 12* count; « Recherche prête » appears **only at 100%**. Incomplete
drafts still save, and generation stays disabled regardless.

### Manual two-user research security test

- **User A:** open Project A, complete/save research, note the project UUID.
- **User B** (separate private session): `/dashboard` shows none of A's
  projects; visiting `/dashboard/projets/<A's UUID>/recherche` → **404**;
  User B cannot create or update research for A's project (the save action
  checks ownership, and RLS + the DB ownership trigger reject it).
- **User A:** reopen the project → the research remains saved and editable.

## Advertorial generation (Milestone 3A)

A confirmed user can generate **one structured French advertorial draft** from a
project's product info + research + a chosen framework (+ optional instructions).
Open a project → the **Génération** tab (`/dashboard/projets/[id]/generation`).
The tab unlocks **only when the research is 100% complete**; until then it shows
a « Terminez la recherche » hint and the page links back to the research form.

Three frameworks (stable keys): **`five_reasons`** (« 5 raisons de… »),
**`editorial_test`** (« J'ai testé… », editorial-review structure — no fake
first person), **`problem_agitation_solution`**. The model returns strict JSON
(headline, subheadline, introduction, `body_sections[]`, call to action,
disclaimer), validated with Zod; an invalid response triggers **one** repair
retry, then fails safely without storing anything. Every valid generation is a
**new row** with an incremented `generation_version` (drafts are never
overwritten or edited), and the history lists every version.

### AI provider configuration

Generation uses the Anthropic Claude API behind a provider-neutral abstraction
(`src/lib/ai`). Set the server-only `ANTHROPIC_API_KEY` (see *Environment
variables*). When it is unset the UI shows « La génération par IA n'est pas
encore configurée… » and no request is made. The key is read from `process.env`
on the server only, never inlined into the client bundle and never logged. Tests
mock the provider, so **no real API call is made in CI**.

### Apply the migration

Migration file:
[`supabase/migrations/20260712120000_create_advertorial_drafts.sql`](./supabase/migrations/20260712120000_create_advertorial_drafts.sql).

- **Dashboard:** *SQL Editor → New query* → paste the file → **Run**.
- **CLI:** `supabase db push` (applies files in `supabase/migrations`).
- **Re-runnable:** yes — `create table if not exists`, `create or replace`
  functions, `drop … if exists` triggers/policies.

It creates `public.advertorial_drafts`, a unique `(project_id,
generation_version)` constraint (no duplicate versions), indexes on
`(project_id, generation_version desc)` and `(user_id, created_at desc)`, an
`updated_at` trigger, a DB-level **ownership trigger** (a draft's `user_id` must
equal the project owner, and any referenced research must belong to the same
user *and* the same project), enables RLS, and adds four owner-only policies
whose insert/update `WITH CHECK` re-verify project + research ownership.

### Verify the table, constraints, trigger, indexes and RLS

```sql
-- columns
select column_name from information_schema.columns
  where table_name = 'advertorial_drafts' order by ordinal_position;
-- unique (project_id, generation_version) + both indexes
select indexname, indexdef from pg_indexes where tablename = 'advertorial_drafts';
-- triggers (updated_at + ownership enforcement)
select tgname from pg_trigger where tgrelid = 'public.advertorial_drafts'::regclass
  and not tgisinternal;
-- RLS on + policies
select relrowsecurity from pg_class where relname = 'advertorial_drafts';   -- t
select policyname, cmd from pg_policies where tablename = 'advertorial_drafts';
```

### Manual test

1. Set `ANTHROPIC_API_KEY` in `.env.local` and restart `npm run dev`.
2. Create a project, then complete the research to **100%** (all 12 fields).
3. Open **Génération**, pick a framework, optionally add instructions, and
   **Générer le brouillon**. The submit button disables while pending (no double
   submit) and a structured preview appears on success.
4. Generate again → a **new version** is added to the history; open any past
   version from the history list.
5. **Gating:** with research below 100%, the Génération tab is locked and the
   page shows the « Terminez la recherche » block linking back to the form.
6. **Two-user security:** User B cannot open User A's drafts
   (`/dashboard/projets/<A's project>/generation/<A's draft>` → **404**), and the
   generate action rejects a foreign project (RLS + the DB ownership trigger are
   the final layer).

## Deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo. Vercel auto-detects
   Next.js; no build settings needed.
3. Set the environment variables for Production and redeploy:
   `NEXT_PUBLIC_SITE_URL` (e.g. `https://publy.fr`),
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Add the production Site URL + `…/auth/confirm` redirect URL in the Supabase
   dashboard (see *Supabase authentication setup* above).
5. To enable advertorial generation, add the server-only `ANTHROPIC_API_KEY`
   (Production) and redeploy. Leave it unset to keep generation disabled.
6. Later milestones may add more server-side secrets (Stripe). None exist today.

## Quality gates

CI-equivalent checks, all expected to pass before committing:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

See [DECISIONS.md](./DECISIONS.md) for the reasoning behind the major
technical choices, and [TASKS.md](./TASKS.md) for the roadmap.
