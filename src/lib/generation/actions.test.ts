import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/env", () => ({ isSupabaseConfigured: true }));
vi.mock("@/lib/auth/dal", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/projects/dal", () => ({ getProject: vi.fn() }));
vi.mock("@/lib/projects/research-dal", () => ({ getResearch: vi.fn() }));
vi.mock("@/lib/ai/provider", () => ({
  isProviderConfigured: vi.fn(() => true),
  getProvider: vi.fn(() => ({ provider: "mock", model: "m" })),
}));
vi.mock("@/lib/generation/generate", () => ({ runGeneration: vi.fn() }));

import { requireUser } from "@/lib/auth/dal";
import { isProviderConfigured } from "@/lib/ai/provider";
import { generateAdvertorial } from "@/lib/generation/actions";
import { generationContent } from "@/lib/generation/content";
import { runGeneration } from "@/lib/generation/generate";
import { getProject } from "@/lib/projects/dal";
import { getResearch } from "@/lib/projects/research-dal";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/projects/types";
import type { ProjectResearch } from "@/lib/projects/research-types";

const e = generationContent.errors;
const mockedRequireUser = vi.mocked(requireUser);
const mockedCreateClient = vi.mocked(createClient);
const mockedGetProject = vi.mocked(getProject);
const mockedGetResearch = vi.mocked(getResearch);
const mockedRunGeneration = vi.mocked(runGeneration);
const mockedIsProviderConfigured = vi.mocked(isProviderConfigured);

const OUTPUT = {
  headline: "Titre",
  subheadline: null,
  introduction: "Intro",
  body_sections: [
    { id: "s1", type: "reason" as const, heading: "H", body: "B" },
  ],
  call_to_action_text: "CTA",
  disclaimer: null,
};

/** A 100%-complete research row (all 12 required fields non-empty). */
function completeResearch(): ProjectResearch {
  return {
    id: "research-1",
    project_id: "proj-1",
    user_id: "user-1",
    brand_name: "Acme",
    product_category: "Rasage",
    product_price: "29 €",
    customer_age_range: null,
    customer_gender: null,
    customer_awareness_level: "problem_aware",
    main_problem: "Irritation",
    desired_outcome: "Peau nette",
    main_promise: "Douceur",
    unique_mechanism: null,
    main_objections: "Prix",
    competitor_names: null,
    proof_points: "Avis vérifiés",
    offer_details: "Essai 30j",
    guarantee_details: null,
    urgency_details: null,
    preferred_tone: "editorial",
    call_to_action: "Commander",
    additional_notes: null,
    created_at: "2026-07-12T00:00:00Z",
    updated_at: "2026-07-12T00:00:00Z",
  };
}

function makeSupabase(config: {
  latestVersion?: number | null;
  insertError?: unknown;
} = {}) {
  const state = {
    insertArg: null as Record<string, unknown> | null,
    tables: [] as string[],
  };
  const builder: Record<string, unknown> = {
    select() {
      return builder;
    },
    eq() {
      return builder;
    },
    order() {
      return builder;
    },
    limit() {
      return builder;
    },
    async maybeSingle() {
      return {
        data:
          config.latestVersion == null
            ? null
            : { generation_version: config.latestVersion },
        error: null,
      };
    },
    insert(arg: Record<string, unknown>) {
      state.insertArg = arg;
      return builder;
    },
    async single() {
      if (config.insertError) return { data: null, error: config.insertError };
      return { data: { id: "draft-1", ...state.insertArg }, error: null };
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
  mockedIsProviderConfigured.mockReturnValue(true);
  mockedGetProject.mockResolvedValue({ id: "proj-1", name: "P" } as Project);
  mockedGetResearch.mockResolvedValue(completeResearch());
  mockedRunGeneration.mockResolvedValue({
    ok: true,
    output: OUTPUT,
    modelProvider: "anthropic",
    modelName: "claude-opus-4-8",
    promptVersion: "publy-advertorial-v1",
  });
});

describe("generateAdvertorial — validation & gating", () => {
  it("rejects an invalid framework without touching auth/DB/provider", async () => {
    const r = await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "comparison" }),
    );
    expect(r.fieldErrors?.framework_key).toBeTruthy();
    expect(mockedRequireUser).not.toHaveBeenCalled();
    expect(mockedRunGeneration).not.toHaveBeenCalled();
  });

  it("blocks when the AI provider is not configured", async () => {
    mockedIsProviderConfigured.mockReturnValue(false);
    const r = await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "five_reasons" }),
    );
    expect(r.formError).toBe(e.aiNotConfigured);
    expect(mockedRunGeneration).not.toHaveBeenCalled();
  });

  it("returns notFound for a project the user does not own", async () => {
    mockedGetProject.mockResolvedValue(null);
    const r = await generateAdvertorial(
      "foreign",
      {},
      form({ framework_key: "five_reasons" }),
    );
    expect(r.formError).toBe(e.notFound);
    expect(mockedRunGeneration).not.toHaveBeenCalled();
  });

  it("blocks when there is no research row", async () => {
    mockedGetResearch.mockResolvedValue(null);
    const r = await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "five_reasons" }),
    );
    expect(r.formError).toBe(e.researchIncomplete);
    expect(mockedRunGeneration).not.toHaveBeenCalled();
  });

  it("blocks when the research is incomplete (<100%)", async () => {
    mockedGetResearch.mockResolvedValue({
      ...completeResearch(),
      main_problem: null, // one required field missing
    });
    const r = await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "five_reasons" }),
    );
    expect(r.formError).toBe(e.researchIncomplete);
    expect(mockedRunGeneration).not.toHaveBeenCalled();
  });

  it("propagates the guard redirect for unauthenticated/unconfirmed users", async () => {
    mockedRequireUser.mockRejectedValue(new Error("REDIRECT:/connexion"));
    await expect(
      generateAdvertorial("proj-1", {}, form({ framework_key: "five_reasons" })),
    ).rejects.toThrow("REDIRECT:/connexion");
  });
});

describe("generateAdvertorial — storage", () => {
  it("stores a valid draft with session-derived identity and model metadata", async () => {
    const { supabase, state } = makeSupabase({ latestVersion: null });
    mockedCreateClient.mockResolvedValue(supabase as never);

    const r = await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "five_reasons" }),
    );

    expect(r.success).toBe(true);
    expect(state.insertArg).toMatchObject({
      project_id: "proj-1",
      research_id: "research-1",
      user_id: "user-1",
      framework_key: "five_reasons",
      status: "draft",
      generation_version: 1,
      headline: "Titre",
      model_provider: "anthropic",
      model_name: "claude-opus-4-8",
      prompt_version: "publy-advertorial-v1",
    });
    expect(state.insertArg?.body_sections).toEqual(OUTPUT.body_sections);
  });

  it("increments generation_version per project (max + 1)", async () => {
    const { supabase, state } = makeSupabase({ latestVersion: 3 });
    mockedCreateClient.mockResolvedValue(supabase as never);
    await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "editorial_test" }),
    );
    expect(state.insertArg?.generation_version).toBe(4);
  });

  it("ignores a user_id / project_id injected via the form (no spoofing)", async () => {
    const { supabase, state } = makeSupabase({ latestVersion: null });
    mockedCreateClient.mockResolvedValue(supabase as never);
    await generateAdvertorial(
      "proj-1",
      {},
      form({
        framework_key: "five_reasons",
        user_id: "attacker",
        project_id: "forged",
        research_id: "forged-research",
      }),
    );
    expect(state.insertArg?.user_id).toBe("user-1");
    expect(state.insertArg?.project_id).toBe("proj-1");
    expect(state.insertArg?.research_id).toBe("research-1");
  });

  it("maps a DB insert error to a safe French message", async () => {
    const { supabase } = makeSupabase({
      latestVersion: null,
      insertError: { message: "duplicate key value violates unique constraint" },
    });
    mockedCreateClient.mockResolvedValue(supabase as never);
    const r = await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "five_reasons" }),
    );
    expect(r.formError).toBe(e.saveFailed);
    expect(r.formError).not.toContain("duplicate");
  });
});

describe("generateAdvertorial — provider outcomes are never stored", () => {
  it("maps a provider rate limit to French and stores nothing", async () => {
    mockedRunGeneration.mockResolvedValue({ ok: false, reason: "rate_limited" });
    const r = await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "five_reasons" }),
    );
    expect(r.formError).toBe(e.rateLimited);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("maps a failed/invalid generation to a safe error and stores nothing", async () => {
    mockedRunGeneration.mockResolvedValue({ ok: false, reason: "failed" });
    const r = await generateAdvertorial(
      "proj-1",
      {},
      form({ framework_key: "five_reasons" }),
    );
    expect(r.formError).toBe(e.generationFailed);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });
});
