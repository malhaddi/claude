import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// A controllable stub for `client.messages.stream(...)`, hoisted so the mock
// factory can reference it. No real network call is ever made. The mocked
// RateLimitError is defined here (not imported from the SDK) so throwing it
// type-checks — the real SDK constructor takes several arguments.
const { streamMock, anthropicCtor, RateLimitError } = vi.hoisted(() => {
  class RateLimitError extends Error {
    constructor() {
      super("rate limited");
      this.name = "RateLimitError";
    }
  }
  return { streamMock: vi.fn(), anthropicCtor: vi.fn(), RateLimitError };
});

vi.mock("@anthropic-ai/sdk", () => {
  const Anthropic = vi.fn().mockImplementation((opts: unknown) => {
    anthropicCtor(opts);
    return { messages: { stream: streamMock } };
  });
  return { default: Anthropic, RateLimitError };
});

import { AnthropicProvider } from "@/lib/ai/anthropic";
import {
  AiNotConfiguredError,
  AiProviderError,
  AiRateLimitError,
} from "@/lib/ai/types";

const request = {
  system: "sys",
  messages: [{ role: "user" as const, content: "hi" }],
};

function streamReturning(finalMessage: () => Promise<unknown>) {
  streamMock.mockReturnValue({ finalMessage });
}

const ORIGINAL_KEY = process.env.ANTHROPIC_API_KEY;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ANTHROPIC_API_KEY = "test-key-not-a-real-secret";
});

afterEach(() => {
  if (ORIGINAL_KEY === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = ORIGINAL_KEY;
});

describe("AnthropicProvider", () => {
  it("throws AiNotConfiguredError when the API key is absent", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    await expect(new AnthropicProvider().complete(request)).rejects.toBeInstanceOf(
      AiNotConfiguredError,
    );
    // Never even constructs the client without a key.
    expect(anthropicCtor).not.toHaveBeenCalled();
  });

  it("returns concatenated text and model metadata on success", async () => {
    streamReturning(async () => ({
      content: [
        { type: "thinking", thinking: "…" },
        { type: "text", text: "Bonjour" },
        { type: "text", text: " le monde" },
      ],
    }));
    const result = await new AnthropicProvider().complete(request);
    expect(result.text).toBe("Bonjour le monde");
    expect(result.modelProvider).toBe("anthropic");
    expect(result.modelName).toBe("claude-opus-4-8");
    // The key is passed to the client, read from the environment.
    expect(anthropicCtor).toHaveBeenCalledWith({
      apiKey: "test-key-not-a-real-secret",
    });
  });

  it("maps a provider rate limit to AiRateLimitError", async () => {
    streamReturning(async () => {
      throw new RateLimitError();
    });
    await expect(new AnthropicProvider().complete(request)).rejects.toBeInstanceOf(
      AiRateLimitError,
    );
  });

  it("maps any other provider failure to a generic AiProviderError", async () => {
    streamReturning(async () => {
      throw new Error("socket hang up");
    });
    const error = await new AnthropicProvider()
      .complete(request)
      .catch((err) => err);
    expect(error).toBeInstanceOf(AiProviderError);
    // The generic error never leaks provider internals.
    expect(String(error)).not.toContain("socket hang up");
  });

  it("treats an empty completion as a provider error", async () => {
    streamReturning(async () => ({ content: [] }));
    await expect(new AnthropicProvider().complete(request)).rejects.toBeInstanceOf(
      AiProviderError,
    );
  });
});
