import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Email-confirmation callback. Supabase redirects here after the user clicks
 * the link in their confirmation email.
 *
 * Supports both flows:
 * - PKCE `?code=` → exchangeCodeForSession
 * - `?token_hash=&type=` → verifyOtp (used if the email template is customized)
 *
 * On success → /dashboard. On failure → /connexion. Redirect targets are
 * FIXED internal paths — no user-controlled `next`/redirect parameter is
 * honored, so this cannot be turned into an open redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const success = new URL("/dashboard", request.nextUrl.origin);
  const failure = new URL("/connexion", request.nextUrl.origin);

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(error ? failure : success);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    return NextResponse.redirect(error ? failure : success);
  }

  return NextResponse.redirect(failure);
}
