import type {
  ProjectResearch,
  ResearchInput,
} from "@/lib/projects/research-types";

/**
 * Transparent research-completion score.
 *
 * A fixed set of meaningful fields must be non-empty for the research to be
 * considered "ready". The score is simply the count of filled required fields
 * over the total — incomplete drafts still save; only 100% marks it ready.
 */
export const REQUIRED_RESEARCH_FIELDS = [
  "brand_name",
  "product_category",
  "product_price",
  "customer_awareness_level",
  "main_problem",
  "desired_outcome",
  "main_promise",
  "main_objections",
  "proof_points",
  "offer_details",
  "preferred_tone",
  "call_to_action",
] as const satisfies readonly (keyof ResearchInput)[];

export interface ResearchProgress {
  completed: number;
  total: number;
  percent: number;
  ready: boolean;
}

function isFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

/** Computes progress from a research row OR a raw form-values record. */
export function computeResearchProgress(
  research: ProjectResearch | Record<string, unknown> | null | undefined,
): ResearchProgress {
  const values = (research ?? {}) as Record<string, unknown>;
  const total = REQUIRED_RESEARCH_FIELDS.length;
  const completed = REQUIRED_RESEARCH_FIELDS.filter((field) =>
    isFilled(values[field]),
  ).length;
  const percent = Math.round((completed / total) * 100);
  return { completed, total, percent, ready: completed === total };
}
