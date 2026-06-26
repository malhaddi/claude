import type { Metadata } from "next";

import { navItems } from "@/lib/navigation";
import { InstagramManager } from "@/components/instagram/instagram-manager";

const section = navItems.find((item) => item.href === "/instagram")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

export default function InstagramPage() {
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
            Plan scheduled posts, drafts, published content and the idea
            backlog — all on one board.
          </p>
        </div>
      </header>

      <InstagramManager />
    </div>
  );
}
