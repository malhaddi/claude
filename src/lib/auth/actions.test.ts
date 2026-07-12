import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

// Pretend Supabase is configured so the actions exercise the real code paths.
vi.mock("@/lib/env", () => ({
  env: {
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable",
  },
  isSupabaseConfigured: true,
}));

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

import { createClient } from "@/lib/supabase/server";
import {
  resendConfirmation,
  signIn,
  signOut,
  signUp,
} from "@/lib/auth/actions";
import { authContent } from "@/lib/auth/content";

const mockedCreateClient = vi.mocked(createClient);
const CONFIRMED_AT = "2026-07-11T10:00:00.000Z";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

function mockAuth(methods: Record<string, unknown>) {
  mockedCreateClient.mockResolvedValue({
    auth: methods,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

function validRegister(extra: Record<string, string> = {}) {
  return form({
    email: "user@example.fr",
    password: "ValidPass1",
    confirmPassword: "ValidPass1",
    ...extra,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("signIn", () => {
  it("returns field errors and does not call Supabase on invalid input", async () => {
    const result = await signIn({}, form({ email: "bad", password: "" }));
    expect(result.fieldErrors?.email).toBeTruthy();
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("redirects a CONFIRMED user to /dashboard on success", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({
      data: { user: { id: "u1", email_confirmed_at: CONFIRMED_AT } },
      error: null,
    });
    mockAuth({ signInWithPassword });
    await expect(
      signIn({}, form({ email: "user@example.fr", password: "secret" })),
    ).rejects.toThrow("REDIRECT:/dashboard");
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.fr",
      password: "secret",
    });
  });

  it("rejects an unconfirmed login (Supabase email_not_confirmed error)", async () => {
    mockAuth({
      signInWithPassword: vi
        .fn()
        .mockResolvedValue({ data: {}, error: { code: "email_not_confirmed" } }),
    });
    const result = await signIn(
      {},
      form({ email: "user@example.fr", password: "secret" }),
    );
    expect(result.formError).toBe(authContent.errors.emailNotConfirmed);
    expect(result.formError).toBe(
      "Confirmez votre adresse e-mail avant de vous connecter.",
    );
  });

  it("tears down a session if login succeeds but the email is unconfirmed", async () => {
    const signOutFn = vi.fn().mockResolvedValue({ error: null });
    mockAuth({
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: "u1", email_confirmed_at: null } },
        error: null,
      }),
      signOut: signOutFn,
    });
    const result = await signIn(
      {},
      form({ email: "user@example.fr", password: "secret" }),
    );
    expect(signOutFn).toHaveBeenCalled();
    expect(result.formError).toBe(authContent.errors.emailNotConfirmed);
  });

  it("maps a Supabase error to a safe French message", async () => {
    mockAuth({
      signInWithPassword: vi
        .fn()
        .mockResolvedValue({ data: {}, error: { code: "invalid_credentials" } }),
    });
    const result = await signIn(
      {},
      form({ email: "user@example.fr", password: "wrongpass" }),
    );
    expect(result.formError).toBe(authContent.errors.invalidCredentials);
  });
});

describe("signUp", () => {
  it("returns a confirmation-mismatch error", async () => {
    const result = await signUp({}, validRegister({ confirmPassword: "Different1" }));
    expect(result.fieldErrors?.confirmPassword).toBe(
      authContent.validation.confirmMismatch,
    );
  });

  it("shows the neutral notice when confirmation is required (no session)", async () => {
    mockAuth({
      signUp: vi.fn().mockResolvedValue({
        data: { user: { id: "u1", email_confirmed_at: null }, session: null },
        error: null,
      }),
    });
    const result = await signUp({}, validRegister());
    expect(result.needsConfirmation).toBe(true);
    expect(result.email).toBe("user@example.fr");
  });

  it("never leaves a usable session for an unconfirmed signup", async () => {
    const signOutFn = vi.fn().mockResolvedValue({ error: null });
    mockAuth({
      signUp: vi.fn().mockResolvedValue({
        // Session unexpectedly returned for an unconfirmed user.
        data: {
          user: { id: "u1", email_confirmed_at: null },
          session: { access_token: "t" },
        },
        error: null,
      }),
      signOut: signOutFn,
    });
    const result = await signUp({}, validRegister());
    expect(signOutFn).toHaveBeenCalled();
    expect(result.needsConfirmation).toBe(true);
  });

  it("redirects to /dashboard only when confirmed AND a session exists", async () => {
    mockAuth({
      signUp: vi.fn().mockResolvedValue({
        data: {
          user: { id: "u1", email_confirmed_at: CONFIRMED_AT },
          session: { access_token: "t" },
        },
        error: null,
      }),
    });
    await expect(signUp({}, validRegister())).rejects.toThrow(
      "REDIRECT:/dashboard",
    );
  });

  it("stays neutral for an already-registered email (no enumeration)", async () => {
    mockAuth({
      signUp: vi
        .fn()
        .mockResolvedValue({ data: {}, error: { code: "user_already_exists" } }),
    });
    const result = await signUp({}, validRegister());
    expect(result.needsConfirmation).toBe(true);
    expect(result.formError).toBeUndefined();
  });

  it("surfaces a non-enumeration error (weak password)", async () => {
    mockAuth({
      signUp: vi
        .fn()
        .mockResolvedValue({ data: {}, error: { code: "weak_password" } }),
    });
    const result = await signUp({}, validRegister());
    expect(result.formError).toBe(authContent.errors.weakPassword);
    expect(result.needsConfirmation).toBeUndefined();
  });
});

describe("resendConfirmation", () => {
  it("is always neutral, even for an invalid address (no Supabase call)", async () => {
    const result = await resendConfirmation({}, form({ email: "nope" }));
    expect(result.resent).toBe(true);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("calls Supabase resend for a valid address and stays neutral", async () => {
    const resend = vi.fn().mockResolvedValue({ error: null });
    mockAuth({ resend });
    const result = await resendConfirmation({}, form({ email: "user@example.fr" }));
    expect(resend).toHaveBeenCalled();
    expect(result.resent).toBe(true);
  });
});

describe("signOut", () => {
  it("signs out and redirects to /connexion", async () => {
    const signOutFn = vi.fn().mockResolvedValue({ error: null });
    mockAuth({ signOut: signOutFn });
    await expect(signOut()).rejects.toThrow("REDIRECT:/connexion");
    expect(signOutFn).toHaveBeenCalled();
  });
});
