import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { navItems } from "@/lib/navigation";

const section = navItems.find((item) => item.href === "/instagram")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

export default function InstagramPage() {
  return (
    <PageShell
      title={section.title}
      description={section.description}
      icon={section.icon}
      features={[
        {
          title: "Post composer",
          description: "Draft captions, attach media and preview the grid.",
        },
        {
          title: "Scheduling queue",
          description: "Queue posts, stories and reels for the right time.",
        },
        {
          title: "Engagement inbox",
          description: "Triage comments and DMs without leaving the dashboard.",
        },
      ]}
    />
  );
}
