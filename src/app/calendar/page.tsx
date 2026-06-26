import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { navItems } from "@/lib/navigation";

const section = navItems.find((item) => item.href === "/calendar")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

export default function CalendarPage() {
  return (
    <PageShell
      title={section.title}
      description={section.description}
      icon={section.icon}
      features={[
        {
          title: "Month view",
          description: "See everything planned, drafted or live at a glance.",
        },
        {
          title: "Drag & drop",
          description: "Reschedule content by dragging it to a new slot.",
        },
        {
          title: "Status filters",
          description: "Filter by channel, status or campaign.",
        },
      ]}
    />
  );
}
