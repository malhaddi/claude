import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { navItems } from "@/lib/navigation";

const section = navItems.find((item) => item.href === "/analytics")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

export default function AnalyticsPage() {
  return (
    <PageShell
      title={section.title}
      description={section.description}
      icon={section.icon}
      features={[
        {
          title: "Reach & impressions",
          description: "Track how far your content travels over time.",
        },
        {
          title: "Engagement rate",
          description: "Likes, comments and saves normalised by audience size.",
        },
        {
          title: "Audience growth",
          description: "Follower trends and net growth across channels.",
        },
      ]}
    />
  );
}
