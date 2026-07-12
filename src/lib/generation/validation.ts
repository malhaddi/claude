import { z } from "zod";

import { generationContent } from "@/lib/generation/content";
import { FRAMEWORK_KEYS, type FrameworkKey } from "@/lib/generation/frameworks";
import { MAX_USER_INSTRUCTIONS } from "@/lib/generation/prompt";

const e = generationContent.errors;

export interface GenerationInput {
  framework_key: FrameworkKey;
  user_instructions: string | null;
}

export type FieldErrors = Record<string, string>;

export type GenerationValidationResult =
  | { data: GenerationInput; fieldErrors?: undefined }
  | { data?: undefined; fieldErrors: FieldErrors };

const trimToNull = (value: unknown) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const generationSchema = z.object({
  framework_key: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : v),
    z.enum(FRAMEWORK_KEYS, { message: e.invalidFramework }),
  ),
  user_instructions: z.preprocess(
    trimToNull,
    z.string().max(MAX_USER_INSTRUCTIONS, e.instructionsTooLong).nullable(),
  ),
});

function firstErrors(issues: z.core.$ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Reads only the known generation fields from a FormData. */
export function readGenerationForm(formData: FormData): Record<string, unknown> {
  return {
    framework_key: formData.get("framework_key"),
    user_instructions: formData.get("user_instructions"),
  };
}

export function validateGeneration(
  input: Record<string, unknown>,
): GenerationValidationResult {
  const result = generationSchema.safeParse(input);
  if (!result.success) {
    return { fieldErrors: firstErrors(result.error.issues) };
  }
  return { data: result.data satisfies GenerationInput };
}
