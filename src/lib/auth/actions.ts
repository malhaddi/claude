"use server";

import { redirect } from "next/navigation";

import { env, isSupabaseConfigured } from "@/lib/env";
import { authContent } from "@/lib/auth/content";
import { mapAuthError } from "@/lib/auth/errors";
import { validateLogin, validateRegister, type FieldErrors } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionState {
  fieldErrors?: FieldErrors;
  formError?: string;
  needsConfirmation?: boolean;
}

/**
 * Sign in with email + password. Validates server-side (never trusting the
 * client), maps Supabase errors to safe French messages, and redirects to the
 * dashboard on success. Credentials are never logged.
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
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { formError: mapAuthError(error) };
  }

  redirect("/dashboard");
}

/**
 * Register with email + password. On success, either redirects to the
 * dashboard (if email confirmation is disabled and a session was returned) or
 * signals that a confirmation email was sent.
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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { formError: mapAuthError(error) };
  }

  // Session present → confirmation disabled → straight into the app.
  if (data.session) {
    redirect("/dashboard");
  }

  // Otherwise a confirmation email was sent.
  return { needsConfirmation: true };
}

/** Sign the current user out and return to the login page. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}
