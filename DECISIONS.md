# Technical decisions

Log of the major choices made so far and why. Newest first within each
milestone.

## Milestone 1 — Foundation & marketing site

### Repository reset on this branch

The repository previously contained an unrelated prototype ("Content Hub"
dashboard, preserved on `main`). This branch replaces it with AdvertoAI. The
proven tooling versions (Next.js 16.2.9, Tailwind v4, ESLint 9 flat config,
strict tsconfig) were kept; the app code and unused dependencies (Radix UI,
Recharts, shadcn/ui, fast-xml-parser…) were removed to keep the dependency
surface minimal for a solo founder.

### Next.js App Router, server components by default

Pages and marketing sections are React Server Components; only the header is
a client component (mobile-menu state). Less JS shipped, simpler mental
model, and it matches where Next.js is going. The FAQ uses native
`<details>/<summary>` instead of a JS accordion for the same reason (and for
accessibility for free).

### All marketing copy in one Zod-validated module

Customer-facing text (French) lives in `src/lib/content.ts` and is parsed
against schemas in `content-schema.ts` at module load. Rationale:

- Copy edits happen in one file, without touching JSX — friendly for a
  non-technical founder directing changes.
- Structural mistakes (missing template, FAQ answer, malformed link) fail the
  build and the tests instead of silently rendering broken UI.
- The same schemas will later validate AI-generated advertorial content, so
  this establishes the pattern early.

### French UI / English code split

All customer-facing strings are French (the market is French-first); code,
comments, file names and docs are English (standard for tooling and any
future collaborators). Enforced by convention and review, not tooling.

### Tailwind CSS v4, no UI-kit dependency

Tailwind v4 is configured entirely in `globals.css` (`@import "tailwindcss"`,
`@theme`) — no `tailwind.config.js`, per v4 defaults. No component library
(shadcn/radix/daisy) was added: the marketing site needs ~2 shared primitives
(`ButtonLink`, `SectionHeading`), and every dependency is a maintenance cost.
Revisit when the authenticated app needs real form/dialog primitives.

### Zod now, even without a backend

Zod is in the long-term stack (form + API validation later). Using it today
for env parsing (`src/lib/env.ts`) and content validation keeps the
dependency justified and establishes patterns, at ~13 kB.

### Vitest with a node environment, colocated tests

Vitest is fast, TypeScript-native and needs no Babel/Jest config. Tests run
in a plain `node` environment because everything tested is pure logic
(schemas, parsing, formatting) — no jsdom/testing-library dependency until
there is interactive client logic worth component-testing. Test files sit
next to the code (`src/lib/*.test.ts`).

### Placeholder `/dashboard` instead of hidden routes

"Commencer" and "Connexion" both point to `/dashboard`, which is an explicit
"En construction" page (noindexed). Honest UX for early visitors, and the
information architecture (marketing site vs. app) is settled from day one.

### Deterministic, claim-free marketing content

No invented testimonials, customer logos, star ratings or performance
guarantees (ROAS/CAC). The FAQ explicitly says results are not guaranteed.
This keeps the site legally safe and trustworthy pre-launch.

### `NEXT_PUBLIC_SITE_URL` for metadata

`metadataBase` reads a single public env var (validated, defaulting to
localhost) so canonical/OG URLs work on Vercel previews and production
without code changes. No secrets exist in this milestone; `.gitignore`
excludes all `.env*` files except `.env.example`.

### lucide-react for icons

Single, tree-shakeable icon dependency already proven to work in this
environment. Note: the installed 1.x line has no brand icons (no Shopify /
Instagram glyphs) — use neutral glyphs instead.
