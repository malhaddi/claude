import { CheckCircle2 } from "lucide-react";

import { researchContent } from "@/lib/projects/research-content";
import type { ResearchProgress } from "@/lib/projects/research-progress";
import { cx } from "@/lib/utils";

/** Transparent research-completion indicator: percentage + filled-field count. */
export function ResearchProgressBar({
  progress,
}: {
  progress: ResearchProgress;
}) {
  const p = researchContent.progress;
  const count = p.fieldsCount
    .replace("{done}", String(progress.completed))
    .replace("{total}", String(progress.total));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">{p.label}</p>
        {progress.ready ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-highlight px-2.5 py-0.5 text-xs font-semibold text-ink">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {p.ready}
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            {p.notReady}
          </span>
        )}
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={progress.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={p.label}
      >
        <div
          className={cx(
            "h-full rounded-full transition-all duration-300",
            progress.ready ? "bg-highlight" : "bg-indigo-600",
          )}
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <p className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{count}</span>
        <span className="font-semibold text-slate-700">{progress.percent}%</span>
      </p>
    </div>
  );
}
