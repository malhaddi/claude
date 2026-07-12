import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Regression coverage for the bug where the Génération tab stayed locked after
// research hit 100%: the product and research pages rendered <ProjectTabs>
// WITHOUT `generationReady`, so it always defaulted to false. These tests pin
// the data flow — pages derive `generationReady` from the SAVED research via the
// same 12-field gate — and stub the child components so only that flow is under
// test.

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));
vi.mock("@/lib/auth/dal", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/projects/dal", () => ({ getProject: vi.fn() }));
vi.mock("@/lib/projects/research-dal", () => ({ getResearch: vi.fn() }));

vi.mock("@/components/dashboard/dashboard-header", () => ({
  DashboardHeader: () => <div data-testid="header" />,
}));
vi.mock("@/components/dashboard/project-form", () => ({
  ProjectForm: () => <div data-testid="project-form" />,
}));
vi.mock("@/components/dashboard/research-form", () => ({
  ResearchForm: () => <div data-testid="research-form" />,
}));
vi.mock("@/components/dashboard/project-tabs", () => ({
  // Capture the prop the page passes so we can assert the unlock state.
  ProjectTabs: ({ generationReady }: { generationReady?: boolean }) => (
    <nav data-generation-ready={String(!!generationReady)} />
  ),
}));

import { requireUser } from "@/lib/auth/dal";
import { getProject } from "@/lib/projects/dal";
import { getResearch } from "@/lib/projects/research-dal";
import type { Project } from "@/lib/projects/types";
import type { ProjectResearch } from "@/lib/projects/research-types";

import EditProjectPage from "@/app/dashboard/projets/[id]/page";
import ProjectResearchPage from "@/app/dashboard/projets/[id]/recherche/page";

const mockedRequireUser = vi.mocked(requireUser);
const mockedGetProject = vi.mocked(getProject);
const mockedGetResearch = vi.mocked(getResearch);

/** A saved research row that is 100% complete (all 12 required fields set). */
function completeResearch(): ProjectResearch {
  return {
    id: "r1",
    project_id: "p1",
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

async function renderProductTab(): Promise<string> {
  return renderToStaticMarkup(
    await EditProjectPage({ params: Promise.resolve({ id: "p1" }) }),
  );
}

async function renderResearchTab(): Promise<string> {
  return renderToStaticMarkup(
    await ProjectResearchPage({ params: Promise.resolve({ id: "p1" }) }),
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedRequireUser.mockResolvedValue({ id: "user-1", email: "a@b.fr" } as never);
  mockedGetProject.mockResolvedValue({ id: "p1", name: "Projet" } as Project);
});

describe("generation tab unlock reflects saved research (product tab)", () => {
  it("stays disabled while research is partial", async () => {
    mockedGetResearch.mockResolvedValue({
      ...completeResearch(),
      main_problem: null, // one required field missing → < 100%
    });
    expect(await renderProductTab()).toContain('data-generation-ready="false"');
  });

  it("stays disabled when there is no research row at all", async () => {
    mockedGetResearch.mockResolvedValue(null);
    expect(await renderProductTab()).toContain('data-generation-ready="false"');
  });

  it("unlocks once the saved research is 100% complete", async () => {
    mockedGetResearch.mockResolvedValue(completeResearch());
    expect(await renderProductTab()).toContain('data-generation-ready="true"');
  });
});

describe("generation tab unlock reflects saved research (research tab)", () => {
  it("stays disabled while research is partial", async () => {
    mockedGetResearch.mockResolvedValue({
      ...completeResearch(),
      call_to_action: "   ", // whitespace-only is not "filled"
    });
    expect(await renderResearchTab()).toContain('data-generation-ready="false"');
  });

  it("unlocks once the saved research is 100% complete", async () => {
    mockedGetResearch.mockResolvedValue(completeResearch());
    expect(await renderResearchTab()).toContain('data-generation-ready="true"');
  });

  it("stays unlocked across a reload (fresh render of the same saved data)", async () => {
    mockedGetResearch.mockResolvedValue(completeResearch());
    // Each server render is an independent "reload"; both must stay unlocked.
    expect(await renderResearchTab()).toContain('data-generation-ready="true"');
    expect(await renderResearchTab()).toContain('data-generation-ready="true"');
  });
});
