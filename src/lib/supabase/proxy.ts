import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/** Paths that require an authenticated user. */
const PROTECTED_PREFIXES = ["/dashboard"];
/** Auth pages that an already-authenticated user should not see. */
const AUTH_PATHS = ["/connexion", "/inscription"];

/**
 * Refreshes the Supabase session cookie on every matched request and performs
 * *optimistic* auth redirects (Next.js 16 guidance: the proxy is a first
 * check, not the authority — protected pages re-verify via the DAL).
 *
 * IMPORTANT: `supabase.auth.getUser()` re-validates the token with the
 * Supabase Auth server, so this is not a naive cookie read.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = AUTH_PATHS.includes(pathname);

  // Unauthenticated user hitting a protected page → send to /connexion.
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting an auth page → send to /dashboard.
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Must return the response carrying the refreshed cookies untouched.
  return response;
}
