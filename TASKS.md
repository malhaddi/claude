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
      / freelance-agency / AdvertoAI), no named competitors or invented prices
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
