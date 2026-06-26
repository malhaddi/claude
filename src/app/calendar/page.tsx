import type { Metadata } from "next";

import { navItems } from "@/lib/navigation";
import { ContentCalendar } from "@/components/calendar/content-calendar";

const section = navItems.find((item) => item.href === "/calendar")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

export default function CalendarPage() {
  const Icon = section.icon;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <header className="mb-8 flex items-start gap-4">
        <div className="bg-accent text-accent-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {section.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            A monthly view of scheduled and published content across every
            platform. Filter by network to focus in.
          </p>
        </div>
      </header>

      <ContentCalendar />
    </div>
  );
}
