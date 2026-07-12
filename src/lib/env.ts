import { z } from "zod";

/**
 * Public (non-secret) environment variables, validated with Zod.
 *
 * Only `NEXT_PUBLIC_*` values live here — they are safe to expose to the
 * browser. The Supabase URL and publishable key are public by design:
 * row-level security, not key secrecy, is what protects data. We deliberately
 * do NOT read or require a service-role/secret key anywhere in the app.
 *
 * Values fall back to obvious placeholders when unset so that `build`, tests
 * and CI never need real credentials; a real deployment sets them in the host
 * environment. A malformed (non-empty) value is still rejected.
 */

// Treat present-but-empty variables as unset so defaults apply.
const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    emptyToUndefined,
    z.url().default("http://localhost:3000"),
  ),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    emptyToUndefined,
    z.url().default("https://placeholder.supabase.co"),
  ),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.preprocess(
    emptyToUndefined,
    z.string().min(1).default("placeholder-publishable-key"),
  ),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(raw: Record<string, string | undefined>): Env {
  return envSchema.parse(raw);
}

// NEXT_PUBLIC_* references must be statically analysable so Next.js can inline
// them into the browser bundle — hence the explicit property reads below.
export const env = parseEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

/**
 * True when the Supabase env vars are real (not the build-time placeholders).
 * Lets the UI show a clear message instead of failing obscurely when someone
 * runs the app without configuring Supabase.
 */
export const isSupabaseConfigured =
  env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co" &&
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== "placeholder-publishable-key";
