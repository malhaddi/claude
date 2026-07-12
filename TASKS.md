# Tasks

## Milestone 1 — Foundation & marketing site (DONE)

- [x] Initialize Next.js 16 (App Router, Turbopack) with React 19
- [x] Strict TypeScript configuration (`strict: true`, `tsc --noEmit` script)
- [x] Tailwind CSS v4 (CSS-based config, no `tailwind.config.js`)
- [x] ESLint via `eslint-config-next` (core-web-vitals + TypeScript)
- [x] Vitest test setup with 18 unit tests (content schemas, env parsing,
      formatting, utils)
- [x] Marketing homepage, French copy, mobile-first:
  - [x] Responsive navigation (desktop bar + mobile burger menu)
  - [x] Hero with core positioning + advertorial phone mockup
  - [x] "Fonctionnement" — 4-step explanation of the product
  - [x] 3 advertorial template examples (histoire, liste, test produit)
  - [x] Benefits section (6 items)
  - [x] Founding offer at 39 €/month
  - [x] FAQ (6 questions, native `<details>` accordion)
  - [x] Footer with product links and legal placeholders
  - [x] "Commencer" CTA + "Connexion" placeholder (both → `/dashboard`)
- [x] `/dashboard` placeholder route, clearly marked "En construction",
      noindexed
- [x] Custom French 404 page
- [x] Metadata: French `lang`, title template, description, Open Graph,
      favicon
- [x] `.env.example` (no secrets), `.gitignore` keeps `.env*` out of git
- [x] `README.md`, `TASKS.md`, `DECISIONS.md`
- [x] All quality gates green: lint, typecheck, tests, production build
- [x] Verified in a real browser: no horizontal overflow at 390px/1440px,
      menu/FAQ/anchor interactions, skip link, 404 status codes

## Milestone 1.1 — Conversion-focused homepage refinement (DONE)

- [x] Sticky navigation with scroll background/shadow transition; links
      Produit / Modèles / Tarifs / FAQ + Connexion + Commencer gratuitement
- [x] Hero rebuilt: outcome-focused promise, primary CTA « Créer mon premier
      advertorial », secondary « Voir comment ça fonctionne », no-card note,
      restrained entrance animation, labelled product preview
- [x] Problem section (4 common marketing problems, framed as such)
- [x] Interactive workflow walkthrough (Coller l'URL → Choisir l'angle →
      Générer → Modifier & publier), accessible tabs, autoplay only when
      motion is allowed and in view
- [x] Template gallery: 5 French frameworks (« 5 raisons de… », « J'ai
      testé… », PAS, Comparatif, Guide d'achat) with funnel stage, best use,
      example structure and launch/soon labels; interactive cards
- [x] Capabilities split into « Disponible au lancement » vs « Bientôt »
- [x] France-first differentiation section (incl. RGPD-conscious wording,
      no compliance-certification claim)
- [x] Three pricing cards: Découverte (gratuit), Lanceur (39 €, recommandé),
      Croissance (79 €, « Bientôt disponible », disabled waitlist CTA);
      labelled monthly/annual preview toggle, no fake discount, no checkout
- [x] Comparison section by workflow category (generic AI chat / page builder
      / freelance-agency / Publy), no named competitors or invented prices
- [x] FAQ expanded to the 9 required questions, honest scope answers
- [x] Final CTA « Votre prochaine campagne mérite mieux… » + footer with
      Produit / Tarifs / FAQ / legal + contact placeholders
- [x] Content architecture: navigation, workflow, templates, capabilities,
      pricing, comparison, FAQ all centralized + Zod-validated in content.ts
- [x] Restrained, performant motion (CSS + IntersectionObserver, no animation
      dependency), reduced-motion + no-JS safe, no layout shift
- [x] Tests: pricing, nav, template data, FAQ, key CTAs, no unsupported
      claims, Growth-plan purchase safety, reduced-motion/no-JS guards
- [x] All gates green (lint, typecheck, 37 tests, build); browser-verified
      interactions and no horizontal overflow at 360/390/1440px

## Milestone 2A — Supabase email/password authentication (DONE)

- [x] Added `@supabase/supabase-js` + `@supabase/ssr` (no other new deps)
- [x] Public env vars `NEXT_PUBLIC_SUPABASE_URL` +
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, Zod-validated with placeholders;
      no service-role/secret key anywhere
- [x] Browser + server Supabase clients, cookie-based sessions
- [x] `src/proxy.ts` (Next.js 16 Proxy) — session refresh + optimistic
      redirects; authoritative guard in `src/lib/auth/dal.ts`
- [x] `/inscription` — register (email, password, confirm, visibility toggle,
      client + server validation, loading/disabled state, French errors)
- [x] `/connexion` — login (French errors, no raw Supabase errors exposed)
- [x] Logout server action; protected `/dashboard` shell with user email,
      empty state and "next milestone" message
- [x] Email confirmation: « Vérifiez votre boîte mail » state +
      `/auth/confirm` callback (PKCE `code` and `token_hash` flows)
- [x] Marketing CTAs repointed: Connexion → /connexion, Commencer /
      primary CTAs → /inscription; legal/contact footer links de-linked
      (no longer point at the now-protected /dashboard)
- [x] Auth copy centralized + validated in `src/lib/auth/content.ts`
- [x] Tests (83 total): env, validation, password rules, confirm mismatch,
      French error mapping, DAL redirect, authed user, actions (mocked
      Supabase), form rendering, header auth-link destinations
- [x] Security review: server-side protection, no open redirects, no
      credential logging, no service-role key, no secrets committed
- [x] All gates green (lint, typecheck, test, build); browser-verified

## Milestone 2B — Projects, database & RLS (DONE)

- [x] SQL migration `supabase/migrations/20260711120000_create_projects.sql`:
      `projects` table, `(user_id, created_at)` index, `updated_at` trigger
- [x] Row Level Security enabled with four owner-only policies
      (select/insert/update/delete on `auth.uid() = user_id`)
- [x] RLS-scoped DAL (`getProjects`, `getProject`) — foreign id returns null
- [x] Server actions create/update/delete: identity from the session (never
      a form `user_id`), filtered by id AND user_id, safe French errors
- [x] Routes `/dashboard` (list), `/dashboard/projets/nouveau`,
      `/dashboard/projets/[id]` (404 on inaccessible id)
- [x] Product intake form (name + URL/title/description/benefits/audience/
      offer/image URL/destination URL), Zod-validated, http(s)-only URLs,
      loading/disabled/success/error states, French labels & errors
- [x] Dashboard: welcome + email, "Nouveau projet", project list, empty
      state, status, creation date, open/edit, delete-with-confirmation,
      logout, responsive
- [x] Tests (28 new / 111 total): validation, create/update/delete actions,
      unauthenticated access, ownership enforcement, inaccessible foreign
      project, invalid URLs, user_id spoof prevention, dashboard empty +
      populated states — Supabase mocked, no real credentials needed
- [x] Security: server-side actions, IDOR-safe, no service-role key, RLS as
      final layer, no raw DB errors shown; route protection verified (307,
      no protected markup leaked)
- [x] All gates green (lint, typecheck, test, build)

## Milestone 2B.1 — Auth hardening & Publy rebrand (DONE)

Part A — authentication hardening:
- [x] Root cause fixed: `requireUser()` now requires a non-null
      `email_confirmed_at` (it previously only checked `!user`); `signUp` no
      longer redirects to /dashboard for an unconfirmed session
- [x] Sign-up creates no usable session before confirmation; neutral
      « Vérifiez votre boîte mail » notice; unconfirmed sessions are signed out
- [x] Login rejects unconfirmed users with « Confirmez votre adresse e-mail
      avant de vous connecter. »
- [x] Proxy clears `sb-*` cookies for unconfirmed sessions; guard redirects
      before any protected HTML renders (dashboard + project pages)
- [x] Enumeration-safe sign-up + duplicate handling; resend-confirmation action
- [x] Confirmation callback: safe failure → `/connexion?status=confirmation_invalide`,
      success → `/dashboard`, fixed internal redirects only
- [x] 15 new auth tests (confirmation enforcement, neutrality, callback, etc.)

Part B — Publy rebrand:
- [x] Brand → **Publy**; new positioning/headline/promise; three wordmarks +
      favicon (A→P) replaced; metadata, OG and mock URLs (publy.fr) updated
- [x] Tailwind v4 brand tokens in `globals.css` (Ink/Off-white/Electric/Lime/
      Slate/Border); Electric = primary, Lime used sparingly (recommended
      badge, France-first accent); reduced-motion + responsive preserved
- [x] Auth, dashboard, pricing and project UI say Publy; RLS/CRUD unchanged
- [x] Internal ids kept stable on purpose: package `advertoai`, comparison id
      `advertoai`, CSS keyframe `advertoai-rise`, routes, cookie names
- [x] Repo-wide search: zero customer-facing AdvertoAI leftovers
- [x] All gates green (lint, typecheck, 126 tests, build); browser-verified

## Milestone 2C — Structured research + auth rate-limit safeguards (DONE)

Part A — auth rate-limit safeguards:
- [x] 429 / rate-limit mapped to the exact French message; not mislabeled as a
      wrong password; internal details never exposed
- [x] No automatic retry on 429 (single Supabase call per submit)
- [x] Shared `SubmitButton` disables while pending → prevents double submission
- [x] Tests: login 429, signup 429, no-retry, disabled-while-pending
- [x] Email-confirmation enforcement (2B.1) untouched

Part B — product & audience research:
- [x] Migration `…_create_project_research.sql`: one row per project (unique
      project_id), user_id index, updated_at trigger, DB ownership trigger,
      RLS enabled + four owner-only policies (incl. project-owner check)
- [x] RLS-scoped DAL (`getResearch`) + `saveResearch` upsert (identity from
      session, ownership verified, `onConflict: project_id`, no duplicates)
- [x] `/dashboard/projets/[id]` tabs: Informations produit / Recherche client /
      Génération (disabled « Bientôt »); switch without losing saved data
- [x] French research form in 5 sections; controlled awareness/tone selects
      storing stable internal values; Zod validation; draft save; edit; loading
      + disabled-while-pending; success/safe-error feedback; unsaved-change
      warning; responsive
- [x] Transparent progress score over 12 required fields; « Recherche prête »
      only at 100%; drafts still save; generation stays disabled at 100%
- [x] Security: session-derived user_id, project ownership check, IDOR-safe,
      404 for foreign projects, user_id/project_id spoofing blocked, RLS final
- [x] 34 new tests (research validation/progress/actions/dal, tabs, progress
      bar, submit button, auth 429/no-retry); 160 total
- [x] All gates green; existing project RLS/migration untouched; no new env vars

## Milestone 3 — AI advertorial generation (NEXT)

Out of scope until now: AI generation, Stripe, scraping, Shopify OAuth,
analytics, teams, publishing. A future milestone will turn a project's stored
product info + research into structured French advertorial copy.

## Later milestones (not started)

- Advertorial framework selection + AI generation of structured French copy
- Section-based content editor
- Public advertorial page rendering + publishing flow
- Stripe subscription (39 €/month founding offer)
- Legal pages (mentions légales, politique de confidentialité)
