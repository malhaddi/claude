import {
  BarChart3,
  CalendarDays,
  Camera,
  Newspaper,
  Radar,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

/**
 * Single source of truth for the dashboard sections. The sidebar, page
 * headers and route metadata all read from this list so a new section only
 * needs to be added here and given a matching route under `src/app`.
 */
export const navItems: NavItem[] = [
  {
    title: "Instagram Manager",
    href: "/instagram",
    icon: Camera,
    description:
      "Plan, draft and schedule Instagram posts, stories and reels from one place.",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description:
      "Track reach, engagement and growth across every connected channel.",
  },
  {
    title: "Content Calendar",
    href: "/calendar",
    icon: CalendarDays,
    description:
      "A unified calendar view of everything that is planned, drafted or live.",
  },
  {
    title: "Competitor Tracker",
    href: "/competitors",
    icon: Radar,
    description:
      "Monitor competitor accounts and benchmark their content performance.",
  },
  {
    title: "News Consolidator",
    href: "/news",
    icon: Newspaper,
    description:
      "Aggregate industry news and trending topics into a single feed.",
  },
];
