import { AnthropicProvider } from "@/lib/ai/anthropic";
import type { AiProvider } from "@/lib/ai/types";

/**
 * Provider factory + configuration check. This is the only place the concrete
 * provider is chosen; the rest of the app resolves an {@link AiProvider} here so
 * a future provider swap is a one-line change.
 */

/**
 * True when the server has a usable AI credential. Reads a server-only env var
 * (not `NEXT_PUBLIC_*`), so it is safe to call only from server code. Kept as a
 * function (not a module constant) so it is evaluated per request and never
 * baked into a build.
 */
export function isProviderConfigured(): boolean {
  return (process.env.ANTHROPIC_API_KEY ?? "").trim() !== "";
}

/** Resolve the configured AI provider. */
export function getProvider(): AiProvider {
  return new AnthropicProvider();
}
