import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { navItems } from "@/lib/navigation";

const section = navItems.find((item) => item.href === "/news")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

export default function NewsPage() {
  return (
    <PageShell
      title={section.title}
      description={section.description}
      icon={section.icon}
      features={[
        {
          title: "Source feeds",
          description: "Pull in RSS, newsletters and social sources.",
        },
        {
          title: "Trending topics",
          description: "Cluster related stories into trending themes.",
        },
        {
          title: "Saved digests",
          description: "Curate stories into a shareable daily digest.",
        },
      ]}
    />
  );
}
