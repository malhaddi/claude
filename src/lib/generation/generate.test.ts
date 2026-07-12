import { describe, expect, it } from "vitest";

import {
  AiNotConfiguredError,
  AiProviderError,
  AiRateLimitError,
  type AiCompletion,
  type AiProvider,
} from "@/lib/ai/types";
import { runGeneration } from "@/lib/generation/generate";
import { PROMPT_VERSION, type GenerationContext } from "@/lib/generation/prompt";
import type { Project } from "@/lib/projects/types";
import type { ProjectResearch } from "@/lib/projects/research-types";

const VALID_JSON = JSON.stringify({
  headline: "Un rasage plus doux",
  subheadline: null,
  introduction: "Le matin mérite mieux.",
  body_sections: [
    { id: "raison-1", type: "reason", heading: "Douceur", body: "Peau apaisée." },
  ],
  call_to_action_text: "Essayer",
  disclaimer: null,
});

type Scripted = { text: string } | { throws: Error };

/** A provider whose responses are scripted; records how many times it is called. */
function scriptedProvider(script: Scripted[]) {
  const state = { calls: 0 };
  const provider: AiProvider = {
    provider: "mock",
    model: "mock-model-1",
    async complete(): Promise<AiCompletion> {
      const step = script[Math.min(state.calls, script.length - 1)];
      state.calls += 1;
      if ("throws" in step) throw step.throws;
      return {
        text: step.text,
        modelProvider: "mock",
        modelName: "mock-model-1",
      };
    },
  };
  return { provider, state };
}

const ctx: GenerationContext = {
  project: { id: "p1", name: "P" } as Project,
  research: {
    id: "r1",
    customer_awareness_level: "problem_aware",
    preferred_tone: "editorial",
  } as ProjectResearch,
  frameworkKey: "five_reasons",
};

describe("runGeneration", () => {
  it("returns a validated draft on a valid first response (called once, no retry)", async () => {
    const { provider, state } = scriptedProvider([{ text: VALID_JSON }]);
    const result = await runGeneration(provider, ctx);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.headline).toBe("Un rasage plus doux");
      expect(result.modelProvider).toBe("mock");
      expect(result.modelName).toBe("mock-model-1");
      expect(result.promptVersion).toBe(PROMPT_VERSION);
    }
    expect(state.calls).toBe(1);
  });

  it("repairs exactly once: invalid then valid → ok (called twice)", async () => {
    const { provider, state } = scriptedProvider([
      { text: "pas du json" },
      { text: VALID_JSON },
    ]);
    const result = await runGeneration(provider, ctx);
    expect(result.ok).toBe(true);
    expect(state.calls).toBe(2);
  });

  it("fails safely when the repair is still invalid (called twice, not stored)", async () => {
    const { provider, state } = scriptedProvider([
      { text: "encore faux" },
      { text: "{ toujours invalide }" },
    ]);
    const result = await runGeneration(provider, ctx);
    expect(result).toEqual({ ok: false, reason: "failed" });
    expect(state.calls).toBe(2);
  });

  it("does NOT auto-retry a rate limit (called once)", async () => {
    const { provider, state } = scriptedProvider([
      { throws: new AiRateLimitError() },
      { text: VALID_JSON },
    ]);
    const result = await runGeneration(provider, ctx);
    expect(result).toEqual({ ok: false, reason: "rate_limited" });
    expect(state.calls).toBe(1);
  });

  it("maps a not-configured provider error", async () => {
    const { provider, state } = scriptedProvider([
      { throws: new AiNotConfiguredError() },
    ]);
    const result = await runGeneration(provider, ctx);
    expect(result).toEqual({ ok: false, reason: "not_configured" });
    expect(state.calls).toBe(1);
  });

  it("maps a generic provider error to a safe failure", async () => {
    const { provider, state } = scriptedProvider([
      { throws: new AiProviderError() },
    ]);
    const result = await runGeneration(provider, ctx);
    expect(result).toEqual({ ok: false, reason: "failed" });
    expect(state.calls).toBe(1);
  });
});
