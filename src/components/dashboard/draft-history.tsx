import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { generationContent } from "@/lib/generation/content";
import { getFramework } from "@/lib/generation/frameworks";
import { formatDateFr } from "@/lib/format";
import type { AdvertorialDraftSummary } from "@/lib/generation/types";

const c = generationContent.history;

function statusLabel(status: string): string {
  if (status === "draft") return generationContent.status.draft;
  return generationContent.status.unknown;
}

/** Read-only history of a project's generated drafts, newest version first. */
export function DraftHistory({
  projectId,
  drafts,
}: {
  projectId: string;
  drafts: AdvertorialDraftSummary[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>

      {drafts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          {c.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {drafts.map((draft) => (
            <li
              key={draft.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                    {c.version} {draft.generation_version}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {getFramework(draft.framework_key)?.label ??
                      draft.framework_key}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                    {statusLabel(draft.status)}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm font-medium text-slate-800">
                  {draft.headline}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {c.createdOn} {formatDateFr(draft.created_at)}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href={`/dashboard/projets/${projectId}/generation/${draft.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {c.open}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
