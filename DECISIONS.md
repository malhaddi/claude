# Technical decisions

Log of the major choices made so far and why. Newest first within each
milestone.

## Milestone 2A — Supabase email/password authentication

### Proxy, not middleware (Next.js 16)

Next.js 16 renamed `middleware.ts` to **`proxy.ts`** (same functionality; the
bundled docs at `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
say so explicitly). We use `src/proxy.ts` to refresh the Supabase session
cookie and perform *optimistic* auth redirects. Per the same docs, the proxy is
a first check, **not** the authorization authority: the real guard lives in the
Data Access Layer.

### Authoritative guard in a DAL, rendered before any protected HTML

`src/lib/auth/dal.ts` exposes `getUser()` (memoized with React `cache`) and
`requireUser()`. Both call `supabase.auth.getUser()`, which **re-validates the
JWT with the Supabase Auth server** — unlike `getSession()`, which only reads a
cookie and must not be trusted for authorization. The dashboard calls
`requireUser()` at the top of the server component, so an unauthenticated
direct visit redirects to `/connexion` (HTTP 307) with **no protected markup
ever produced**. Client-side checks are never the protection.

### Publishable key, and no service-role key — ever

Auth uses only `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
These are public by design (row-level security, not key secrecy, protects
data). The project deliberately never reads a service-role/secret key or DB
password — a test asserts the env schema does not surface `SUPABASE_SERVICE_ROLE_KEY`.
(Supabase now calls this the "publishable key"; earlier docs said "anon key".)

### Env placeholders so CI needs no credentials

The Supabase env vars validate through the same Zod layer as the site URL, with
obvious placeholder defaults (`https://placeholder.supabase.co`,
`placeholder-publishable-key`). `build`, tests and CI therefore never need real
credentials. `isSupabaseConfigured` detects the placeholders and the auth
actions return a clear French "not configured" message instead of failing
obscurely.

### Route group to separate marketing chrome from app chrome

The marketing header/footer moved from the root layout into an
`app/(marketing)/layout.tsx` route group. The root layout is now just
`<html>/<body>` + fonts + metadata. This lets the auth pages and the
authenticated dashboard render their own chrome without the marketing nav
(which would otherwise show "Connexion / Commencer" on the logged-in dashboard).

### Safe redirects only

Proxy and the `/auth/confirm` callback redirect to **fixed internal paths**
(`/connexion`, `/dashboard`) and clear the query string. No user-supplied
`redirect`/`next` parameter is honored anywhere, eliminating open-redirect
risk. Supabase errors are mapped to a curated French dictionary
(`src/lib/auth/errors.ts`); a raw Supabase message is never shown to the user.

### No new test dependencies

The testing requirement (form rendering, redirect, mocked-session behavior) is
met without adding jsdom or a testing-library: pure logic (validation, error
mapping, DAL, actions) is unit-tested with Vitest + `vi.mock`, and the login/
register forms are rendered with the built-in `react-dom/server`
`renderToStaticMarkup`. Consistent with the project's "minimal dependencies"
stance.

### Footer legal/contact de-linked

Because `/dashboard` is now protected, the footer's Mentions légales /
Politique / Contact placeholders (which used to point at `/dashboard`) would
send anonymous visitors to a login redirect — misleading. They are now rendered
as non-link "à venir" placeholders until the real pages exist.

## Milestone 1.1 — Conversion-focused homepage refinement

### Motion without an animation library

Requirement: restrained, performant, reduced-motion-safe animation. We use
CSS transitions + a single `IntersectionObserver` (the `Reveal` wrapper)
rather than Framer Motion. Rationale:

- The needed effects (scroll reveal, entrance rise, sticky-nav transition,
  progress bars, hover states, smooth `<details>`) are all expressible in CSS.
- Framer Motion would add a client-side dependency and ship more JS for no
  material simplification here.
- **No dependencies were added in this milestone.**

Accessibility of the reveal primitive is layered: the hidden state lives only
inside `@media (prefers-reduced-motion: no-preference)`, so reduced-motion
users are never left with invisible content; a `<noscript>` override forces
visibility without JS; and only opacity/transform animate, so there is no
cumulative layout shift. Tests assert both guards.

### Client components kept to the minimum

Server-first is preserved. Only four client islands exist: `SiteHeader`
(sticky + mobile menu), `WorkflowDemo` (auto-advancing accessible tabs),
`Pricing` (billing-period preview toggle) and `Reveal`. The template gallery
and FAQ use native `<details>` for interactivity, so they stay server-rendered
and keyboard-accessible for free.

### Honesty encoded in data + tests

The brief forbids guaranteed results, invented metrics/testimonials, fake
discounts and any purchase path on the unavailable Growth plan. These are
enforced structurally, not just by copy review:

- `pricingPlanSchema` refuses an `available: false` plan that carries a
  non-null CTA href, so Growth can never link to a checkout.
- `ButtonLink` renders a disabled `<button>` (not a link) when `href` is null.
- The annual toggle is a clearly-labelled preview and shows exactly 12×
  the monthly price (no discount claimed) — billing is not implemented.
- A test scans all marketing copy for ROAS/CAC, percentages and
  guaranteed-results phrasing, and asserts the "guarantee" FAQ answer denies
  any guarantee.

### Comparison framed by workflow, not competitors

The comparison names workflow categories (generic AI chat, page builder,
freelance/agency, AdvertoAI) rather than real products, and carries no prices
— avoiding defamatory or fabricated claims while still positioning the tool.
A test asserts no euro amounts appear in the comparison data.

### Richer, still-centralized content model

`content.ts` now holds typed, Zod-validated structures for navigation,
workflow steps, templates, capabilities, pricing, comparison rows and FAQ.
Availability is modelled as an explicit `launch | soon` enum so "current vs
planned" is data, not prose — the UI renders the labels from it.

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
