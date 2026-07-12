import { describe, expect, it } from "vitest";

import {
  FRAMEWORK_KEYS,
  FRAMEWORKS,
  getFramework,
  isFrameworkKey,
} from "@/lib/generation/frameworks";

describe("frameworks", () => {
  it("exposes exactly the three allowed frameworks", () => {
    expect([...FRAMEWORK_KEYS].sort()).toEqual(
      ["editorial_test", "five_reasons", "problem_agitation_solution"].sort(),
    );
    expect(FRAMEWORKS).toHaveLength(3);
  });

  it("excludes out-of-scope frameworks (comparison/expert/medical/testimonial)", () => {
    const excluded = ["comparison", "expert", "medical", "testimonial"];
    for (const key of excluded) expect(isFrameworkKey(key)).toBe(false);
  });

  it("every framework has a stable key, label, tagline and prompt guidance", () => {
    for (const f of FRAMEWORKS) {
      expect(FRAMEWORK_KEYS).toContain(f.key);
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.tagline.length).toBeGreaterThan(0);
      expect(f.promptGuidance.length).toBeGreaterThan(0);
    }
  });

  it("looks frameworks up by key and validates keys", () => {
    expect(getFramework("five_reasons")?.label).toBeTruthy();
    expect(getFramework("nope")).toBeUndefined();
    expect(isFrameworkKey("editorial_test")).toBe(true);
    expect(isFrameworkKey(123)).toBe(false);
  });
});
