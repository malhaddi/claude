"use client";

import * as React from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

import {
  buildMonthGrid,
  monthLabel,
  platformMeta,
  platformOrder,
  seedEvents,
  weekdayLabels,
  type CalendarEvent,
  type Platform,
  TODAY,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlatformFilter } from "@/components/calendar/platform-filter";

const TODAY_DATE = new Date(`${TODAY}T00:00:00Z`);

function formatLongDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const MAX_VISIBLE = 3;

function StatusIcon({ status }: { status: CalendarEvent["status"] }) {
  return status === "published" ? (
    <Check className="size-3 shrink-0" />
  ) : (
    <Clock className="size-3 shrink-0" />
  );
}

function EventChip({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick?: () => void;
}) {
  const meta = platformMeta[event.platform];
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${meta.label}: ${event.title}`}
      className={cn(
        "flex w-full items-center gap-1 rounded border px-1.5 py-0.5 text-left text-[11px] leading-tight transition-opacity hover:opacity-80",
        meta.chip,
        event.status === "scheduled" && "border-dashed"
      )}
    >
      <StatusIcon status={event.status} />
      <span className="truncate">{event.title}</span>
    </button>
  );
}

export function ContentCalendar() {
  // Default view = month of TODAY.
  const [year, setYear] = React.useState(TODAY_DATE.getUTCFullYear());
  const [month, setMonth] = React.useState(TODAY_DATE.getUTCMonth());
  const [active, setActive] = React.useState<Platform[]>([...platformOrder]);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);

  const grid = React.useMemo(
    () => buildMonthGrid(year, month),
    [year, month]
  );

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of seedEvents) {
      if (!active.includes(ev.platform)) continue;
      const list = map.get(ev.date);
      if (list) list.push(ev);
      else map.set(ev.date, [ev]);
    }
    return map;
  }, [active]);

  function goToMonth(delta: number) {
    const d = new Date(Date.UTC(year, month + delta, 1));
    setYear(d.getUTCFullYear());
    setMonth(d.getUTCMonth());
  }

  function goToToday() {
    setYear(TODAY_DATE.getUTCFullYear());
    setMonth(TODAY_DATE.getUTCMonth());
  }

  function togglePlatform(p: Platform) {
    setActive((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  const selectedEvents = selectedDay
    ? eventsByDate.get(selectedDay) ?? []
    : [];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous month"
            onClick={() => goToMonth(-1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next month"
            onClick={() => goToMonth(1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <h2 className="ml-1 text-lg font-semibold">
            {monthLabel(year, month)}
          </h2>
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        <PlatformFilter
          active={active}
          onToggle={togglePlatform}
          onReset={() => setActive([...platformOrder])}
        />
      </div>

      {/* Calendar grid */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="grid grid-cols-7 border-b">
          {weekdayLabels.map((label) => (
            <div
              key={label}
              className="text-muted-foreground px-2 py-2 text-center text-xs font-medium"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {grid.map((cell, idx) => {
            const dayEvents = eventsByDate.get(cell.date) ?? [];
            const visible = dayEvents.slice(0, MAX_VISIBLE);
            const overflow = dayEvents.length - visible.length;

            return (
              <div
                key={cell.date}
                className={cn(
                  "min-h-28 border-b border-r p-1.5 last:border-r-0",
                  idx % 7 === 6 && "border-r-0",
                  !cell.inMonth && "bg-muted/20",
                  idx >= 35 && "border-b-0"
                )}
              >
                <div className="mb-1 flex items-center justify-between px-0.5">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs",
                      cell.isToday
                        ? "bg-primary text-primary-foreground font-semibold"
                        : cell.inMonth
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                    )}
                  >
                    {cell.day}
                  </span>
                </div>

                <div className="space-y-1">
                  {visible.map((ev) => (
                    <EventChip
                      key={ev.id}
                      event={ev}
                      onClick={() => setSelectedDay(cell.date)}
                    />
                  ))}
                  {overflow > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedDay(cell.date)}
                      className="text-muted-foreground hover:text-foreground w-full px-1 text-left text-[11px]"
                    >
                      +{overflow} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <Check className="size-3" /> Published
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3" /> Scheduled (dashed)
        </span>
        <span className="text-muted-foreground/60">·</span>
        {platformOrder.map((p) => (
          <span key={p} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", platformMeta[p].dot)} />
            {platformMeta[p].label}
          </span>
        ))}
      </div>

      {/* Day detail dialog */}
      <Dialog
        open={selectedDay !== null}
        onOpenChange={(o) => !o && setSelectedDay(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDay ? formatLongDate(selectedDay) : ""}
            </DialogTitle>
            <DialogDescription>
              {selectedEvents.length}{" "}
              {selectedEvents.length === 1 ? "item" : "items"} scheduled or
              published
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {selectedEvents.map((ev) => {
              const meta = platformMeta[ev.platform];
              return (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <span
                    className={cn("size-2.5 shrink-0 rounded-full", meta.dot)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ev.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {meta.label}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
                      meta.chip,
                      ev.status === "scheduled" && "border-dashed"
                    )}
                  >
                    <StatusIcon status={ev.status} />
                    {ev.status}
                  </span>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
