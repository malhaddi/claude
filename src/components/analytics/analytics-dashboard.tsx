"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

import {
  getAnalytics,
  platformMeta,
  type Metric,
  type Platform,
  type RangeKey,
} from "@/lib/metricool";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DateRangeSelect } from "@/components/analytics/date-range-select";

function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function formatTick(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const impressionsConfig = {
  instagram: { label: platformMeta.instagram.label, color: "var(--chart-1)" },
  facebook: { label: platformMeta.facebook.label, color: "var(--chart-2)" },
  linkedin: { label: platformMeta.linkedin.label, color: "var(--chart-3)" },
} satisfies ChartConfig;

const followersConfig = {
  followerGain: { label: "New followers", color: "var(--chart-4)" },
} satisfies ChartConfig;

const engagementConfig = {
  engagementRate: { label: "Engagement rate", color: "var(--chart-2)" },
} satisfies ChartConfig;

function ChangeBadge({ changePct }: { changePct: number }) {
  const positive = changePct >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
        positive
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-rose-500/10 text-rose-400"
      )}
    >
      <Icon className="size-3" />
      {Math.abs(changePct)}%
    </span>
  );
}

function KpiCard({
  title,
  metric,
  format,
}: {
  title: string;
  metric: Metric;
  format: (n: number) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-center gap-2 text-3xl font-semibold tabular-nums">
          {format(metric.value)}
          <ChangeBadge changePct={metric.changePct} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-xs">
          vs. previous period
        </p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard() {
  const [range, setRange] = React.useState<RangeKey>("30d");
  const data = React.useMemo(() => getAnalytics(range), [range]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {data.source === "sample" && (
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="size-3" />
              Sample data
            </Badge>
          )}
          <span className="text-muted-foreground text-sm">
            Source: Metricool
          </span>
        </div>
        <DateRangeSelect value={range} onChange={setRange} />
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total impressions"
          metric={data.impressions}
          format={formatCompact}
        />
        <KpiCard
          title="Engagement rate"
          metric={data.engagementRate}
          format={(n) => `${n.toFixed(2)}%`}
        />
        <KpiCard
          title="Follower growth"
          metric={data.followerGrowth}
          format={(n) => `${n >= 0 ? "+" : ""}${formatCompact(n)}`}
        />
      </div>

      {/* Impressions line chart */}
      <Card>
        <CardHeader>
          <CardTitle>Impressions over time</CardTitle>
          <CardDescription>
            Daily impressions by social network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={impressionsConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <LineChart data={data.series} margin={{ left: 4, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={formatTick}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={40}
                tickFormatter={formatCompact}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelFormatter={(v) => formatTick(String(v))} />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {(Object.keys(impressionsConfig) as Platform[]).map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Follower growth bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Follower growth</CardTitle>
            <CardDescription>Net new followers per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={followersConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <BarChart data={data.series} margin={{ left: 4, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={formatTick}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatTick(String(v))}
                    />
                  }
                />
                <Bar
                  dataKey="followerGain"
                  fill="var(--color-followerGain)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Engagement rate line chart */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement rate</CardTitle>
            <CardDescription>Average daily engagement rate (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={engagementConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <LineChart data={data.series} margin={{ left: 4, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={formatTick}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                  tickFormatter={(v) => `${v}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatTick(String(v))}
                    />
                  }
                />
                <Line
                  dataKey="engagementRate"
                  type="monotone"
                  stroke="var(--color-engagementRate)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top performing posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top performing posts</CardTitle>
          <CardDescription>
            Ranked by impressions in the selected period
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="divide-border divide-y">
            {data.topPosts.map((post, idx) => (
              <div
                key={post.id}
                className="flex items-center gap-4 px-6 py-3"
              >
                <span className="text-muted-foreground w-5 text-sm font-medium tabular-nums">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{post.caption}</p>
                  <p className="text-muted-foreground text-xs">
                    {platformMeta[post.platform].label} · {formatTick(post.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCompact(post.impressions)}
                  </p>
                  <p className="text-muted-foreground text-xs">impressions</p>
                </div>
                <Badge variant="outline" className="tabular-nums">
                  {post.engagementRate.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
