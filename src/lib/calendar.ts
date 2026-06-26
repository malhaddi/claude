/**
 * Content calendar data layer: platforms, events and the month-grid helper.
 *
 * Dates are plain `yyyy-mm-dd` strings and all grid math is done in UTC so the
 * calendar renders identically on the server and client (no hydration drift).
 */

export type Platform =
  | "instagram"
  | "youtube"
  | "facebook"
  | "linkedin"
  | "tiktok"
  | "x";

type PlatformMeta = {
  label: string;
  /** Tailwind classes for the colored chip. */
  chip: string;
  /** Tailwind background for the legend / filter dot. */
  dot: string;
};

export const platformMeta: Record<Platform, PlatformMeta> = {
  instagram: {
    label: "Instagram",
    chip: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    dot: "bg-fuchsia-500",
  },
  youtube: {
    label: "YouTube",
    chip: "bg-red-500/15 text-red-300 border-red-500/30",
    dot: "bg-red-500",
  },
  facebook: {
    label: "Facebook",
    chip: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    dot: "bg-blue-500",
  },
  linkedin: {
    label: "LinkedIn",
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dot: "bg-sky-500",
  },
  tiktok: {
    label: "TikTok",
    chip: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    dot: "bg-teal-500",
  },
  x: {
    label: "X",
    chip: "bg-zinc-400/15 text-zinc-300 border-zinc-400/30",
    dot: "bg-zinc-400",
  },
};

export const platformOrder: Platform[] = [
  "instagram",
  "youtube",
  "facebook",
  "linkedin",
  "tiktok",
  "x",
];

export type CalendarStatus = "scheduled" | "published";

export type CalendarEvent = {
  id: string;
  title: string;
  platform: Platform;
  status: CalendarStatus;
  /** yyyy-mm-dd */
  date: string;
};

/**
 * Fixed "today" so the demo opens on a month full of content and renders
 * consistently between server and client.
 */
export const TODAY = "2026-06-26";

/** Seed content spread across June 2026 (plus a little spill-over). */
export const seedEvents: CalendarEvent[] = [
  { id: "c1", title: "Summer collection teaser", platform: "instagram", status: "published", date: "2026-06-02" },
  { id: "c2", title: "Product demo short", platform: "youtube", status: "published", date: "2026-06-03" },
  { id: "c3", title: "Founder Q&A clip", platform: "linkedin", status: "published", date: "2026-06-05" },
  { id: "c4", title: "Behind the scenes reel", platform: "instagram", status: "published", date: "2026-06-08" },
  { id: "c5", title: "Customer story", platform: "facebook", status: "published", date: "2026-06-08" },
  { id: "c6", title: "Trend remix", platform: "tiktok", status: "published", date: "2026-06-10" },
  { id: "c7", title: "Hot take thread", platform: "x", status: "published", date: "2026-06-11" },
  { id: "c8", title: "Tutorial: setup in 5 min", platform: "youtube", status: "published", date: "2026-06-14" },
  { id: "c9", title: "Poll: next product drop", platform: "instagram", status: "published", date: "2026-06-16" },
  { id: "c10", title: "Industry news recap", platform: "linkedin", status: "published", date: "2026-06-18" },
  { id: "c11", title: "Unboxing video", platform: "youtube", status: "published", date: "2026-06-20" },
  { id: "c12", title: "Weekend sale promo", platform: "facebook", status: "published", date: "2026-06-22" },
  { id: "c13", title: "Carousel: 5 tips", platform: "instagram", status: "scheduled", date: "2026-06-27" },
  { id: "c14", title: "Dance challenge", platform: "tiktok", status: "scheduled", date: "2026-06-27" },
  { id: "c15", title: "Live AMA announcement", platform: "x", status: "scheduled", date: "2026-06-28" },
  { id: "c16", title: "New feature walkthrough", platform: "youtube", status: "scheduled", date: "2026-06-29" },
  { id: "c17", title: "Collab reel with creator", platform: "instagram", status: "scheduled", date: "2026-06-30" },
  { id: "c18", title: "Case study post", platform: "linkedin", status: "scheduled", date: "2026-06-30" },
  { id: "c19", title: "Quarter recap thread", platform: "x", status: "scheduled", date: "2026-06-30" },
  { id: "c20", title: "Month kickoff story", platform: "instagram", status: "scheduled", date: "2026-07-01" },
  { id: "c21", title: "May wrap-up", platform: "facebook", status: "published", date: "2026-05-29" },
  { id: "c22", title: "Shorts: quick tip", platform: "youtube", status: "scheduled", date: "2026-07-02" },
];

export type CalendarDay = {
  /** yyyy-mm-dd */
  date: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/** Weekday headers, Monday-first. */
export const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Build a 6×7 grid of days for the given month (Monday-first), including the
 * trailing days of the previous month and leading days of the next so every
 * week is full.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const first = new Date(Date.UTC(year, month, 1));
  // getUTCDay: 0=Sun..6=Sat. Convert to Monday-first offset (Mon=0..Sun=6).
  const offset = (first.getUTCDay() + 6) % 7;

  const start = new Date(first);
  start.setUTCDate(first.getUTCDate() - offset);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const iso = toIso(d);
    days.push({
      date: iso,
      day: d.getUTCDate(),
      inMonth: d.getUTCMonth() === month,
      isToday: iso === TODAY,
    });
  }
  return days;
}
