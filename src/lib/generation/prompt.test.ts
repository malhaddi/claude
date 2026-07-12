import { describe, expect, it } from "vitest";

import {
  buildRepairPrompt,
  buildSystemPrompt,
  buildUserPrompt,
  MAX_USER_INSTRUCTIONS,
  PROMPT_VERSION,
  type GenerationContext,
} from "@/lib/generation/prompt";
import type { Project } from "@/lib/projects/types";
import type { ProjectResearch } from "@/lib/projects/research-types";

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: "p1",
    user_id: "u1",
    name: "Campagne rasoir",
    product_url: null,
    product_title: "Rasoir doux",
    product_description: "Un rasoir pour peaux sensibles",
    product_benefits: "Moins d'irritation",
    target_audience: "Hommes 25-40",
    offer_text: "-20% le premier mois",
    product_image_url: null,
    destination_url: null,
    status: "draft",
    created_at: "2026-07-12T00:00:00Z",
    updated_at: "2026-07-12T00:00:00Z",
    ...overrides,
  };
}

function research(overrides: Partial<ProjectResearch> = {}): ProjectResearch {
  return {
    id: "r1",
    project_id: "p1",
    user_id: "u1",
    brand_name: "SoftShave",
    product_category: "Rasage",
    product_price: "29 €",
    customer_age_range: "25-40",
    customer_gender: "Homme",
    customer_awareness_level: "problem_aware",
    main_problem: "Irritations après le rasage",
    desired_outcome: "Une peau nette sans rougeurs",
    main_promise: "Un rasage doux",
    unique_mechanism: "Lame à angle optimisé",
    main_objections: "Le prix",
    competitor_names: null,
    proof_points: null,
    offer_details: "Essai 30 jours",
    guarantee_details: null,
    urgency_details: null,
    preferred_tone: "editorial",
    call_to_action: "Commander",
    additional_notes: null,
    created_at: "2026-07-12T00:00:00Z",
    updated_at: "2026-07-12T00:00:00Z",
    ...overrides,
  };
}

function ctx(overrides: Partial<GenerationContext> = {}): GenerationContext {
  return {
    project: project(),
    research: research(),
    frameworkKey: "five_reasons",
    ...overrides,
  };
}

describe("PROMPT_VERSION", () => {
  it("is the stable, versioned identifier stored with every draft", () => {
    expect(PROMPT_VERSION).toBe("publy-advertorial-v1");
  });
});

describe("buildSystemPrompt", () => {
  const system = buildSystemPrompt();

  it("forbids fabricating proof, testimonials, studies and certifications", () => {
    expect(system).toContain("témoignages");
    expect(system).toContain("études");
    expect(system).toContain("certifications");
  });

  it("forbids fabricating medical claims, scarcity, discounts and press", () => {
    expect(system).toContain("médicales");
    expect(system).toContain("rareté");
    expect(system).toContain("remise");
    expect(system).toContain("presse");
    expect(system).toContain("réglementaire");
  });

  it("instructs to distinguish facts, framing and unsupported claims", () => {
    expect(system).toContain("FAITS UTILISATEUR");
    expect(system).toContain("CADRAGE PERSUASIF");
    expect(system).toContain("AFFIRMATIONS NON ÉTAYÉES");
  });

  it("requires JSON-only output with no HTML", () => {
    expect(system).toContain("JSON");
    expect(system).toContain("AUCUN HTML");
  });
});

describe("buildUserPrompt", () => {
  it("includes the framework label, guidance, awareness and tone labels", () => {
    const prompt = buildUserPrompt(ctx({ frameworkKey: "five_reasons" }));
    expect(prompt).toContain("five_reasons");
    expect(prompt).toContain("5 raisons"); // framework label
    expect(prompt).toContain("Conscient du problème"); // awareness label
    expect(prompt).toContain("Éditorial"); // tone label
  });

  it("includes product and research facts", () => {
    const prompt = buildUserPrompt(ctx());
    expect(prompt).toContain("Rasoir doux");
    expect(prompt).toContain("Irritations après le rasage");
    expect(prompt).toContain("Lame à angle optimisé");
  });

  it("emits explicit do-not-invent directives for missing persuasion assets", () => {
    const prompt = buildUserPrompt(ctx());
    expect(prompt).toContain("n'invente aucune preuve");
    expect(prompt).toContain("ne promets aucune garantie");
    expect(prompt).toContain("n'invente ni rareté");
    expect(prompt).toContain("ne cite ni ne compare aucun concurrent");
  });

  it("uses provided persuasion assets when present (no directive)", () => {
    const prompt = buildUserPrompt(
      ctx({ research: research({ proof_points: "1000 avis vérifiés" }) }),
    );
    expect(prompt).toContain("1000 avis vérifiés");
  });

  it("injects and truncates the user's optional instructions", () => {
    const long = "z".repeat(MAX_USER_INSTRUCTIONS + 50);
    const prompt = buildUserPrompt(ctx({ userInstructions: long }));
    expect(prompt).toContain("z".repeat(MAX_USER_INSTRUCTIONS));
    expect(prompt).not.toContain("z".repeat(MAX_USER_INSTRUCTIONS + 1));
  });

  it("says '(aucune)' when no instructions are given", () => {
    expect(buildUserPrompt(ctx({ userInstructions: null }))).toContain(
      "(aucune)",
    );
  });
});

describe("editorial_test framework guidance", () => {
  it("forbids inventing a fake first-person experience", () => {
    const prompt = buildUserPrompt(ctx({ frameworkKey: "editorial_test" }));
    expect(prompt).toContain("n'invente jamais d'expérience personnelle");
  });
});

describe("buildRepairPrompt", () => {
  it("restates the contract and reports the previous error", () => {
    const repair = buildRepairPrompt("headline: Required");
    expect(repair).toContain("headline: Required");
    expect(repair).toContain("JSON");
  });
});
