"use client";

import * as React from "react";
import { ExternalLink, Newspaper, Rss } from "lucide-react";

import {
  topicMeta,
  topics,
  type NewsItem,
  type Topic,
} from "@/lib/news";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

type Filter = Topic | "all";

export function NewsFeed({
  items,
  usedSample,
}: {
  items: NewsItem[];
  usedSample: boolean;
}) {
  const [filter, setFilter] = React.useState<Filter>("all");

  const counts = React.useMemo(() => {
    const c: Record<Filter, number> = {
      all: items.length,
      tools: 0,
      research: 0,
      business: 0,
    };
    for (const item of items) c[item.topic] += 1;
    return c;
  }, [items]);

  const filtered = React.useMemo(
    () =>
      filter === "all" ? items : items.filter((i) => i.topic === filter),
    [items, filter]
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label="All"
            count={counts.all}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {topics.map((t) => (
            <FilterChip
              key={t.key}
              label={t.label}
              count={counts[t.key]}
              active={filter === t.key}
              onClick={() => setFilter(t.key)}
            />
          ))}
        </div>
        <Badge
          variant="secondary"
          className="gap-1"
          title={
            usedSample
              ? "Live feeds were unreachable; showing bundled sample articles."
              : "Aggregated from live RSS feeds."
          }
        >
          {usedSample ? (
            <>
              <Newspaper className="size-3" />
              Sample data
            </>
          ) : (
            <>
              <Rss className="size-3" />
              Live feeds
            </>
          )}
        </Badge>
      </div>

      {/* Feed */}
      <div className="grid gap-4">
        {filtered.map((item) => {
          const meta = topicMeta[item.topic];
          return (
            <Card key={item.id} className="gap-3 transition-colors hover:border-foreground/20">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-foreground font-medium">
                      {item.source}
                    </span>
                    <span>·</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium",
                      meta.chip
                    )}
                  >
                    {meta.label}
                  </span>
                </div>
                <a
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5"
                >
                  <h2 className="text-base leading-snug font-semibold group-hover:underline">
                    {item.title}
                  </h2>
                  <ExternalLink className="text-muted-foreground mt-1 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </CardHeader>
              {item.summary && (
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.summary}
                  </p>
                </CardContent>
              )}
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-muted-foreground rounded-xl border border-dashed py-12 text-center text-sm">
            No articles for this topic.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors",
        active
          ? "bg-foreground text-background border-transparent"
          : "text-muted-foreground hover:bg-accent border-border"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 text-xs tabular-nums",
          active ? "bg-background/20" : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}
