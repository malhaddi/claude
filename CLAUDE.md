@AGENTS.md

# Content Hub — Content Management Dashboard

A dashboard for managing social content across multiple workflows. The first
milestone scaffolds the application shell and placeholder pages for each
section; the actual feature logic is intentionally stubbed.

## Sections

| Section | Route | Purpose |
| --- | --- | --- |
| Instagram Manager | `/instagram` | Compose, schedule and triage Instagram content |
| Analytics | `/analytics` | Reach, engagement and audience-growth reporting |
| Content Calendar | `/calendar` | Unified calendar of planned/drafted/live content |
| Competitor Tracker | `/competitors` | Watch competitor accounts and benchmark them |
| News Consolidator | `/news` | Aggregate industry news and trending topics |

## Tech Stack

- **Next.js 16** (App Router, React Server Components, Turbopack) — `next build`
  runs with Turbopack.
- **React 19**
- **TypeScript 5** (strict mode) with the `@/*` path alias → `src/*`.
- **Tailwind CSS v4** — configured via CSS (`@import "tailwindcss"` and
  `@theme inline`), **not** a `tailwind.config.js`. Design tokens live in
  `src/app/globals.css`.
- **shadcn/ui** (new-york style, neutral base) — components are copied into the
  repo under `src/components/ui`, built on **Radix UI** primitives and styled
  with **class-variance-authority**, **clsx** and **tailwind-merge** (`cn`).
- **lucide-react** for icons. NOTE: the installed version (1.x) does **not**
  ship brand icons (e.g. `Instagram`), so the Instagram section uses `Camera`.
- **tw-animate-css** for the animation utilities shadcn components expect.

## Folder Structure

```
src/
  app/
    layout.tsx          # Root layout: dark theme + global AppShell chrome
    globals.css         # Tailwind v4 + shadcn design tokens (light + .dark)
    page.tsx            # "/" redirects to /instagram
    instagram/page.tsx  # One folder per section, each exports a page
    analytics/page.tsx
    calendar/page.tsx
    competitors/page.tsx
    news/page.tsx
  components/
    layout/
      app-shell.tsx     # Sidebar + mobile nav + <main> wrapper
      sidebar.tsx       # Persistent desktop sidebar (client, uses usePathname)
      mobile-nav.tsx    # Scrollable nav for small screens (client)
    page-shell.tsx      # Shared section header + placeholder feature cards
    ui/                 # shadcn/ui primitives (button, card, badge, ...)
  lib/
    navigation.ts       # Single source of truth for the section list
    utils.ts            # cn() helper
public/                 # Static assets (currently empty)
components.json         # shadcn/ui CLI config
```

## Conventions

- **Navigation is data-driven.** Sections are defined once in
  `src/lib/navigation.ts` (`navItems`). The sidebar, mobile nav and page
  headers all read from it. To add a section: add an entry there **and** create
  a matching `src/app/<route>/page.tsx`.
- **Server vs client components.** Pages and `PageShell` are server components.
  Only components that need browser APIs are marked `"use client"` — currently
  the sidebar and mobile nav (they call `usePathname` for active-link state).
- **Section pages** are thin: they look up their entry in `navItems`, export
  `metadata`, and render `<PageShell>` with placeholder `features`. Keep page
  files declarative and push shared markup into `PageShell`.
- **Styling** uses Tailwind utility classes plus the semantic design tokens
  (`bg-background`, `text-muted-foreground`, `bg-sidebar`, etc.). Prefer tokens
  over raw colors so theming stays centralized. Merge conditional classes with
  `cn()` from `@/lib/utils`.
- **shadcn/ui components** follow upstream source exactly, including the
  `data-slot` attributes and `cva` variant APIs. Add new ones under
  `src/components/ui`.

## Key Decisions

- **Global dark theme.** The app is dark-only for now: `className="dark"` is set
  on `<html>` in `src/app/layout.tsx`, activating the `.dark` token set in
  `globals.css`. The light tokens remain defined so a theme toggle can be added
  later without restyling.
- **shadcn/ui installed manually.** The sandbox network policy blocks
  `ui.shadcn.com`, so the shadcn CLI registry is unreachable. `components.json`,
  `lib/utils.ts`, the theme tokens, and each `ui/*` component were authored by
  hand from the canonical shadcn source. Dependencies were installed from npm
  (which is allowlisted). The CLI can be used later once the registry is
  reachable.
- **No `tailwind.config.js`.** Tailwind v4 is configured entirely in
  `globals.css`. Don't add a JS config unless a plugin requires it.
- **`/` redirects** to `/instagram` rather than rendering a separate landing
  page; there is no dedicated dashboard home yet.
- **Sidebar responsiveness.** A full sidebar shows on `md+`; below that a
  horizontally scrollable `MobileNav` is used instead (no drawer yet).

## Commands

```bash
npm run dev     # Start the dev server (Turbopack) on :3000
npm run build   # Production build
npm run start   # Serve the production build
npm run lint    # ESLint (eslint-config-next)
```

## Status

Scaffolding only. Every section renders its header and placeholder cards; none
of the underlying integrations (Instagram API, analytics sources, calendar
store, competitor/news ingestion) are implemented yet.
