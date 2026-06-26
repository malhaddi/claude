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
- **Recharts 3** for charts, wrapped by `components/ui/chart.tsx`. Recharts 3
  reads `active`/`payload`/`verticalAlign` from context rather than props, so
  the tooltip/legend content components use explicit local prop types instead
  of `React.ComponentProps<typeof Tooltip/Legend>`.

## Folder Structure

```
src/
  app/
    layout.tsx          # Root layout: dark theme + global AppShell chrome
    globals.css         # Tailwind v4 + shadcn design tokens (light + .dark)
    page.tsx            # "/" redirects to /instagram
    instagram/page.tsx  # Instagram Manager (functional board, see below)
    analytics/page.tsx  # Analytics dashboard (charts, see below)
    calendar/page.tsx   # Content Calendar (month view, see below)
    competitors/page.tsx # Remaining sections are still placeholders
    news/page.tsx
  components/
    layout/
      app-shell.tsx     # Sidebar + mobile nav + <main> wrapper
      sidebar.tsx       # Persistent desktop sidebar (client, uses usePathname)
      mobile-nav.tsx    # Scrollable nav for small screens (client)
    instagram/
      instagram-manager.tsx  # Board: stats + 4 status columns (client)
      add-post-dialog.tsx    # Dialog form to add a post idea (client)
      post-card.tsx          # Single post card with delete (client)
    analytics/
      analytics-dashboard.tsx # KPIs + line/bar charts + top posts (client)
      date-range-select.tsx   # 7/30/90-day range picker (client)
    calendar/
      content-calendar.tsx    # Month grid + day dialog (client)
      platform-filter.tsx     # Per-platform toggle chips (client)
    page-shell.tsx      # Shared section header + placeholder feature cards
    ui/                 # shadcn/ui primitives (button, card, chart, ...)
  lib/
    navigation.ts       # Single source of truth for the section list
    instagram.ts        # Post types, status/type metadata, seed data
    posts-store.ts      # localStorage-backed store (useSyncExternalStore)
    metricool.ts        # Analytics data layer + Metricool integration seam
    calendar.ts         # Platforms, calendar events, month-grid helper
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
  Only components that need browser APIs are marked `"use client"` — the
  sidebar/mobile nav (`usePathname`) and the Instagram board components (local
  UI state + the localStorage store).
- **No `setState` inside effects.** The `react-hooks/set-state-in-effect` lint
  rule is enforced. Sync external/persisted state with `useSyncExternalStore`
  (see `posts-store.ts`) and do resets in event handlers, not effects.
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

## Instagram Manager

The `/instagram` section is a working board (the other sections are still
placeholders).

- **Data model** lives in `src/lib/instagram.ts`: a `Post` has a `caption`,
  `type` (`image` | `carousel` | `reel` | `story`), `status` (`backlog` |
  `draft` | `scheduled` | `published`) and an optional `scheduledDate`. The
  `statusMeta` / `typeMeta` records hold the label, icon and accent classes for
  each value — UI reads from these, so adding a status/type is a one-place edit.
- **Board layout** (`instagram-manager.tsx`): a summary stat row plus one
  column per status (`statusOrder`), each rendering `PostCard`s. Both the
  toolbar "New post idea" button and a per-column "+" open the `AddPostDialog`
  (the per-column variant pre-selects that column's status).
- **Persistence** is client-side via `src/lib/posts-store.ts`, a localStorage
  store consumed with `useSyncExternalStore`. `getServerSnapshot` returns the
  seed data so SSR/first paint match before the client snapshot takes over.
  Mutations (`addPost`, `deletePost`) go through the store, never local
  component state.
- There is no backend yet — data is per-browser only.

## Analytics

The `/analytics` section is a working dashboard built on **Recharts** (via the
shadcn `chart` wrapper in `components/ui/chart.tsx`).

- **Charts:** an impressions-over-time line chart (one series per platform), a
  follower-growth bar chart, and an engagement-rate line chart. KPI cards show
  total impressions, average engagement rate and net follower growth, each with
  a percentage delta vs. the previous equal-length period. A date-range picker
  (7 / 30 / 90 days) drives everything.
- **Data source — Metricool.** `src/lib/metricool.ts` is the data layer. The
  intended source is the Metricool API, but it requires a private
  `userToken` + `blogId` that must be fetched **server-side**, and no
  credentials are configured in this environment. So `getAnalytics(range)`
  currently returns **deterministic sample data** (seeded PRNG, fixed `AS_OF`
  date) and the UI shows a "Sample data" badge. To go live, implement
  `fetchMetricoolAnalytics` in a Server Component / route handler and read
  `METRICOOL_USER_TOKEN` / `METRICOOL_USER_ID` / `METRICOOL_BLOG_ID` from env.
- **Why sample data is deterministic:** the series are generated from a seeded
  PRNG anchored to a fixed `AS_OF` date so server and client renders match
  (no hydration mismatch) and values don't jump between renders.

## Content Calendar

The `/calendar` section is a working month view of scheduled and published
content.

- **Month grid** (`content-calendar.tsx`): a 6×7 Monday-first grid built by
  `buildMonthGrid` in `src/lib/calendar.ts`. All date math is done in **UTC**
  (and "today" is the fixed `TODAY` constant) so the grid renders identically
  on server and client. Leading/trailing days from adjacent months are dimmed.
- **Events as colored chips:** each day shows up to 3 chips (then "+N more");
  chip color encodes the **platform** (`platformMeta`), and status is shown by
  icon + border — published = check / solid, scheduled = clock / dashed.
  Clicking any chip or "+N more" opens a day-detail dialog listing all items.
- **Platform filter** (`platform-filter.tsx`): toggle chips for Instagram,
  YouTube, Facebook, LinkedIn, TikTok and X, plus an "All platforms" reset.
  Filtering recomputes the per-day event map.
- Data is seed-only (`seedEvents`); there is no backend or scheduling write
  path yet.

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

The **Instagram Manager** (board, add/delete, localStorage persistence), the
**Analytics** dashboard (charts + KPIs on sample data) and the **Content
Calendar** (month view, platform filter) are functional. Competitor Tracker and
News Consolidator are still placeholders. There is no backend yet: Instagram
data is per-browser, analytics runs on deterministic sample data until Metricool
credentials are wired up, and the calendar is seed-only.
