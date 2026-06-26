import {
  CheckCircle2,
  CalendarClock,
  Film,
  Image as ImageIcon,
  Images,
  Inbox,
  PenLine,
  Square,
  type LucideIcon,
} from "lucide-react";

export type PostStatus = "backlog" | "draft" | "scheduled" | "published";

export type PostType = "image" | "carousel" | "reel" | "story";

export type Post = {
  id: string;
  caption: string;
  type: PostType;
  status: PostStatus;
  /** ISO date string (yyyy-mm-dd) or null when unscheduled. */
  scheduledDate: string | null;
};

type StatusMeta = {
  label: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the status accent (badge / column header). */
  accent: string;
};

export const statusMeta: Record<PostStatus, StatusMeta> = {
  backlog: {
    label: "Backlog",
    description: "Raw ideas waiting to be picked up.",
    icon: Inbox,
    accent: "text-zinc-400 border-zinc-500/30 bg-zinc-500/10",
  },
  draft: {
    label: "Drafts",
    description: "Being written and prepared.",
    icon: PenLine,
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  scheduled: {
    label: "Scheduled",
    description: "Queued to publish on a date.",
    icon: CalendarClock,
    accent: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  },
  published: {
    label: "Published",
    description: "Live on the account.",
    icon: CheckCircle2,
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
};

/** Display order for columns, tabs and selects. */
export const statusOrder: PostStatus[] = [
  "backlog",
  "draft",
  "scheduled",
  "published",
];

type TypeMeta = {
  label: string;
  icon: LucideIcon;
};

export const typeMeta: Record<PostType, TypeMeta> = {
  image: { label: "Image", icon: ImageIcon },
  carousel: { label: "Carousel", icon: Images },
  reel: { label: "Reel", icon: Film },
  story: { label: "Story", icon: Square },
};

export const typeOrder: PostType[] = ["image", "carousel", "reel", "story"];

/** Seed content shown on first load (before anything is saved locally). */
export const seedPosts: Post[] = [
  {
    id: "seed-1",
    caption: "Behind the scenes of our spring photoshoot 🌸",
    type: "carousel",
    status: "scheduled",
    scheduledDate: "2026-07-02",
  },
  {
    id: "seed-2",
    caption: "5 ecommerce tips that doubled our conversion rate",
    type: "reel",
    status: "scheduled",
    scheduledDate: "2026-07-05",
  },
  {
    id: "seed-3",
    caption: "Customer spotlight: how @brand grew with us",
    type: "image",
    status: "draft",
    scheduledDate: null,
  },
  {
    id: "seed-4",
    caption: "Quick poll — which product drop are you most excited for?",
    type: "story",
    status: "draft",
    scheduledDate: null,
  },
  {
    id: "seed-5",
    caption: "Unboxing the new summer collection ☀️",
    type: "reel",
    status: "published",
    scheduledDate: "2026-06-20",
  },
  {
    id: "seed-6",
    caption: "Founder Q&A: lessons from year one",
    type: "image",
    status: "published",
    scheduledDate: "2026-06-14",
  },
  {
    id: "seed-7",
    caption: "Idea: collab reel with a micro-influencer",
    type: "reel",
    status: "backlog",
    scheduledDate: null,
  },
  {
    id: "seed-8",
    caption: "Idea: 'a day in the life' of the support team",
    type: "carousel",
    status: "backlog",
    scheduledDate: null,
  },
];
