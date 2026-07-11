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
import { getUser, requireUser } from "@/lib/auth/dal";

const mockedCreateClient = vi.mocked(createClient);

function setUser(user: unknown) {
  mockedCreateClient.mockResolvedValue({
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUser", () => {
  it("returns null when there is no session", async () => {
    setUser(null);
    expect(await getUser()).toBeNull();
  });

  it("returns the user when authenticated", async () => {
    const user = { id: "u1", email: "user@example.fr" };
    setUser(user);
    expect(await getUser()).toEqual(user);
  });
});

describe("requireUser", () => {
  it("redirects to /connexion when unauthenticated", async () => {
    setUser(null);
    await expect(requireUser()).rejects.toThrow("REDIRECT:/connexion");
  });

  it("returns the user when authenticated (no redirect)", async () => {
    const user = { id: "u1", email: "user@example.fr" };
    setUser(user);
    expect(await requireUser()).toEqual(user);
  });
});
