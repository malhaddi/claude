/**
 * Provider-neutral AI abstraction.
 *
 * The rest of the application depends ONLY on these types — never on a specific
 * vendor SDK. Swapping providers (or adding a second one) means writing another
 * `AiProvider` implementation; no calling code changes. Errors are normalised to
 * the neutral classes below so callers can react to "rate limited" vs. "failed"
 * without importing vendor error types.
 */

/** A single conversational turn sent to the model. */
export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

/** A provider-neutral completion request. */
export interface AiCompletionRequest {
  /** System prompt (instructions, safety rules, output contract). */
  system: string;
  /** Conversation so far (at least one user message). */
  messages: AiMessage[];
  /** Upper bound on generated tokens. */
  maxTokens?: number;
}

/** A provider-neutral completion result. */
export interface AiCompletion {
  /** The model's text output (thinking blocks excluded). */
  text: string;
  /** Stable provider id persisted with each draft (e.g. "anthropic"). */
  modelProvider: string;
  /** Concrete model id persisted with each draft (e.g. "claude-opus-4-8"). */
  modelName: string;
}

/** The seam every AI provider implements. */
export interface AiProvider {
  readonly provider: string;
  readonly model: string;
  complete(request: AiCompletionRequest): Promise<AiCompletion>;
}

/**
 * The provider is rate limited (HTTP 429 upstream). Distinct class so callers
 * can surface the exact French rate-limit message and never auto-retry.
 */
export class AiRateLimitError extends Error {
  constructor(message = "AI provider rate limited") {
    super(message);
    this.name = "AiRateLimitError";
  }
}

/**
 * Any other provider failure (network, auth, 5xx, malformed transport). The
 * message is intentionally generic — provider internals are never surfaced to
 * the user, and the API key is never included or logged.
 */
export class AiProviderError extends Error {
  constructor(message = "AI provider request failed") {
    super(message);
    this.name = "AiProviderError";
  }
}

/** The provider credential is missing/blank (misconfiguration, not a runtime fault). */
export class AiNotConfiguredError extends Error {
  constructor(message = "AI provider is not configured") {
    super(message);
    this.name = "AiNotConfiguredError";
  }
}
