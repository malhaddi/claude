"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Heart,
  MessageCircle,
  Trash2,
  TrendingUp,
} from "lucide-react";

import {
  getServerSnapshot,
  getSnapshot,
  platformMeta,
  removeCompetitor,
  subscribe,
  type Competitor,
} from "@/lib/competitors";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddCompetitorDialog } from "@/components/competitors/add-competitor-dialog";
import { Sparkline } from "@/components/competitors/sparkline";

type SortKey =
  | "name"
  | "followers"
  | "engagementRate"
  | "postsPerWeek"
  | "growthPct";

type SortDir = "asc" | "desc";

const compactFmt = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function PlatformBadge({ platform }: { platform: Competitor["platform"] }) {
  const meta = platformMeta[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        meta.chip
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function CompetitorTable() {
  const competitors = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [sortKey, setSortKey] = React.useState<SortKey>("followers");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [selected, setSelected] = React.useState<Competitor | null>(null);

  const sorted = React.useMemo(() => {
    const rows = [...competitors];
    rows.sort((a, b) => {
      let cmp: number;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = a[sortKey] - b[sortKey];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [competitors, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      // Names default A→Z, numbers default high→low.
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const avgEngagement = competitors.length
    ? competitors.reduce((s, c) => s + c.engagementRate, 0) /
      competitors.length
    : 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="size-3" />
            Sample data
          </Badge>
          <span className="text-muted-foreground text-sm">
            {competitors.length} tracked · {avgEngagement.toFixed(2)}% avg
            engagement
          </span>
        </div>
        <AddCompetitorDialog />
      </div>

      {/* Table */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <SortableHead
                label="Account"
                active={sortKey === "name"}
                dir={sortDir}
                onClick={() => toggleSort("name")}
              />
              <SortableHead
                label="Followers"
                align="right"
                active={sortKey === "followers"}
                dir={sortDir}
                onClick={() => toggleSort("followers")}
              />
              <SortableHead
                label="Engagement"
                align="right"
                active={sortKey === "engagementRate"}
                dir={sortDir}
                onClick={() => toggleSort("engagementRate")}
              />
              <SortableHead
                label="Posts / wk"
                align="right"
                active={sortKey === "postsPerWeek"}
                dir={sortDir}
                onClick={() => toggleSort("postsPerWeek")}
              />
              <SortableHead
                label="Growth (30d)"
                align="right"
                active={sortKey === "growthPct"}
                dir={sortDir}
                onClick={() => toggleSort("growthPct")}
              />
              <TableHead>Trend</TableHead>
              <TableHead>Latest post</TableHead>
              <TableHead className="w-10" aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((c) => {
              const positive = c.growthPct >= 0;
              const latest = c.recentPosts[0];
              return (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(c)}
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          @{c.handle}
                        </span>
                        <PlatformBadge platform={c.platform} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {compactFmt.format(c.followers)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.engagementRate.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.postsPerWeek.toFixed(1)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium tabular-nums",
                      positive ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {positive ? "+" : ""}
                    {c.growthPct.toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <Sparkline data={c.growthSeries} positive={positive} />
                  </TableCell>
                  <TableCell className="max-w-[180px]">
                    {latest ? (
                      <div className="flex flex-col">
                        <span className="truncate text-sm">{latest.title}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(latest.date)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Stop tracking ${c.name}`}
                      className="text-muted-foreground hover:text-destructive size-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCompetitor(c.id);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-muted-foreground py-10 text-center text-sm"
                >
                  No competitors tracked yet. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail dialog */}
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.name}
                  <PlatformBadge platform={selected.platform} />
                </DialogTitle>
                <DialogDescription>
                  @{selected.handle} · {compactFmt.format(selected.followers)}{" "}
                  followers · {selected.engagementRate.toFixed(2)}% engagement
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-3 py-2">
                <Stat label="Followers" value={compactFmt.format(selected.followers)} />
                <Stat
                  label="Posts / week"
                  value={selected.postsPerWeek.toFixed(1)}
                />
                <Stat
                  label="Growth 30d"
                  value={`${selected.growthPct >= 0 ? "+" : ""}${selected.growthPct.toFixed(1)}%`}
                  positive={selected.growthPct >= 0}
                />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Recent posts</h3>
                <div className="space-y-2">
                  {selected.recentPosts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {p.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(p.date)}
                        </p>
                      </div>
                      <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="size-3" />
                          {compactFmt.format(p.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="size-3" />
                          {compactFmt.format(p.comments)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableHead({
  label,
  align = "left",
  active,
  dir,
  onClick,
}: {
  label: string;
  align?: "left" | "right";
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={align === "right" ? "text-right" : undefined}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          align === "right" && "flex-row-reverse",
          active && "text-foreground"
        )}
      >
        {label}
        <Icon className="size-3.5" />
      </button>
    </TableHead>
  );
}

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-muted/40 rounded-lg border p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p
        className={cn(
          "text-lg font-semibold tabular-nums",
          positive === true && "text-emerald-400",
          positive === false && "text-rose-400"
        )}
      >
        {value}
      </p>
    </div>
  );
}
