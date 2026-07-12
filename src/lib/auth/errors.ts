import { authContent } from "@/lib/auth/content";

/**
 * Maps Supabase auth errors to safe French messages. We NEVER surface a raw
 * Supabase error string to the user — every path resolves to a message from
 * the centralized auth content, defaulting to a generic message.
 */

/** Minimal shape of a Supabase AuthError we care about. */
export interface SupabaseAuthErrorLike {
  code?: string | null;
  status?: number | null;
  message?: string | null;
}

const e = authContent.errors;

/**
 * True for errors that would reveal whether an email is already registered.
 * The sign-up flow suppresses these and shows a neutral notice instead, to
 * prevent email enumeration.
 */
export function isEmailEnumerationError(
  error: SupabaseAuthErrorLike | null | undefined,
): boolean {
  if (!error) return false;
  const code = (error.code ?? "").toLowerCase();
  const message = (error.message ?? "").toLowerCase();
  return (
    code === "user_already_exists" ||
    code === "email_exists" ||
    message.includes("already registered") ||
    message.includes("already been registered")
  );
}

export function mapAuthError(error: SupabaseAuthErrorLike | null | undefined): string {
  if (!error) return e.generic;

  const code = (error.code ?? "").toLowerCase();
  const message = (error.message ?? "").toLowerCase();
  const status = error.status ?? 0;

  // Rate limiting.
  if (status === 429 || code.includes("rate_limit") || code === "over_email_send_rate_limit") {
    return e.rateLimited;
  }

  // Invalid login.
  if (code === "invalid_credentials" || code === "invalid_grant") {
    return e.invalidCredentials;
  }

  // Email not confirmed yet.
  if (code === "email_not_confirmed") {
    return e.emailNotConfirmed;
  }

  // Note: "already registered" is intentionally NOT mapped to a distinct
  // message — the sign-up flow handles it neutrally (see isEmailEnumerationError)
  // to avoid email enumeration.

  // Password rejected by Supabase policy.
  if (code === "weak_password" || message.includes("password")) {
    return e.weakPassword;
  }

  // Fall back to a message keyed on a few known messages, else generic.
  if (message.includes("invalid login credentials")) {
    return e.invalidCredentials;
  }

  return e.generic;
}
