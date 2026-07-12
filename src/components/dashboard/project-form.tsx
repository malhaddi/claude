"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

import { FormField } from "@/components/dashboard/form-field";
import { projectsContent } from "@/lib/projects/content";
import type { ProjectActionState } from "@/lib/projects/actions";
import {
  readProjectForm,
  validateProject,
  type FieldErrors,
} from "@/lib/projects/validation";
import type { Project } from "@/lib/projects/types";

const c = projectsContent.form;

type Section = {
  title: string;
  fields: Array<{
    name: keyof Project | string;
    label: string;
    type?: string;
    multiline?: boolean;
    required?: boolean;
    optional?: boolean;
    placeholder?: string;
    hint?: string;
  }>;
};

const sections: Section[] = [
  {
    title: c.sectionProject,
    fields: [
      {
        name: "name",
        label: c.nameLabel,
        required: true,
        placeholder: c.namePlaceholder,
      },
    ],
  },
  {
    title: c.sectionProduct,
    fields: [
      { name: "product_url", label: c.productUrlLabel, type: "url", optional: true, hint: c.urlHint },
      { name: "product_title", label: c.productTitleLabel, optional: true },
      { name: "product_description", label: c.productDescriptionLabel, multiline: true, optional: true },
      { name: "product_benefits", label: c.productBenefitsLabel, multiline: true, optional: true },
      { name: "product_image_url", label: c.productImageUrlLabel, type: "url", optional: true, hint: c.urlHint },
    ],
  },
  {
    title: c.sectionCampaign,
    fields: [
      { name: "target_audience", label: c.targetAudienceLabel, optional: true },
      { name: "offer_text", label: c.offerLabel, multiline: true, optional: true },
      { name: "destination_url", label: c.destinationUrlLabel, type: "url", optional: true, hint: c.urlHint },
    ],
  },
];

export function ProjectForm({
  action,
  project,
  mode,
}: {
  action: (
    state: ProjectActionState,
    formData: FormData,
  ) => Promise<ProjectActionState>;
  project: Project | null;
  mode: "create" | "edit";
}) {
  const [state, formAction, isPending] = useActionState<
    ProjectActionState,
    FormData
  >(action, {});
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const { fieldErrors } = validateProject(
      readProjectForm(new FormData(event.currentTarget)),
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

  const defaultValue = (field: string) =>
    (project?.[field as keyof Project] as string | null | undefined) ?? undefined;

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-8">
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

      {sections.map((section) => (
        <fieldset key={section.title} className="space-y-5">
          <legend className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
            {section.title}
          </legend>
          {section.fields.map((field) => (
            <FormField
              key={field.name as string}
              id={field.name as string}
              name={field.name as string}
              label={field.label}
              type={field.type}
              multiline={field.multiline}
              required={field.required}
              optional={field.optional}
              placeholder={field.placeholder}
              hint={field.hint}
              defaultValue={defaultValue(field.name as string)}
              error={errorFor(field.name as string)}
            />
          ))}
        </fieldset>
      ))}

      <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {c.backToProjects}
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "create"
            ? isPending
              ? c.createSubmitting
              : c.createSubmit
            : isPending
              ? c.saveSubmitting
              : c.saveSubmit}
        </button>
      </div>
    </form>
  );
}
