/**
 * Analytics data layer.
 *
 * The intended source of truth is **Metricool**. Real data should be fetched
 * server-side (the Metricool API requires a private `userToken` + `blogId`
 * that must never reach the browser) — see `fetchMetricoolAnalytics` below for
 * the integration seam. Until credentials are configured the dashboard renders
 * deterministic **sample** data so the UI is fully functional offline.
 *
 * Metricool API reference: https://app.metricool.com/api (Analytics endpoints
 * such as `/v2/analytics/timelines`). Configure via env vars:
 *   METRICOOL_USER_TOKEN, METRICOOL_USER_ID, METRICOOL_BLOG_ID
 */

export type RangeKey = "7d" | "30d" | "90d";

export const ranges: { key: RangeKey; label: string; days: number }[] = [
  { key: "7d", label: "Last 7 days", days: 7 },
  { key: "30d", label: "Last 30 days", days: 30 },
  { key: "90d", label: "Last 90 days", days: 90 },
];

export type Platform = "instagram" | "facebook" | "linkedin";

export const platformMeta: Record<
  Platform,
  { label: string; color: string }
> = {
  instagram: { label: "Instagram", color: "var(--chart-1)" },
  facebook: { label: "Facebook", color: "var(--chart-2)" },
  linkedin: { label: "LinkedIn", color: "var(--chart-3)" },
};

export type DayPoint = {
  /** yyyy-mm-dd */
  date: string;
  instagram: number;
  facebook: number;
  linkedin: number;
  /** Average engagement rate for the day, as a percentage (e.g. 4.2). */
  engagementRate: number;
  /** Net new followers gained that day (can be negative). */
  followerGain: number;
};

export type TopPost = {
  id: string;
  caption: string;
  platform: Platform;
  impressions: number;
  engagementRate: number;
  date: string;
};

export type Metric = {
  /** Total / average over the selected range. */
  value: number;
  /** Percentage change vs the previous equal-length period. */
  changePct: number;
};

export type Analytics = {
  range: RangeKey;
  series: DayPoint[];
  impressions: Metric;
  engagementRate: Metric;
  followerGrowth: Metric;
  topPosts: TopPost[];
  /** Where the data came from, surfaced in the UI. */
  source: "metricool" | "sample";
};

/**
 * Fixed "as of" date so generated series are stable between server and client
 * renders (avoids hydration mismatches) and align with the rest of the demo
 * data. Swap for the live range once Metricool is wired up.
 */
const AS_OF = new Date("2026-06-26T00:00:00Z");

/** Deterministic PRNG (mulberry32) so sample data never shifts per render. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDay(offsetDaysAgo: number): string {
  const d = new Date(AS_OF);
  d.setUTCDate(d.getUTCDate() - offsetDaysAgo);
  return d.toISOString().slice(0, 10);
}

function round(n: number, dp = 0) {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

/** Build a per-day series of `days` points ending at AS_OF. */
function buildSeries(days: number, seedOffset: number): DayPoint[] {
  const rand = mulberry32(days * 1000 + seedOffset);
  const points: DayPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const t = (days - i) / days; // 0..1 over the window (slight upward trend)
    const dow = new Date(`${isoDay(i)}T00:00:00Z`).getUTCDay();
    const weekend = dow === 0 || dow === 6 ? 0.82 : 1; // lighter on weekends

    const base = (mult: number) =>
      Math.round((mult * (0.85 + t * 0.35) + rand() * mult * 0.4) * weekend);

    points.push({
      date: isoDay(i),
      instagram: base(2600),
      facebook: base(1500),
      linkedin: base(900),
      engagementRate: round(3.4 + t * 1.6 + rand() * 1.2, 2),
      followerGain: Math.round((40 + t * 60 + rand() * 70) * weekend) - 8,
    });
  }

  return points;
}

function totalImpressions(p: DayPoint) {
  return p.instagram + p.facebook + p.linkedin;
}

const SAMPLE_CAPTIONS: { caption: string; platform: Platform }[] = [
  { caption: "Unboxing the new summer collection ☀️", platform: "instagram" },
  { caption: "5 ecommerce tips that doubled our conversion", platform: "instagram" },
  { caption: "Founder Q&A: lessons from year one", platform: "linkedin" },
  { caption: "Behind the scenes of our spring shoot 🌸", platform: "instagram" },
  { caption: "Customer spotlight: how @brand grew with us", platform: "facebook" },
  { caption: "Why retention beats acquisition (a thread)", platform: "linkedin" },
];

function buildTopPosts(days: number): TopPost[] {
  const rand = mulberry32(days * 7 + 99);
  return SAMPLE_CAPTIONS.map((c, idx) => ({
    id: `top-${idx}`,
    caption: c.caption,
    platform: c.platform,
    impressions: Math.round(18000 + rand() * 42000),
    engagementRate: round(4 + rand() * 5, 2),
    date: isoDay(Math.floor(rand() * days)),
  }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5);
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return round(((current - previous) / previous) * 100, 1);
}

/**
 * Returns analytics for the selected range. Today this is deterministic sample
 * data; wire `fetchMetricoolAnalytics` in here once credentials are available.
 */
export function getAnalytics(range: RangeKey): Analytics {
  const days = ranges.find((r) => r.key === range)?.days ?? 30;
  const series = buildSeries(days, 0);
  const prevSeries = buildSeries(days, days); // previous equal-length period

  const impTotal = series.reduce((s, p) => s + totalImpressions(p), 0);
  const impPrev = prevSeries.reduce((s, p) => s + totalImpressions(p), 0);

  const engAvg =
    series.reduce((s, p) => s + p.engagementRate, 0) / series.length;
  const engPrev =
    prevSeries.reduce((s, p) => s + p.engagementRate, 0) / prevSeries.length;

  const folTotal = series.reduce((s, p) => s + p.followerGain, 0);
  const folPrev = prevSeries.reduce((s, p) => s + p.followerGain, 0);

  return {
    range,
    series,
    impressions: { value: impTotal, changePct: pctChange(impTotal, impPrev) },
    engagementRate: {
      value: round(engAvg, 2),
      changePct: pctChange(engAvg, engPrev),
    },
    followerGrowth: {
      value: folTotal,
      changePct: pctChange(folTotal, folPrev),
    },
    topPosts: buildTopPosts(days),
    source: "sample",
  };
}

/**
 * Integration seam for live Metricool data. Implement this in a Server
 * Component / route handler (never the client) and have `getAnalytics` await
 * it when `process.env.METRICOOL_USER_TOKEN` is present.
 *
 * Example shape of the real call:
 *   GET https://app.metricool.com/api/v2/analytics/timelines
 *     ?userId=...&blogId=...&start=YYYYMMDD&end=YYYYMMDD&metric=impressions
 *   Headers: { "X-Mc-Auth": METRICOOL_USER_TOKEN }
 */
export async function fetchMetricoolAnalytics(
  range: RangeKey
): Promise<Analytics | null> {
  // Not yet implemented — credentials are not configured in this environment.
  void range;
  return null;
}
