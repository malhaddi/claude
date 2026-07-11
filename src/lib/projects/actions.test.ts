import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/env", () => ({ isSupabaseConfigured: true }));

vi.mock("@/lib/auth/dal", () => ({ requireUser: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/projects/actions";
import { projectsContent } from "@/lib/projects/content";

const mockedRequireUser = vi.mocked(requireUser);
const mockedCreateClient = vi.mocked(createClient);

/** Chainable Supabase query-builder mock that records what it was called with. */
function makeSupabase(config: {
  single?: { data: unknown; error: unknown };
  maybeSingle?: { data: unknown; error: unknown };
  del?: { data: unknown; error: unknown };
} = {}) {
  const state = {
    table: null as string | null,
    insertArg: null as Record<string, unknown> | null,
    updateArg: null as Record<string, unknown> | null,
    deleted: false,
    eqCalls: [] as Array<[string, unknown]>,
  };
  const builder: Record<string, unknown> = {
    insert(arg: Record<string, unknown>) {
      state.insertArg = arg;
      return builder;
    },
    update(arg: Record<string, unknown>) {
      state.updateArg = arg;
      return builder;
    },
    delete() {
      state.deleted = true;
      return builder;
    },
    eq(key: string, value: unknown) {
      state.eqCalls.push([key, value]);
      return builder;
    },
    select() {
      return builder;
    },
    async single() {
      return config.single ?? { data: null, error: null };
    },
    async maybeSingle() {
      return config.maybeSingle ?? { data: null, error: null };
    },
    // Make the builder awaitable for the delete chain (no terminal call).
    then(resolve: (v: unknown) => void) {
      resolve(config.del ?? { data: null, error: null });
    },
  };
  const supabase = {
    from(table: string) {
      state.table = table;
      return builder;
    },
  };
  return { supabase, state };
}

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, val] of Object.entries(fields)) fd.set(k, val);
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedRequireUser.mockResolvedValue({ id: "user-1", email: "a@b.fr" } as never);
});

describe("createProject", () => {
  it("returns field errors and never touches the DB on invalid input", async () => {
    const r = await createProject({}, form({ name: "" }));
    expect(r.fieldErrors?.name).toBeTruthy();
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("inserts with the session user_id and redirects to the new project", async () => {
    const { supabase, state } = makeSupabase({
      single: { data: { id: "proj-9" }, error: null },
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    await expect(
      createProject({}, form({ name: "Projet", product_url: "https://a.fr" })),
    ).rejects.toThrow("REDIRECT:/dashboard/projets/proj-9");

    expect(state.table).toBe("projects");
    expect(state.insertArg).toMatchObject({ name: "Projet", user_id: "user-1" });
  });

  it("ignores any user_id supplied in the form (no spoofing)", async () => {
    const { supabase, state } = makeSupabase({
      single: { data: { id: "p1" }, error: null },
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    await expect(
      createProject(
        {},
        form({ name: "Projet", user_id: "attacker-999", id: "forged" }),
      ),
    ).rejects.toThrow("REDIRECT:");

    expect(state.insertArg?.user_id).toBe("user-1");
    expect(state.insertArg).not.toHaveProperty("id");
  });

  it("maps a DB error to a safe French message", async () => {
    const { supabase } = makeSupabase({
      single: { data: null, error: { message: "duplicate key value" } },
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const r = await createProject({}, form({ name: "Projet" }));
    expect(r.formError).toBe(projectsContent.errors.saveFailed);
    expect(r.formError).not.toContain("duplicate");
  });

  it("redirects unauthenticated callers (requireUser throws)", async () => {
    mockedRequireUser.mockRejectedValue(new Error("REDIRECT:/connexion"));
    await expect(createProject({}, form({ name: "Projet" }))).rejects.toThrow(
      "REDIRECT:/connexion",
    );
  });
});

describe("updateProject", () => {
  it("updates filtered by id AND user_id and reports success", async () => {
    const { supabase, state } = makeSupabase({
      maybeSingle: { data: { id: "p1" }, error: null },
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const r = await updateProject("p1", {}, form({ name: "Nouveau nom" }));
    expect(r.success).toBe(true);
    expect(state.updateArg).toMatchObject({ name: "Nouveau nom" });
    expect(state.eqCalls).toEqual([
      ["id", "p1"],
      ["user_id", "user-1"],
    ]);
  });

  it("returns notFound for a foreign/non-existent id (0 rows)", async () => {
    const { supabase } = makeSupabase({
      maybeSingle: { data: null, error: null },
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const r = await updateProject("foreign", {}, form({ name: "X" }));
    expect(r.formError).toBe(projectsContent.errors.notFound);
  });

  it("does not update ownership even if user_id is in the form", async () => {
    const { supabase, state } = makeSupabase({
      maybeSingle: { data: { id: "p1" }, error: null },
    });
    mockedCreateClient.mockResolvedValue(supabase as never);

    await updateProject("p1", {}, form({ name: "X", user_id: "attacker" }));
    expect(state.updateArg).not.toHaveProperty("user_id");
  });
});

describe("deleteProject", () => {
  it("deletes filtered by id AND user_id, then redirects", async () => {
    const { supabase, state } = makeSupabase();
    mockedCreateClient.mockResolvedValue(supabase as never);

    await expect(deleteProject("p1")).rejects.toThrow("REDIRECT:/dashboard");
    expect(state.deleted).toBe(true);
    expect(state.eqCalls).toEqual([
      ["id", "p1"],
      ["user_id", "user-1"],
    ]);
  });

  it("redirects unauthenticated callers", async () => {
    mockedRequireUser.mockRejectedValue(new Error("REDIRECT:/connexion"));
    await expect(deleteProject("p1")).rejects.toThrow("REDIRECT:/connexion");
  });
});
