# AdvertoAI

AdvertoAI is a French-first SaaS that helps Shopify and DTC advertisers turn
product information into mobile-first advertorial pre-sell pages.

Core positioning: **« Transformez votre produit en advertorial français prêt à
convertir. »**

This repository currently contains the application foundation and a
conversion-focused public marketing website (milestone 1 + the 1.1 homepage
refinement). The product flow (accounts, projects, AI generation, editing,
publishing, billing) comes in later milestones — see [TASKS.md](./TASKS.md).

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
- Zod for runtime validation (env vars, marketing content)
- Vitest for unit tests
- lucide-react for icons

Planned but **not** installed yet: Supabase (database + auth), Stripe
(billing), an AI provider for copy generation.

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
  app/
    layout.tsx            # Root layout: fonts, metadata, header/footer chrome
    globals.css           # Tailwind v4 entry + design tokens
    page.tsx              # Marketing homepage (all sections)
    dashboard/page.tsx    # Placeholder for the future app (not implemented)
    not-found.tsx         # Custom French 404 page
    icon.svg              # Favicon
  components/
    layout/               # SiteHeader (client: sticky + mobile menu), SiteFooter
    marketing/            # Hero (+ HeroPreview), Problem, WorkflowDemo (client),
                          # TemplateGallery, Capabilities, FranceFirst, Pricing
                          # (client), Comparison, Faq, FinalCta
    ui/                   # ButtonLink, SectionHeading, Reveal (client)
  lib/
    content.ts            # ALL French marketing copy, parsed with Zod
    content-schema.ts     # Zod schemas + types for the content
    env.ts                # Zod-validated public env vars
    format.ts             # fr-FR formatting helpers (EUR prices)
    utils.ts              # cx() class-name helper
    *.test.ts             # Vitest unit tests, colocated with the code
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

Copy `.env.example` to `.env.local`. No secrets exist in this milestone.

| Variable               | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for metadata (defaults to localhost) |

`.gitignore` ignores every `.env*` file except `.env.example` — never commit
real credentials.

## Deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo. Vercel auto-detects
   Next.js; no build settings needed.
3. Set the `NEXT_PUBLIC_SITE_URL` environment variable to the production URL
   (e.g. `https://advertoai.fr`) for Production, and redeploy.
4. Later milestones will add Supabase/Stripe secrets as server-side env vars
   in the Vercel dashboard.

## Quality gates

CI-equivalent checks, all expected to pass before committing:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

See [DECISIONS.md](./DECISIONS.md) for the reasoning behind the major
technical choices, and [TASKS.md](./TASKS.md) for the roadmap.
