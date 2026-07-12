import { beforeEach, describe, expect, it, vi } from "vitest";

// Make React's `cache` a pass-through so getUser is not memoized across tests.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, cache: <T>(fn: T) => fn };
});

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    // Mimic Next's redirect(), which throws to halt rendering.
    throw new Error(`REDIRECT:${url}`);
  }),
}));

import { createClient } from "@/lib/supabase/server";
import {
  getConfirmedUser,
  isEmailConfirmed,
  requireUser,
} from "@/lib/auth/dal";

const mockedCreateClient = vi.mocked(createClient);

const CONFIRMED = {
  id: "u1",
  email: "user@example.fr",
  email_confirmed_at: "2026-07-11T10:00:00.000Z",
};
const UNCONFIRMED = { id: "u2", email: "new@example.fr", email_confirmed_at: null };

function setUser(user: unknown) {
  mockedCreateClient.mockResolvedValue({
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("isEmailConfirmed", () => {
  it("is true only for a non-null email_confirmed_at", () => {
    expect(isEmailConfirmed(CONFIRMED as never)).toBe(true);
    expect(isEmailConfirmed(UNCONFIRMED as never)).toBe(false);
    expect(isEmailConfirmed(null)).toBe(false);
  });
});

describe("getConfirmedUser", () => {
  it("returns the user when confirmed", async () => {
    setUser(CONFIRMED);
    expect(await getConfirmedUser()).toEqual(CONFIRMED);
  });

  it("returns null for an unconfirmed user", async () => {
    setUser(UNCONFIRMED);
    expect(await getConfirmedUser()).toBeNull();
  });

  it("returns null when signed out", async () => {
    setUser(null);
    expect(await getConfirmedUser()).toBeNull();
  });
});

describe("requireUser", () => {
  it("redirects to /connexion when unauthenticated", async () => {
    setUser(null);
    await expect(requireUser()).rejects.toThrow("REDIRECT:/connexion");
  });

  it("redirects an UNCONFIRMED user with a status indicator", async () => {
    setUser(UNCONFIRMED);
    await expect(requireUser()).rejects.toThrow(
      "REDIRECT:/connexion?status=email_non_confirme",
    );
  });

  it("returns the user only when confirmed (no redirect)", async () => {
    setUser(CONFIRMED);
    expect(await requireUser()).toEqual(CONFIRMED);
  });
});
