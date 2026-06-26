import { cn } from "@/lib/utils";

type SparklineProps = {
  data: number[];
  positive?: boolean;
  className?: string;
};

/**
 * Tiny inline SVG sparkline for the growth-trend column. Pure presentational —
 * no chart library per row.
 */
export function Sparkline({ data, positive = true, className }: SparklineProps) {
  const width = 80;
  const height = 24;

  if (data.length < 2) {
    return <div className={cn("h-6 w-20", className)} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / span) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const stroke = positive ? "var(--chart-2)" : "var(--destructive)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
