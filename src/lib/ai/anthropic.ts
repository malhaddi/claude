import Anthropic, { RateLimitError } from "@anthropic-ai/sdk";

import {
  AiNotConfiguredError,
  AiProviderError,
  AiRateLimitError,
  type AiCompletion,
  type AiCompletionRequest,
  type AiProvider,
} from "@/lib/ai/types";

/**
 * Anthropic Claude implementation of {@link AiProvider}.
 *
 * SECURITY: `ANTHROPIC_API_KEY` is a server-only secret. It is read from
 * `process.env` at call time (never a `NEXT_PUBLIC_*` var, so it is never
 * inlined into the browser bundle), is never logged, and is never returned to
 * the caller. Nothing here writes the key or raw provider error to stdout.
 */

export const ANTHROPIC_PROVIDER = "anthropic";
export const ANTHROPIC_MODEL = "claude-opus-4-8";
const DEFAULT_MAX_TOKENS = 16000;

export class AnthropicProvider implements AiProvider {
  readonly provider = ANTHROPIC_PROVIDER;
  readonly model = ANTHROPIC_MODEL;

  async complete(request: AiCompletionRequest): Promise<AiCompletion> {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) throw new AiNotConfiguredError();

    const client = new Anthropic({ apiKey });

    try {
      // Stream + finalMessage() avoids request timeouts at high max_tokens.
      // Adaptive thinking is the default for complex generation on Opus 4.8;
      // temperature / budget_tokens are intentionally omitted (rejected on 4.8).
      const message = await client.messages
        .stream({
          model: this.model,
          max_tokens: request.maxTokens ?? DEFAULT_MAX_TOKENS,
          thinking: { type: "adaptive" },
          system: request.system,
          messages: request.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        })
        .finalMessage();

      // Concatenate only text blocks; thinking blocks are ignored.
      const text = message.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("")
        .trim();

      if (!text) throw new AiProviderError("Empty completion");
      return {
        text,
        modelProvider: this.provider,
        modelName: this.model,
      };
    } catch (error) {
      // Normalise to neutral errors. Never re-throw the vendor error (it can
      // carry request context) and never log the key.
      if (error instanceof AiProviderError) throw error;
      if (error instanceof RateLimitError) throw new AiRateLimitError();
      throw new AiProviderError();
    }
  }
}
