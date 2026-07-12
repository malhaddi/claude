import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/env", () => ({ isSupabaseConfigured: true }));
vi.mock("@/lib/auth/dal", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { saveResearch } from "@/lib/projects/research-actions";
import { researchContent } from "@/lib/projects/research-content";

const mockedRequireUser = vi.mocked(requireUser);
const mockedCreateClient = vi.mocked(createClient);

/** Chainable mock: `.from(t).select().eq().eq().maybeSingle()` (project lookup)
 *  and `.from(t).upsert(values, opts)` (research write). */
function makeSupabase(config: {
  project?: { id: string } | null;
  upsertError?: unknown;
}) {
  const state = {
    tables: [] as string[],
    upsertArg: null as Record<string, unknown> | null,
    upsertOpts: null as Record<string, unknown> | null,
    eqCalls: [] as Array<[string, unknown]>,
  };
  const builder: Record<string, unknown> = {
    select() {
      return builder;
    },
    eq(key: string, value: unknown) {
      state.eqCalls.push([key, value]);
      return builder;
    },
    async maybeSingle() {
      return { data: config.project ?? null, error: null };
    },
    upsert(arg: Record<string, unknown>, opts: Record<string, unknown>) {
      state.upsertArg = arg;
      state.upsertOpts = opts;
      return builder;
    },
    then(resolve: (v: unknown) => void) {
      resolve({ error: config.upsertError ?? null });
    },
  };
  const supabase = {
    from(table: string) {
      state.tables.push(table);
      return builder;
    },
  };
  return { supabase, state };
}

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedRequireUser.mockResolvedValue({ id: "user-1", email: "a@b.fr" } as never);
});

describe("saveResearch — validation", () => {
  it("returns field errors and never touches the DB on an invalid option", async () => {
    const r = await saveResearch(
      "proj-1",
      {},
      form({ preferred_tone: "not-a-tone" }),
    );
    expect(r.fieldErrors?.preferred_tone).toBeTruthy();
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("saves an empty draft (upsert with all-null fields)", async () => {
    const { supabase, state } = makeSupabase({ project: { id: "proj-1" } });
    mockedCreateClient.mockResolvedValue(supabase as never);
    const r = await saveResearch("proj-1", {}, form({}));
    expect(r.success).toBe(true);
    expect(state.upsertArg).toMatchObject({
      project_id: "proj-1",
      user_id: "user-1",
    });
  });
});

describe("saveResearch — ownership & IDOR", () => {
  it("upserts with the session user_id and project_id (create/update)", async () => {
    const { supabase, state } = makeSupabase({ project: { id: "proj-1" } });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const r = await saveResearch(
      "proj-1",
      {},
      form({ brand_name: "Acme", customer_awareness_level: "problem_aware" }),
    );
    expect(r.success).toBe(true);
    expect(state.upsertArg).toMatchObject({
      project_id: "proj-1",
      user_id: "user-1",
      brand_name: "Acme",
    });
    // one row per project → upsert on the unique project_id
    expect(state.upsertOpts).toEqual({ onConflict: "project_id" });
  });

  it("returns notFound for a project the user does not own (no write)", async () => {
    const { supabase, state } = makeSupabase({ project: null });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const r = await saveResearch("foreign-project", {}, form({ brand_name: "X" }));
    expect(r.formError).toBe(researchContent.errors.notFound);
    expect(state.upsertArg).toBeNull(); // never attempted the write
  });

  it("ignores a user_id injected via the form (no spoofing)", async () => {
    const { supabase, state } = makeSupabase({ project: { id: "proj-1" } });
    mockedCreateClient.mockResolvedValue(supabase as never);

    await saveResearch(
      "proj-1",
      {},
      form({ brand_name: "X", user_id: "attacker", project_id: "forged" }),
    );
    expect(state.upsertArg?.user_id).toBe("user-1");
    expect(state.upsertArg?.project_id).toBe("proj-1"); // the bound arg, not the form
  });

  it("verifies ownership by id AND user_id before writing", async () => {
    const { supabase, state } = makeSupabase({ project: { id: "proj-1" } });
    mockedCreateClient.mockResolvedValue(supabase as never);
    await saveResearch("proj-1", {}, form({ brand_name: "X" }));
    expect(state.eqCalls).toEqual([
      ["id", "proj-1"],
      ["user_id", "user-1"],
    ]);
  });
});

describe("saveResearch — auth & errors", () => {
  it("propagates the guard redirect for unauthenticated/unconfirmed users", async () => {
    mockedRequireUser.mockRejectedValue(new Error("REDIRECT:/connexion"));
    await expect(
      saveResearch("proj-1", {}, form({ brand_name: "X" })),
    ).rejects.toThrow("REDIRECT:/connexion");
  });

  it("maps a DB error to a safe French message", async () => {
    const { supabase } = makeSupabase({
      project: { id: "proj-1" },
      upsertError: { message: "duplicate key value violates unique constraint" },
    });
    mockedCreateClient.mockResolvedValue(supabase as never);
    const r = await saveResearch("proj-1", {}, form({ brand_name: "X" }));
    expect(r.formError).toBe(researchContent.errors.saveFailed);
    expect(r.formError).not.toContain("duplicate");
  });
});
