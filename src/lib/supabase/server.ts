import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Supabase client for use in Server Components, Server Actions and Route
 * Handlers. Reads/writes the session from httpOnly cookies via Next's async
 * `cookies()` API.
 *
 * Note: writing cookies from a Server Component throws (headers already sent);
 * we swallow that specific case because the proxy (`src/proxy.ts`) is what
 * refreshes the session cookie on every request. Auth mutations happen in
 * Server Actions / Route Handlers, where cookie writes are allowed.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component render — safe to ignore; the
            // proxy refreshes the session on the next request.
          }
        },
      },
    },
  );
}
