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

## Milestone 2 — Authentication & projects (NEXT)

Suggested scope (no AI generation yet):

- [ ] Supabase integration (Postgres + Auth), env vars server-side only
- [ ] Email/password + magic-link sign-up and login pages (French UI)
- [ ] Protected `/dashboard` shell replacing the placeholder
- [ ] Project CRUD: create/rename/delete a project; list projects
- [ ] Product info form per project (name, URL, description, audience,
      offer) validated with Zod — stored, not yet used for generation
- [ ] Database schema + row-level security policies
- [ ] Tests for validation schemas and any server actions

## Later milestones (not started)

- Advertorial framework selection + AI generation of structured French copy
- Section-based content editor
- Public advertorial page rendering + publishing flow
- Stripe subscription (39 €/month founding offer)
- Legal pages (mentions légales, politique de confidentialité)
