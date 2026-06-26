import type { Metadata } from "next";

import { navItems } from "@/lib/navigation";
import { CompetitorTable } from "@/components/competitors/competitor-table";

const section = navItems.find((item) => item.href === "/competitors")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

export default function CompetitorsPage() {
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
            Track competitor accounts across networks — followers, engagement,
            posting frequency, growth trends and their latest posts.
          </p>
        </div>
      </header>

      <CompetitorTable />
    </div>
  );
}
