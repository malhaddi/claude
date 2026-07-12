"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { DraftPreview } from "@/components/dashboard/draft-preview";
import { SubmitButton } from "@/components/ui/submit-button";
import type { GenerationActionState } from "@/lib/generation/actions";
import { generationContent } from "@/lib/generation/content";
import { FRAMEWORKS } from "@/lib/generation/frameworks";
import type { AdvertorialDraft } from "@/lib/generation/types";

const c = generationContent;

export function GenerationForm({
  action,
  latestDraft,
}: {
  action: (
    state: GenerationActionState,
    formData: FormData,
  ) => Promise<GenerationActionState>;
  latestDraft: AdvertorialDraft | null;
}) {
  const [state, formAction, isPending] = useActionState<
    GenerationActionState,
    FormData
  >(action, {});

  // Show the freshly generated draft if we just made one, else the latest saved.
  const preview = state.draft ?? latestDraft;
  const defaultFramework = latestDraft?.framework_key ?? FRAMEWORKS[0].key;

  const frameworkError = state.fieldErrors?.framework_key;
  const instructionsError = state.fieldErrors?.user_instructions;

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-800">
            {c.form.frameworkLegend}
          </legend>
          <p className="text-xs text-slate-500">{c.form.frameworkHint}</p>
          <div className="space-y-3">
            {FRAMEWORKS.map((framework) => (
              <label
                key={framework.key}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-300 p-4 transition-colors hover:border-slate-400 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600"
              >
                <input
                  type="radio"
                  name="framework_key"
                  value={framework.key}
                  defaultChecked={framework.key === defaultFramework}
                  className="mt-1 size-4 accent-indigo-600"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">
                    {framework.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    {framework.tagline}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {frameworkError ? (
            <p className="text-sm text-rose-600">{frameworkError}</p>
          ) : null}
        </fieldset>

        <div>
          <label
            htmlFor="user_instructions"
            className="flex items-baseline justify-between gap-2 text-sm font-medium text-slate-700"
          >
            <span>{c.form.instructionsLabel}</span>
            <span className="text-xs font-normal text-slate-400">
              {c.form.optional}
            </span>
          </label>
          <textarea
            id="user_instructions"
            name="user_instructions"
            rows={3}
            placeholder={c.form.instructionsPlaceholder}
            aria-invalid={instructionsError ? true : undefined}
            aria-describedby="user_instructions-hint"
            className="mt-1.5 block w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-indigo-600"
          />
          <p id="user_instructions-hint" className="mt-1.5 text-xs text-slate-500">
            {c.form.instructionsHint}
          </p>
          {instructionsError ? (
            <p className="mt-1.5 text-sm text-rose-600">{instructionsError}</p>
          ) : null}
        </div>

        {state.formError ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {state.formError}
          </div>
        ) : null}

        <p className="text-xs text-slate-500">{c.form.safetyNote}</p>

        <div className="flex justify-end border-t border-slate-200 pt-6">
          <SubmitButton
            pending={isPending}
            idleLabel={c.form.submit}
            pendingLabel={c.form.submitting}
          />
        </div>
      </form>

      {preview ? (
        <div className="space-y-4 border-t border-slate-200 pt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              {c.result.title}
            </h2>
          </div>
          {state.success ? (
            <div
              role="status"
              className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
            >
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              {c.result.fresh}
            </div>
          ) : null}
          <DraftPreview draft={preview} />
        </div>
      ) : null}
    </div>
  );
}
