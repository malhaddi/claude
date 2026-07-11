import { z } from "zod";

import { projectsContent } from "@/lib/projects/content";
import type { ProjectInput } from "@/lib/projects/types";

const v = projectsContent.validation;
const MAX_TEXT = 5000;

/** Only http(s) URLs are accepted — blocks javascript:/data: and similar,
 *  since these URLs are later rendered as links/images. */
function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Trim strings; turn empty/whitespace into null (optional columns).
const trimToNull = (value: unknown) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const optionalUrl = z.preprocess(
  trimToNull,
  z
    .string()
    .max(2000, v.urlInvalid)
    .refine(isHttpUrl, v.urlInvalid)
    .nullable(),
);

const optionalText = z.preprocess(
  trimToNull,
  z.string().max(MAX_TEXT, v.tooLong).nullable(),
);

export const projectSchema = z.object({
  name: z.string().trim().min(1, v.nameRequired).max(120, v.nameTooLong),
  product_url: optionalUrl,
  product_title: optionalText,
  product_description: optionalText,
  product_benefits: optionalText,
  target_audience: optionalText,
  offer_text: optionalText,
  product_image_url: optionalUrl,
  destination_url: optionalUrl,
});

export type FieldErrors = Record<string, string>;

export type ValidationResult =
  | { data: ProjectInput; fieldErrors?: undefined }
  | { data?: undefined; fieldErrors: FieldErrors };

function firstErrors(issues: z.core.$ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Builds a plain object from FormData for the known project fields only. */
export function readProjectForm(formData: FormData): Record<string, unknown> {
  const fields = [
    "name",
    "product_url",
    "product_title",
    "product_description",
    "product_benefits",
    "target_audience",
    "offer_text",
    "product_image_url",
    "destination_url",
  ] as const;
  const out: Record<string, unknown> = {};
  for (const field of fields) out[field] = formData.get(field);
  return out;
}

export function validateProject(input: Record<string, unknown>): ValidationResult {
  const result = projectSchema.safeParse(input);
  if (!result.success) {
    return { fieldErrors: firstErrors(result.error.issues) };
  }
  return { data: result.data satisfies ProjectInput };
}
