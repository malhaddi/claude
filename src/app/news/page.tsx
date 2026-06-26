import type { Metadata } from "next";

import { navItems } from "@/lib/navigation";
import { getNews } from "@/lib/news";
import { NewsFeed } from "@/components/news/news-feed";

const section = navItems.find((item) => item.href === "/news")!;

export const metadata: Metadata = {
  title: `${section.title} · Content Hub`,
  description: section.description,
};

// Re-aggregate feeds periodically (ISR) in environments with network access.
export const revalidate = 1800;

export default async function NewsPage() {
  const Icon = section.icon;
  const { items, usedSample, sources } = await getNews();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <header className="mb-8 flex items-start gap-4">
        <div className="bg-accent text-accent-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {section.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            The latest ecommerce &amp; dropshipping news, aggregated from{" "}
            {sources.length} RSS {sources.length === 1 ? "source" : "sources"}.
            Filter by topic to focus in.
          </p>
        </div>
      </header>

      <NewsFeed items={items} usedSample={usedSample} />
    </div>
  );
}
