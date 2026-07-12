@AGENTS.md

# Publy — French-first advertorial SaaS

Publy helps Shopify and DTC advertisers turn product information into
mobile-first advertorial / pre-sell pages (« pages de prévente »), written in
French. Core positioning: « Transformez vos publicités en pages qui vendent. »

Brand note: the customer-facing name is **Publy**. Internal identifiers keep
their original `advertoai` names on purpose (npm package `advertoai`,
comparison data id `advertoai`, CSS keyframe `advertoai-rise`) — never
user-visible. "advertorial"/"advertoriaux" and "page de prévente" are common
product nouns, not the brand.

Current state: **Milestone 2C** — application foundation, conversion-focused
marketing site (M1 + M1.1), **Supabase email/password authentication** (2A,
hardened in 2B.1, **Publy** rebrand in 2B.1), user-owned **projects** with Row
Level Security + product intake (2B), and a structured **product & audience
research** step per project (2C: `/dashboard/projets/[id]/recherche`, one row
per project via `project_research`). No AI generation, billing or scraping yet.
See `TASKS.md` for the roadmap and `DECISIONS.md` for the reasoning.

Research notes (2C): ownership enforced three ways — action-level project
ownership check, RLS `WITH CHECK` (owned project), and a DB ownership trigger;
one row per project (`unique(project_id)` + upsert). Controlled awareness/tone
selects store stable internal values. Progress = 12 required non-empty fields;
« Recherche prête » only at 100%; generation stays disabled. Auth: shared
`SubmitButton` disables while pending; 429 maps to the exact rate-limit message
with no auto-retry.

Auth hardening: `requireUser()` requires a non-null `email_confirmed_at`; the
proxy clears `sb-*` cookies for unconfirmed sessions; sign-up is
enumeration-safe. Rebrand: brand tokens live in `globals.css @theme`
(Electric primary, Lime sparingly); internal ids (`advertoai` package/data id,
`advertoai-rise` keyframe) intentionally unchanged.

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
