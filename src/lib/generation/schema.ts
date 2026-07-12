import { z } from "zod";

/**
 * Strict schema for the model's JSON output.
 *
 * The model MUST return JSON matching this exactly. We validate with Zod (not
 * the SDK's structured-output helper) so we own the contract and can run the
 * one-shot repair retry. Two invariants are enforced here, not just in the UI:
 *
 * 1. No raw HTML — every text field rejects tag-like content, so a draft can be
 *    rendered as plain structured text (never `dangerouslySetInnerHTML`).
 * 2. Bounded shape — lengths and array sizes are capped so a runaway or
 *    adversarial response cannot be stored or rendered.
 */

// Rejects opening/closing HTML tags (e.g. <b>, <a href>, </p>, <!-- -->). A
// lone "<" without a tag name (e.g. "5 < 10") is allowed.
const HTML_TAG = /<\/?[a-z!][^>]*>/i;
const noHtml = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((v) => !HTML_TAG.test(v), "HTML is not allowed");

const optionalNoHtml = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    noHtml(max).nullable().optional(),
  );

/** Stable, slug-like section id (lowercase, digits, hyphen/underscore). */
const sectionId = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9][a-z0-9_-]*$/, "Invalid section id");

/** Controlled section kinds spanning all three frameworks. */
export const SECTION_TYPES = [
  "context",
  "problem",
  "agitation",
  "solution",
  "reason",
  "benefit",
  "objection",
  "proof",
  "story",
  "step",
  "conclusion",
] as const;

export const bodySectionSchema = z.object({
  id: sectionId,
  type: z.enum(SECTION_TYPES),
  heading: noHtml(200),
  body: noHtml(4000),
  bullets: z.array(noHtml(300)).max(12).optional(),
});

export const advertorialOutputSchema = z.object({
  headline: noHtml(200),
  subheadline: optionalNoHtml(200),
  introduction: noHtml(4000),
  body_sections: z.array(bodySectionSchema).min(1).max(12),
  call_to_action_text: noHtml(200),
  disclaimer: optionalNoHtml(1000),
});

export type BodySection = z.infer<typeof bodySectionSchema>;
export type AdvertorialOutput = z.infer<typeof advertorialOutputSchema>;

/**
 * Parse a model text response into a validated draft.
 *
 * Tolerates a leading/trailing ```json fence but nothing else lax — the JSON
 * body must satisfy {@link advertorialOutputSchema}. Returns a discriminated
 * result so the caller can trigger exactly one repair retry on failure.
 */
export type ParseResult =
  | { ok: true; data: AdvertorialOutput }
  | { ok: false; error: string };

export function parseAdvertorialOutput(raw: string): ParseResult {
  const stripped = stripCodeFence(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    return { ok: false, error: "Response was not valid JSON." };
  }
  const result = advertorialOutputSchema.safeParse(parsed);
  if (!result.success) {
    return { ok: false, error: summariseIssues(result.error.issues) };
  }
  return { ok: true, data: result.data };
}

function stripCodeFence(raw: string): string {
  const trimmed = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  return fence ? fence[1].trim() : trimmed;
}

/** Short, machine-oriented issue summary fed back to the model on repair. */
function summariseIssues(issues: z.core.$ZodIssue[]): string {
  return issues
    .slice(0, 8)
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
}
