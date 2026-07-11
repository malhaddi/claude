@AGENTS.md

# AdvertoAI — French-first advertorial SaaS

AdvertoAI helps Shopify and DTC advertisers turn product information into
mobile-first advertorial pre-sell pages, written in French. Core positioning:
« Transformez votre produit en advertorial français prêt à convertir. »

Current state: **Milestone 2B** — application foundation, conversion-focused
marketing site (M1 + M1.1), **Supabase email/password authentication** (2A)
and user-owned **projects** with Row Level Security + a product-intake form
(2B: create/open/edit/delete, `/dashboard/projets/*`). No AI generation,
billing or scraping yet. See `TASKS.md` for the roadmap and `DECISIONS.md` for
the reasoning behind technical choices.

Projects notes: the migration lives in `supabase/migrations/`; RLS (four
owner-only policies on `auth.uid() = user_id`) is the final enforcement layer.
The app never uses the service-role key. Project logic mirrors the auth
patterns: RLS-scoped DAL (`src/lib/projects/dal.ts`), server actions that
derive identity from the session, and Zod validation with http(s)-only URLs.

Auth notes: Next.js 16 uses `src/proxy.ts` (renamed from middleware) for
session refresh; the authoritative guard is `src/lib/auth/dal.ts`
(`requireUser()` → `supabase.auth.getUser()`), used by the dashboard before any
protected markup renders. Only public env vars are used
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) — never a
service-role/secret key.

## Tech stack

- **Next.js 16** (App Router, Turbopack, React Server Components), React 19
- **TypeScript 5 strict**, `@/*` path alias → `src/*`
- **Tailwind CSS v4** — configured in `src/app/globals.css` only; do NOT add
  a `tailwind.config.js`
- **Zod 4** — validates env vars (`src/lib/env.ts`) and marketing content
- **Vitest** — unit tests colocated as `src/lib/*.test.ts`, node environment
- **lucide-react** icons (1.x — no brand icons available)
- Planned later, NOT installed: Supabase (DB + auth), Stripe (billing), AI
  provider for generation. Deployment target is Vercel.

## Folder structure

```
src/
  app/
    layout.tsx            # Root layout: lang="fr", metadata, header/footer
    globals.css           # Tailwind v4 entry
    page.tsx              # Marketing homepage (assembles sections)
    dashboard/page.tsx    # Placeholder (noindex), future app shell
    not-found.tsx         # French 404
    icon.svg              # Favicon
  components/
    layout/               # site-header (client), site-footer
    marketing/            # hero, how-it-works, template-examples, benefits,
                          # founding-offer, faq, final-cta
    ui/                   # button-link, section-heading
  lib/
    content.ts            # ALL French UI copy, Zod-parsed at import
    content-schema.ts     # Schemas + types for content
    env.ts                # Zod-validated public env (NEXT_PUBLIC_SITE_URL)
    format.ts             # fr-FR helpers (formatEur)
    utils.ts              # cx() class joiner
```

## Conventions

- **French for customer-facing copy, English for code/comments/docs.**
- **All UI text lives in `src/lib/content.ts`** — components read from it and
  contain no hardcoded customer-facing strings. New content types get a Zod
  schema in `content-schema.ts` and are parsed at module load.
- **Server components by default.** Add `"use client"` only for real browser
  state (currently: the mobile menu in `site-header.tsx`). Prefer native
  elements (`<details>` for the FAQ) over JS widgets.
- **Styling**: Tailwind utilities, slate neutrals + indigo accent, mobile
  first. Join conditional classes with `cx()` from `@/lib/utils`.
- **No unsupported marketing claims**: no invented testimonials, logos, or
  guaranteed results (ROAS/CAC). Keep the honest FAQ answer about results.
- **No secrets in the repo.** `.env*` is gitignored except `.env.example`.
  Future Supabase/Stripe/AI keys must be server-side only.

## Commands

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest (single run)
```

All four gates (lint, typecheck, test, build) must pass before committing.
When verifying UI changes, see `.claude/skills/verify/SKILL.md` for the
sandbox-specific browser/screenshot recipe (headless Chrome clamps windows
to ~500px wide — use playwright-core with the pre-installed browser).
