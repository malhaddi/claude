import {
  AiNotConfiguredError,
  AiRateLimitError,
  type AiMessage,
  type AiProvider,
} from "@/lib/ai/types";
import {
  buildRepairPrompt,
  buildSystemPrompt,
  buildUserPrompt,
  PROMPT_VERSION,
  type GenerationContext,
} from "@/lib/generation/prompt";
import {
  parseAdvertorialOutput,
  type AdvertorialOutput,
} from "@/lib/generation/schema";

/**
 * Core generation orchestration, provider-agnostic and DB-free so it is fully
 * unit-testable with a mock provider (no real API is ever called in tests).
 *
 * Retry policy:
 * - A schema-invalid response triggers EXACTLY ONE repair attempt (the provider
 *   is called at most twice).
 * - A provider error (rate limit, misconfig, transport) is NEVER auto-retried —
 *   it returns immediately. So on a rate limit the provider is called once.
 */
export type GenerationOutcome =
  | {
      ok: true;
      output: AdvertorialOutput;
      modelProvider: string;
      modelName: string;
      promptVersion: string;
    }
  | { ok: false; reason: "rate_limited" | "not_configured" | "failed" };

export async function runGeneration(
  provider: AiProvider,
  ctx: GenerationContext,
): Promise<GenerationOutcome> {
  const system = buildSystemPrompt();
  const messages: AiMessage[] = [
    { role: "user", content: buildUserPrompt(ctx) },
  ];

  try {
    const first = await provider.complete({ system, messages });
    const parsed = parseAdvertorialOutput(first.text);
    if (parsed.ok) {
      return {
        ok: true,
        output: parsed.data,
        modelProvider: first.modelProvider,
        modelName: first.modelName,
        promptVersion: PROMPT_VERSION,
      };
    }

    // One repair retry: echo the invalid answer + the precise validation error.
    const repairMessages: AiMessage[] = [
      ...messages,
      { role: "assistant", content: first.text },
      { role: "user", content: buildRepairPrompt(parsed.error) },
    ];
    const second = await provider.complete({
      system,
      messages: repairMessages,
    });
    const reparsed = parseAdvertorialOutput(second.text);
    if (reparsed.ok) {
      return {
        ok: true,
        output: reparsed.data,
        modelProvider: second.modelProvider,
        modelName: second.modelName,
        promptVersion: PROMPT_VERSION,
      };
    }

    // Still invalid after one repair — fail safely; the caller stores nothing.
    return { ok: false, reason: "failed" };
  } catch (error) {
    if (error instanceof AiRateLimitError) {
      return { ok: false, reason: "rate_limited" };
    }
    if (error instanceof AiNotConfiguredError) {
      return { ok: false, reason: "not_configured" };
    }
    // AiProviderError or any unexpected throw: generic failure, no internals.
    return { ok: false, reason: "failed" };
  }
}
