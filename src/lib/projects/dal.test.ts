import { beforeEach, describe, expect, it, vi } from "vitest";

// Pass-through cache so the DAL is not memoized across tests.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, cache: <T>(fn: T) => fn };
});

vi.mock("@/lib/auth/dal", () => ({ getUser: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

import { getUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { getProject, getProjects } from "@/lib/projects/dal";

const mockedGetUser = vi.mocked(getUser);
const mockedCreateClient = vi.mocked(createClient);

function listClient(result: { data: unknown; error: unknown }) {
  return {
    from: () => ({ select: () => ({ order: async () => result }) }),
  };
}
function singleClient(result: { data: unknown; error: unknown }) {
  return {
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => result }) }),
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetUser.mockResolvedValue({ id: "user-1" } as never);
});

describe("getProjects", () => {
  it("returns an empty list and issues no query when signed out", async () => {
    mockedGetUser.mockResolvedValue(null as never);
    expect(await getProjects()).toEqual([]);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("returns the user's rows", async () => {
    const rows = [{ id: "p1", name: "A" }];
    mockedCreateClient.mockResolvedValue(
      listClient({ data: rows, error: null }) as never,
    );
    expect(await getProjects()).toEqual(rows);
  });

  it("returns an empty list on error", async () => {
    mockedCreateClient.mockResolvedValue(
      listClient({ data: null, error: { message: "boom" } }) as never,
    );
    expect(await getProjects()).toEqual([]);
  });
});

describe("getProject (ownership)", () => {
  it("returns null when signed out", async () => {
    mockedGetUser.mockResolvedValue(null as never);
    expect(await getProject("p1")).toBeNull();
  });

  it("returns null for a foreign/non-existent id (RLS yields no row)", async () => {
    mockedCreateClient.mockResolvedValue(
      singleClient({ data: null, error: null }) as never,
    );
    expect(await getProject("someone-elses-id")).toBeNull();
  });

  it("returns the project when it belongs to the user", async () => {
    const row = { id: "p1", user_id: "user-1", name: "A" };
    mockedCreateClient.mockResolvedValue(
      singleClient({ data: row, error: null }) as never,
    );
    expect(await getProject("p1")).toEqual(row);
  });
});
