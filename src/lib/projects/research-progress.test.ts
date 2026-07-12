import { describe, expect, it } from "vitest";

import {
  computeResearchProgress,
  REQUIRED_RESEARCH_FIELDS,
} from "@/lib/projects/research-progress";

function fillAll(): Record<string, string> {
  return Object.fromEntries(REQUIRED_RESEARCH_FIELDS.map((f) => [f, "x"]));
}

describe("computeResearchProgress", () => {
  it("is 0% and not ready for an empty/absent research", () => {
    expect(computeResearchProgress(null)).toEqual({
      completed: 0,
      total: 12,
      percent: 0,
      ready: false,
    });
    expect(computeResearchProgress({})).toMatchObject({ completed: 0, ready: false });
  });

  it("counts only non-empty required fields", () => {
    const p = computeResearchProgress({
      brand_name: "Acme",
      product_category: "  ", // whitespace → not counted
      main_problem: "Douleur",
      additional_notes: "not a required field", // ignored
    });
    expect(p.completed).toBe(2);
    expect(p.total).toBe(12);
    expect(p.percent).toBe(Math.round((2 / 12) * 100));
    expect(p.ready).toBe(false);
  });

  it("is 100% and ready only when all required fields are filled", () => {
    const p = computeResearchProgress(fillAll());
    expect(p.completed).toBe(12);
    expect(p.percent).toBe(100);
    expect(p.ready).toBe(true);
  });

  it("is not ready at 11/12", () => {
    const values = fillAll();
    delete values[REQUIRED_RESEARCH_FIELDS[0]];
    const p = computeResearchProgress(values);
    expect(p.completed).toBe(11);
    expect(p.ready).toBe(false);
    expect(p.percent).toBeLessThan(100);
  });

  it("uses exactly the 12 documented required fields", () => {
    expect(REQUIRED_RESEARCH_FIELDS).toEqual([
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
    ]);
  });
});
