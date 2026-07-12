import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Data Access Layer for authentication (Next.js 16 recommended pattern).
 *
 * `getUser()` calls `supabase.auth.getUser()`, which re-validates the JWT with
 * the Supabase Auth server — it is safe to trust, unlike a raw cookie/session
 * read. Memoized per-request with React `cache`.
 *
 * A user is only considered authenticated for the application once their email
 * is confirmed (`email_confirmed_at` is non-null). `requireUser()` — the
 * authoritative guard for protected server components — redirects BEFORE any
 * protected markup is produced, so no authenticated-only HTML is ever rendered
 * for an anonymous OR unconfirmed visitor. The actual session teardown of an
 * unconfirmed session is performed by the proxy (which can clear cookies).
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Whether a user has confirmed their email address. */
export function isEmailConfirmed(user: User | null | undefined): boolean {
  return Boolean(user?.email_confirmed_at);
}

/** The current user only if they exist AND have confirmed their email. */
export async function getConfirmedUser(): Promise<User | null> {
  const user = await getUser();
  return isEmailConfirmed(user) ? user : null;
}

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) {
    redirect("/connexion");
  }
  if (!isEmailConfirmed(user)) {
    // Valid session but unconfirmed email → never grant access. The proxy
    // clears the lingering session; here we just refuse to render.
    redirect("/connexion?status=email_non_confirme");
  }
  return user;
}
