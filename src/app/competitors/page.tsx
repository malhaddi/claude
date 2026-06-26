import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { navItems } from "@/lib/navigation";

const section = navItems.find((item) => item.href === "/competitors")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

export default function CompetitorsPage() {
  return (
    <PageShell
      title={section.title}
      description={section.description}
      icon={section.icon}
      features={[
        {
          title: "Tracked accounts",
          description: "Maintain a watchlist of competitor profiles.",
        },
        {
          title: "Content benchmarks",
          description: "Compare posting cadence and engagement side by side.",
        },
        {
          title: "Top performers",
          description: "Surface the competitor content resonating right now.",
        },
      ]}
    />
  );
}
