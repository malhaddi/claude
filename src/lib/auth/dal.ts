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
 * `requireUser()` is the authoritative guard for protected server components:
 * it redirects to /connexion BEFORE any protected markup is produced, so no
 * authenticated-only HTML is ever rendered for an anonymous visitor.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) {
    redirect("/connexion");
  }
  return user;
}
