"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { FormField } from "@/components/dashboard/form-field";
import { ResearchProgressBar } from "@/components/dashboard/research-progress";
import { SelectField } from "@/components/dashboard/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ResearchActionState } from "@/lib/projects/research-actions";
import {
  awarenessLevels,
  researchContent,
  tones,
} from "@/lib/projects/research-content";
import {
  computeResearchProgress,
  REQUIRED_RESEARCH_FIELDS,
} from "@/lib/projects/research-progress";
import type { ProjectResearch } from "@/lib/projects/research-types";
import {
  readResearchForm,
  validateResearch,
  type FieldErrors,
} from "@/lib/projects/research-validation";

const c = researchContent;
const REQUIRED = new Set<string>(REQUIRED_RESEARCH_FIELDS);

type FieldType = "input" | "textarea" | "awareness" | "tone";
type FieldDef = { name: keyof ProjectResearch & string; type: FieldType };

const SECTIONS: Array<{ title: string; fields: FieldDef[]; hint?: string }> = [
  {
    title: c.sections.product,
    fields: [
      { name: "brand_name", type: "input" },
      { name: "product_category", type: "input" },
      { name: "product_price", type: "input" },
      { name: "offer_details", type: "textarea" },
    ],
  },
  {
    title: c.sections.customer,
    hint: c.customerAudienceHint,
    fields: [
      { name: "customer_age_range", type: "input" },
      { name: "customer_gender", type: "input" },
      { name: "customer_awareness_level", type: "awareness" },
    ],
  },
  {
    title: c.sections.problem,
    fields: [
      { name: "main_problem", type: "textarea" },
      { name: "desired_outcome", type: "textarea" },
      { name: "main_promise", type: "textarea" },
      { name: "unique_mechanism", type: "textarea" },
    ],
  },
  {
    title: c.sections.objections,
    fields: [
      { name: "main_objections", type: "textarea" },
      { name: "competitor_names", type: "input" },
      { name: "proof_points", type: "textarea" },
      { name: "guarantee_details", type: "textarea" },
    ],
  },
  {
    title: c.sections.campaign,
    fields: [
      { name: "urgency_details", type: "input" },
      { name: "preferred_tone", type: "tone" },
      { name: "call_to_action", type: "input" },
      { name: "additional_notes", type: "textarea" },
    ],
  },
];

export function ResearchForm({
  action,
  research,
}: {
  action: (
    state: ResearchActionState,
    formData: FormData,
  ) => Promise<ResearchActionState>;
  research: ProjectResearch | null;
}) {
  const [state, formAction, isPending] = useActionState<
    ResearchActionState,
    FormData
  >(action, {});
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [progress, setProgress] = useState(() =>
    computeResearchProgress(research ?? undefined),
  );
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Recompute the live progress and mark the form dirty on any edit.
  function handleInput() {
    if (!formRef.current) return;
    const values = Object.fromEntries(new FormData(formRef.current));
    setProgress(computeResearchProgress(values));
    setDirty(true);
  }

  // A successful save clears the dirty flag (deferred out of the effect body).
  useEffect(() => {
    if (!state.success) return;
    const raf = requestAnimationFrame(() => setDirty(false));
    return () => cancelAnimationFrame(raf);
  }, [state.success]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const { fieldErrors } = validateResearch(
      readResearchForm(new FormData(event.currentTarget)),
    );
    if (fieldErrors) {
      event.preventDefault();
      setClientErrors(fieldErrors);
      return;
    }
    setClientErrors({});
  }

  const errorFor = (field: string) =>
    clientErrors[field] ?? state.fieldErrors?.[field];
  const value = (field: keyof ProjectResearch) =>
    (research?.[field] as string | null | undefined) ?? undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      onInput={handleInput}
      noValidate
      className="space-y-8"
    >
      <ResearchProgressBar progress={progress} />

      {state.formError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.formError}
        </div>
      ) : null}

      {state.success ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {c.saved}
        </div>
      ) : null}

      {SECTIONS.map((section) => (
        <fieldset key={section.title} className="space-y-5">
          <legend className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
            {section.title}
          </legend>
          {section.hint ? (
            <p className="-mt-2 text-xs text-slate-500">{section.hint}</p>
          ) : null}
          {section.fields.map((field) => {
            const optional = !REQUIRED.has(field.name);
            if (field.type === "awareness" || field.type === "tone") {
              return (
                <SelectField
                  key={field.name}
                  id={field.name}
                  name={field.name}
                  label={c.fields[field.name]}
                  options={field.type === "awareness" ? awarenessLevels : tones}
                  defaultValue={value(field.name)}
                  optional={optional}
                  error={errorFor(field.name)}
                />
              );
            }
            return (
              <FormField
                key={field.name}
                id={field.name}
                name={field.name}
                label={c.fields[field.name]}
                multiline={field.type === "textarea"}
                optional={optional}
                defaultValue={value(field.name)}
                error={errorFor(field.name)}
              />
            );
          })}
        </fieldset>
      ))}

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <SubmitButton
          pending={isPending}
          idleLabel={c.submit}
          pendingLabel={c.submitting}
        />
      </div>
    </form>
  );
}
