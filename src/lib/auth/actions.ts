"use server";

import { redirect } from "next/navigation";

import { env, isSupabaseConfigured } from "@/lib/env";
import { authContent } from "@/lib/auth/content";
import { isEmailEnumerationError, mapAuthError } from "@/lib/auth/errors";
import {
  emailSchema,
  validateLogin,
  validateRegister,
  type FieldErrors,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionState {
  fieldErrors?: FieldErrors;
  formError?: string;
  /** Show the neutral "check your inbox" notice (new OR existing email). */
  needsConfirmation?: boolean;
  /** The submitted email, so the notice can offer a "resend" action. */
  email?: string;
  /** Resend confirmation completed (always neutral). */
  resent?: boolean;
}

const emailRedirectTo = `${env.NEXT_PUBLIC_SITE_URL}/auth/confirm`;

/**
 * Sign in with email + password. Validates server-side, maps Supabase errors
 * to safe French messages, and refuses access to unconfirmed accounts (both
 * via the Supabase `email_not_confirmed` error and a post-success guard, so an
 * unconfirmed user can never obtain a usable session). Credentials never logged.
 */
export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const fieldErrors = validateLogin({ email, password });
  if (fieldErrors) return { fieldErrors };

  if (!isSupabaseConfigured) {
    return { formError: authContent.errors.notConfigured };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    if ((error.code ?? "") === "email_not_confirmed") {
      return { formError: authContent.errors.emailNotConfirmed };
    }
    return { formError: mapAuthError(error) };
  }

  // Defense in depth: if the project ever has confirmation disabled, still
  // refuse an unconfirmed account and tear down the session.
  if (!data.user?.email_confirmed_at) {
    await supabase.auth.signOut();
    return { formError: authContent.errors.emailNotConfirmed };
  }

  redirect("/dashboard");
}

/**
 * Register with email + password.
 *
 * Never creates a usable application session before email confirmation:
 * - the normal path returns session=null (confirmation email sent);
 * - if a session is unexpectedly returned for an unconfirmed user, it is
 *   signed out;
 * - only a confirmed user with a session is sent to /dashboard.
 *
 * Enumeration-safe: whether the email is new or already registered, the same
 * neutral notice is shown (existing-account errors are suppressed).
 */
export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const fieldErrors = validateRegister({ email, password, confirmPassword });
  if (fieldErrors) return { fieldErrors };

  if (!isSupabaseConfigured) {
    return { formError: authContent.errors.notConfigured };
  }

  const trimmedEmail = email.trim();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: { emailRedirectTo },
  });

  if (error) {
    // Suppress "already registered" to prevent enumeration — show the neutral
    // notice as if it succeeded. Non-enumeration errors (weak password, rate
    // limit) are safe to surface.
    if (isEmailEnumerationError(error)) {
      return { needsConfirmation: true, email: trimmedEmail };
    }
    return { formError: mapAuthError(error) };
  }

  // Confirmation disabled AND a real session returned → allowed straight in.
  if (data.user?.email_confirmed_at && data.session) {
    redirect("/dashboard");
  }

  // Otherwise the account is unconfirmed: guarantee no usable session lingers.
  if (data.session) {
    await supabase.auth.signOut();
  }

  return { needsConfirmation: true, email: trimmedEmail };
}

/**
 * Resend the confirmation email. Always returns the same neutral result
 * regardless of whether the address exists (no enumeration).
 */
export async function resendConfirmation(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();

  // Invalid address → neutral no-op (do not reveal, do not call Supabase).
  if (!emailSchema.safeParse(email).success) {
    return { resent: true, email };
  }
  if (!isSupabaseConfigured) {
    return { formError: authContent.errors.notConfigured, email };
  }

  const supabase = await createClient();
  // Ignore the outcome on purpose — the response must not reveal existence.
  await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  });

  return { resent: true, email };
}

/** Sign the current user out and return to the login page. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}
