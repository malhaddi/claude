import { generationContent } from "@/lib/generation/content";
import { getFramework } from "@/lib/generation/frameworks";
import { formatDateFr } from "@/lib/format";
import type { AdvertorialDraft } from "@/lib/generation/types";

/**
 * Read-only preview of a generated draft.
 *
 * Renders the draft as structured PLAIN TEXT. Every value is interpolated as a
 * React child (auto-escaped) — there is deliberately no `dangerouslySetInnerHTML`
 * anywhere, and the generation schema already rejects HTML in any field.
 */

const c = generationContent.result;

function statusLabel(status: string): string {
  if (status === "draft") return generationContent.status.draft;
  return generationContent.status.unknown;
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-slate-700">{value}</dd>
    </div>
  );
}

export function DraftPreview({ draft }: { draft: AdvertorialDraft }) {
  const frameworkLabel = getFramework(draft.framework_key)?.label ?? draft.framework_key;

  return (
    <article className="space-y-6">
      <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-4">
        <MetaItem label={c.framework} value={frameworkLabel} />
        <MetaItem label={c.version} value={`v${draft.generation_version}`} />
        <MetaItem label={c.createdOn} value={formatDateFr(draft.created_at)} />
        <MetaItem label={c.status} value={statusLabel(draft.status)} />
      </dl>

      <header className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {draft.headline}
        </h2>
        {draft.subheadline ? (
          <p className="text-lg text-slate-600">{draft.subheadline}</p>
        ) : null}
      </header>

      <section aria-label={c.introductionLabel}>
        <p className="whitespace-pre-line leading-7 text-slate-700">
          {draft.introduction}
        </p>
      </section>

      <div className="space-y-6">
        {draft.body_sections.map((section) => (
          <section key={section.id} className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {section.heading}
            </h3>
            <p className="whitespace-pre-line leading-7 text-slate-700">
              {section.body}
            </p>
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-slate-700">
                {section.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
        <p className="text-[11px] font-semibold tracking-wide text-indigo-500 uppercase">
          {c.ctaLabel}
        </p>
        <p className="mt-1 text-base font-semibold text-indigo-800">
          {draft.call_to_action_text}
        </p>
      </div>

      {draft.disclaimer ? (
        <p className="border-t border-slate-200 pt-4 text-xs text-slate-500">
          <span className="font-semibold">{c.disclaimerLabel} : </span>
          {draft.disclaimer}
        </p>
      ) : null}
    </article>
  );
}
