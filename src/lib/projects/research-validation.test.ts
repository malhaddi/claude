import { describe, expect, it } from "vitest";

import { researchContent } from "@/lib/projects/research-content";
import { validateResearch } from "@/lib/projects/research-validation";

const e = researchContent.errors;

describe("research validation", () => {
  it("accepts a fully empty draft (all fields null)", () => {
    const r = validateResearch({});
    expect(r.fieldErrors).toBeUndefined();
    expect(r.data?.brand_name).toBeNull();
    expect(r.data?.customer_awareness_level).toBeNull();
    expect(r.data?.preferred_tone).toBeNull();
  });

  it("trims text and nulls empty strings", () => {
    const r = validateResearch({ brand_name: "  Acme  ", product_price: "  " });
    expect(r.data?.brand_name).toBe("Acme");
    expect(r.data?.product_price).toBeNull();
  });

  it("rejects text over the length limit", () => {
    const r = validateResearch({ main_problem: "x".repeat(5001) });
    expect(r.fieldErrors?.main_problem).toBe(e.tooLong);
  });

  it("never carries user_id or project_id (identity is server-derived)", () => {
    const r = validateResearch({
      brand_name: "Acme",
      user_id: "attacker",
      project_id: "forged",
    });
    const data = r.data as unknown as Record<string, unknown>;
    expect(data).not.toHaveProperty("user_id");
    expect(data).not.toHaveProperty("project_id");
  });
});

describe("awareness-level validation (controlled)", () => {
  it("accepts a valid stable value", () => {
    const r = validateResearch({ customer_awareness_level: "problem_aware" });
    expect(r.fieldErrors).toBeUndefined();
    expect(r.data?.customer_awareness_level).toBe("problem_aware");
  });

  it("rejects a value outside the allow-list", () => {
    const r = validateResearch({ customer_awareness_level: "Conscient du problème" });
    expect(r.fieldErrors?.customer_awareness_level).toBe(e.invalidOption);
  });

  it("treats an empty selection as null", () => {
    const r = validateResearch({ customer_awareness_level: "" });
    expect(r.data?.customer_awareness_level).toBeNull();
  });
});

describe("tone validation (controlled)", () => {
  it("accepts a valid stable value", () => {
    const r = validateResearch({ preferred_tone: "premium" });
    expect(r.data?.preferred_tone).toBe("premium");
  });

  it("rejects a value outside the allow-list", () => {
    const r = validateResearch({ preferred_tone: "Premium" });
    expect(r.fieldErrors?.preferred_tone).toBe(e.invalidOption);
  });
});
