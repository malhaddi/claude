import { z } from "zod";

import {
  awarenessValues,
  researchContent,
  toneValues,
} from "@/lib/projects/research-content";
import type { ResearchInput } from "@/lib/projects/research-types";

const e = researchContent.errors;
const MAX_TEXT = 5000;

// Trim strings; empty/whitespace → null (all research columns are nullable).
const trimToNull = (value: unknown) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const optionalText = z.preprocess(
  trimToNull,
  z.string().max(MAX_TEXT, e.tooLong).nullable(),
);

// Controlled selects: a stable internal value from the allow-list, or null.
const optionalEnum = (values: readonly string[]) =>
  z.preprocess(
    trimToNull,
    z
      .string()
      .refine((v) => values.includes(v), e.invalidOption)
      .nullable(),
  );

/** Writable research fields, in a stable order. */
export const RESEARCH_FIELDS = [
  "brand_name",
  "product_category",
  "product_price",
  "customer_age_range",
  "customer_gender",
  "customer_awareness_level",
  "main_problem",
  "desired_outcome",
  "main_promise",
  "unique_mechanism",
  "main_objections",
  "competitor_names",
  "proof_points",
  "offer_details",
  "guarantee_details",
  "urgency_details",
  "preferred_tone",
  "call_to_action",
  "additional_notes",
] as const satisfies readonly (keyof ResearchInput)[];

export const researchSchema = z.object({
  brand_name: optionalText,
  product_category: optionalText,
  product_price: optionalText,
  customer_age_range: optionalText,
  customer_gender: optionalText,
  customer_awareness_level: optionalEnum(awarenessValues),
  main_problem: optionalText,
  desired_outcome: optionalText,
  main_promise: optionalText,
  unique_mechanism: optionalText,
  main_objections: optionalText,
  competitor_names: optionalText,
  proof_points: optionalText,
  offer_details: optionalText,
  guarantee_details: optionalText,
  urgency_details: optionalText,
  preferred_tone: optionalEnum(toneValues),
  call_to_action: optionalText,
  additional_notes: optionalText,
});

export type FieldErrors = Record<string, string>;

export type ResearchValidationResult =
  | { data: ResearchInput; fieldErrors?: undefined }
  | { data?: undefined; fieldErrors: FieldErrors };

function firstErrors(issues: z.core.$ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Reads only the known research fields from a FormData. */
export function readResearchForm(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of RESEARCH_FIELDS) out[field] = formData.get(field);
  return out;
}

export function validateResearch(
  input: Record<string, unknown>,
): ResearchValidationResult {
  const result = researchSchema.safeParse(input);
  if (!result.success) {
    return { fieldErrors: firstErrors(result.error.issues) };
  }
  return { data: result.data satisfies ResearchInput };
}
