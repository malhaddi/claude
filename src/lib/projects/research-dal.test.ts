import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, cache: <T>(fn: T) => fn };
});

vi.mock("@/lib/auth/dal", () => ({ getUser: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

import { getUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { getResearch } from "@/lib/projects/research-dal";

const mockedGetUser = vi.mocked(getUser);
const mockedCreateClient = vi.mocked(createClient);

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

describe("getResearch", () => {
  it("returns null and issues no query when signed out", async () => {
    mockedGetUser.mockResolvedValue(null as never);
    expect(await getResearch("proj-1")).toBeNull();
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("returns null for a foreign/absent project (RLS yields no row)", async () => {
    mockedCreateClient.mockResolvedValue(
      singleClient({ data: null, error: null }) as never,
    );
    expect(await getResearch("someone-elses-project")).toBeNull();
  });

  it("returns the research row when it belongs to the user", async () => {
    const row = { id: "r1", project_id: "proj-1", user_id: "user-1", brand_name: "Acme" };
    mockedCreateClient.mockResolvedValue(
      singleClient({ data: row, error: null }) as never,
    );
    expect(await getResearch("proj-1")).toEqual(row);
  });
});
