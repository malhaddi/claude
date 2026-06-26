"use client";

import { cn } from "@/lib/utils";
import { platformMeta, platformOrder, type Platform } from "@/lib/calendar";

type PlatformFilterProps = {
  active: Platform[];
  onToggle: (platform: Platform) => void;
  onReset: () => void;
};

export function PlatformFilter({
  active,
  onToggle,
  onReset,
}: PlatformFilterProps) {
  const allActive = active.length === platformOrder.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onReset}
        aria-pressed={allActive}
        className={cn(
          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          allActive
            ? "bg-foreground text-background border-transparent"
            : "text-muted-foreground hover:bg-accent border-border"
        )}
      >
        All platforms
      </button>
      {platformOrder.map((platform) => {
        const meta = platformMeta[platform];
        const isActive = active.includes(platform);
        return (
          <button
            key={platform}
            type="button"
            onClick={() => onToggle(platform)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? meta.chip
                : "text-muted-foreground/60 border-border hover:bg-accent"
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                isActive ? meta.dot : "bg-muted-foreground/40"
              )}
            />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
