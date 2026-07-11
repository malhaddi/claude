import { z } from "zod";

/**
 * Public (non-secret) environment variables, validated with Zod.
 * Secrets (Supabase, Stripe, AI providers) will be added in later
 * milestones as server-only variables — never expose them via NEXT_PUBLIC_*.
 */

// Treat present-but-empty variables as unset so defaults apply.
const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    emptyToUndefined,
    z.url().default("http://localhost:3000"),
  ),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(raw: Record<string, string | undefined>): Env {
  return envSchema.parse(raw);
}

export const env = parseEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
