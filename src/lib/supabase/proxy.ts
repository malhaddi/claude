import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/** Paths that require an authenticated (and confirmed) user. */
const PROTECTED_PREFIXES = ["/dashboard"];
/** Auth pages that an already-authenticated user should not see. */
const AUTH_PATHS = ["/connexion", "/inscription"];

/** Deletes Supabase auth cookies from the request and marks them for deletion
 *  on the response — deterministic, no network round-trip. Returns the names. */
function clearSupabaseCookies(
  request: NextRequest,
  response: NextResponse,
): void {
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith("sb-")) {
      request.cookies.delete(cookie.name);
      response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
    }
  }
}

/**
 * Refreshes the Supabase session cookie on every matched request and performs
 * *optimistic* auth redirects (Next.js 16 guidance: the proxy is a first
 * check, not the authority — protected pages re-verify via the DAL).
 *
 * Hardening: an UNCONFIRMED session (user present but `email_confirmed_at`
 * null) is never usable — its cookies are cleared and it is treated as logged
 * out. `supabase.auth.getUser()` re-validates the token with the Supabase Auth
 * server, so this is not a naive cookie read.
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
  const confirmed = Boolean(user?.email_confirmed_at);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = AUTH_PATHS.includes(pathname);

  // Unconfirmed session must never be usable: clear it and treat as logged out.
  if (user && !confirmed) {
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/connexion";
      url.search = "?status=email_non_confirme";
      const redirectResponse = NextResponse.redirect(url);
      clearSupabaseCookies(request, redirectResponse);
      return redirectResponse;
    }
    // Elsewhere (incl. auth pages): drop the session and continue logged out.
    const nextResponse = NextResponse.next({ request });
    clearSupabaseCookies(request, nextResponse);
    return nextResponse;
  }

  // Unauthenticated user hitting a protected page → send to /connexion.
  if (!confirmed && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Confirmed user hitting an auth page → send to /dashboard.
  if (confirmed && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Must return the response carrying the refreshed cookies untouched.
  return response;
}
