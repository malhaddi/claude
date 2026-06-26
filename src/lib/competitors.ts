/**
 * Competitor tracking data layer.
 *
 * The intended source is **publicly available** profile/post data (platform
 * public APIs, oEmbed, YouTube Data API, RSS, etc.) fetched server-side — see
 * `fetchPublicProfile` for the integration seam. No such credentials/scrapers
 * are configured in this environment, so metrics are generated as deterministic
 * **sample** data (seeded by handle) and the UI flags them as a sample.
 *
 * Reuses the shared platform set from `calendar.ts`.
 */

import {
  TODAY,
  platformMeta,
  platformOrder,
  type Platform,
} from "@/lib/calendar";

export { platformMeta, platformOrder, type Platform };

export type RecentPost = {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  likes: number;
  comments: number;
};

export type Competitor = {
  id: string;
  name: string;
  handle: string; // without leading @
  platform: Platform;
  followers: number;
  /** Engagement rate as a percentage, e.g. 3.8. */
  engagementRate: number;
  /** Average posts per week. */
  postsPerWeek: number;
  /** 30-day follower growth, as a percentage. */
  growthPct: number;
  /** Normalised follower trend points for the sparkline. */
  growthSeries: number[];
  recentPosts: RecentPost[];
};

const STORAGE_KEY = "content-hub:competitors";
const TODAY_DATE = new Date(`${TODAY}T00:00:00Z`);

/** FNV-1a string hash → 32-bit unsigned, for deterministic seeding. */
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDaysAgo(n: number): string {
  const d = new Date(TODAY_DATE);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

const POST_TOPICS = [
  "New product reveal",
  "Behind the scenes",
  "Customer success story",
  "Quick how-to",
  "Industry hot take",
  "Weekly roundup",
  "Live event recap",
  "Team spotlight",
  "Tips & tricks",
  "Q&A session",
];

/**
 * Build a full competitor (with deterministic sample metrics) from the minimal
 * identifying fields. Same handle always yields the same numbers.
 */
export function buildCompetitor(input: {
  id?: string;
  name: string;
  handle: string;
  platform: Platform;
}): Competitor {
  const handle = input.handle.replace(/^@/, "").trim();
  const rand = mulberry32(hashString(`${handle}:${input.platform}`));

  const followers = Math.round((5 + rand() * 480) * 1000); // 5k–485k
  const engagementRate = Math.round((1.2 + rand() * 6.5) * 100) / 100;
  const postsPerWeek = Math.round((2 + rand() * 12) * 10) / 10;
  const growthPct = Math.round((rand() * 22 - 4) * 10) / 10; // -4%..+18%

  // Sparkline: 12 points trending in the direction of growthPct.
  const series: number[] = [];
  let level = 50 + rand() * 20;
  const step = growthPct / 12;
  for (let i = 0; i < 12; i++) {
    level += step + (rand() - 0.5) * 4;
    series.push(Math.round(level * 10) / 10);
  }

  const postCount = 4;
  const recentPosts: RecentPost[] = Array.from({ length: postCount }).map(
    (_, i) => {
      const topic = POST_TOPICS[Math.floor(rand() * POST_TOPICS.length)];
      return {
        id: `${handle}-p${i}`,
        title: topic,
        date: isoDaysAgo(Math.round(i * (7 / postsPerWeek) + rand() * 2)),
        likes: Math.round(followers * engagementRate * 0.01 * (0.5 + rand())),
        comments: Math.round(
          followers * engagementRate * 0.001 * (0.5 + rand())
        ),
      };
    }
  );

  return {
    id: input.id ?? `cmp-${handle}-${input.platform}`,
    name: input.name,
    handle,
    platform: input.platform,
    followers,
    engagementRate,
    postsPerWeek,
    growthPct,
    growthSeries: series,
    recentPosts,
  };
}

const SEED_INPUTS: { name: string; handle: string; platform: Platform }[] = [
  { name: "Rival Brand", handle: "rivalbrand", platform: "instagram" },
  { name: "Market Leader", handle: "marketleader", platform: "youtube" },
  { name: "Upstart Co", handle: "upstartco", platform: "tiktok" },
  { name: "Legacy Corp", handle: "legacycorp", platform: "facebook" },
  { name: "Niche Player", handle: "nicheplayer", platform: "linkedin" },
  { name: "Fast Mover", handle: "fastmover", platform: "x" },
];

export const seedCompetitors: Competitor[] = SEED_INPUTS.map(buildCompetitor);

// --- Store (localStorage-backed, useSyncExternalStore contract) ------------

let cache: Competitor[] | null = null;
const listeners = new Set<() => void>();

function load(): Competitor[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Competitor[]) : seedCompetitors;
  } catch {
    return seedCompetitors;
  }
}

function commit(next: Competitor[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable; keep in memory only.
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): Competitor[] {
  if (cache === null) cache = load();
  return cache;
}

export function getServerSnapshot(): Competitor[] {
  return seedCompetitors;
}

export function addCompetitor(input: {
  name: string;
  handle: string;
  platform: Platform;
}) {
  const competitor = buildCompetitor({
    ...input,
    id: `cmp-${input.handle.replace(/^@/, "")}-${input.platform}-${getSnapshot().length}`,
  });
  commit([competitor, ...getSnapshot()]);
}

export function removeCompetitor(id: string) {
  commit(getSnapshot().filter((c) => c.id !== id));
}

/**
 * Integration seam for live public data. Implement server-side (route handler /
 * server action) and merge the result into the store. Public sources include
 * platform oEmbed endpoints, the YouTube Data API, and public RSS feeds.
 */
export async function fetchPublicProfile(
  handle: string,
  platform: Platform
): Promise<Partial<Competitor> | null> {
  void handle;
  void platform;
  return null; // Not configured in this environment.
}
