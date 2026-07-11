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
import { signIn, signOut, signUp } from "@/lib/auth/actions";
import { authContent } from "@/lib/auth/content";

const mockedCreateClient = vi.mocked(createClient);

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("signIn", () => {
  it("returns field errors and does not call Supabase on invalid input", async () => {
    const result = await signIn({}, form({ email: "bad", password: "" }));
    expect(result.fieldErrors?.email).toBeTruthy();
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard on success", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({ error: null });
    mockAuth({ signInWithPassword });
    await expect(
      signIn({}, form({ email: "user@example.fr", password: "secret" })),
    ).rejects.toThrow("REDIRECT:/dashboard");
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.fr",
      password: "secret",
    });
  });

  it("maps a Supabase error to a safe French message", async () => {
    mockAuth({
      signInWithPassword: vi
        .fn()
        .mockResolvedValue({ error: { code: "invalid_credentials" } }),
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
    const result = await signUp(
      {},
      form({
        email: "user@example.fr",
        password: "ValidPass1",
        confirmPassword: "Different1",
      }),
    );
    expect(result.fieldErrors?.confirmPassword).toBe(
      authContent.validation.confirmMismatch,
    );
  });

  it("signals confirmation needed when no session is returned", async () => {
    mockAuth({
      signUp: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    });
    const result = await signUp(
      {},
      form({
        email: "user@example.fr",
        password: "ValidPass1",
        confirmPassword: "ValidPass1",
      }),
    );
    expect(result.needsConfirmation).toBe(true);
  });

  it("redirects to /dashboard when a session is returned", async () => {
    mockAuth({
      signUp: vi
        .fn()
        .mockResolvedValue({ data: { session: { access_token: "t" } }, error: null }),
    });
    await expect(
      signUp(
        {},
        form({
          email: "user@example.fr",
          password: "ValidPass1",
          confirmPassword: "ValidPass1",
        }),
      ),
    ).rejects.toThrow("REDIRECT:/dashboard");
  });

  it("maps an already-registered error to French", async () => {
    mockAuth({
      signUp: vi
        .fn()
        .mockResolvedValue({ data: {}, error: { code: "user_already_exists" } }),
    });
    const result = await signUp(
      {},
      form({
        email: "user@example.fr",
        password: "ValidPass1",
        confirmPassword: "ValidPass1",
      }),
    );
    expect(result.formError).toBe(authContent.errors.emailAlreadyRegistered);
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
