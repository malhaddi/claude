import { describe, expect, it } from "vitest";

import { generationContent } from "@/lib/generation/content";
import { MAX_USER_INSTRUCTIONS } from "@/lib/generation/prompt";
import { validateGeneration } from "@/lib/generation/validation";

const e = generationContent.errors;

describe("validateGeneration", () => {
  it("accepts a valid framework and optional instructions", () => {
    const r = validateGeneration({
      framework_key: "five_reasons",
      user_instructions: "  Mets l'accent sur la livraison rapide.  ",
    });
    expect(r.fieldErrors).toBeUndefined();
    expect(r.data).toEqual({
      framework_key: "five_reasons",
      user_instructions: "Mets l'accent sur la livraison rapide.",
    });
  });

  it("treats blank instructions as null", () => {
    const r = validateGeneration({
      framework_key: "editorial_test",
      user_instructions: "   ",
    });
    expect(r.data?.user_instructions).toBeNull();
  });

  it("rejects an unknown framework key", () => {
    const r = validateGeneration({
      framework_key: "comparison",
      user_instructions: null,
    });
    expect(r.fieldErrors?.framework_key).toBe(e.invalidFramework);
  });

  it("rejects a missing framework key", () => {
    const r = validateGeneration({
      framework_key: null,
      user_instructions: null,
    });
    expect(r.fieldErrors?.framework_key).toBeTruthy();
  });

  it("rejects instructions that exceed the limit", () => {
    const r = validateGeneration({
      framework_key: "problem_agitation_solution",
      user_instructions: "x".repeat(MAX_USER_INSTRUCTIONS + 1),
    });
    expect(r.fieldErrors?.user_instructions).toBe(e.instructionsTooLong);
  });
});
