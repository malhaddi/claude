import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DraftPreview } from "@/components/dashboard/draft-preview";
import type { AdvertorialDraft } from "@/lib/generation/types";

function draft(overrides: Partial<AdvertorialDraft> = {}): AdvertorialDraft {
  return {
    id: "d1",
    project_id: "p1",
    research_id: "r1",
    user_id: "u1",
    framework_key: "five_reasons",
    status: "draft",
    generation_version: 2,
    headline: "Un rasage plus doux",
    subheadline: "Pour les peaux sensibles",
    introduction: "Le matin mérite mieux.",
    body_sections: [
      {
        id: "raison-1",
        type: "reason",
        heading: "Douceur maximale",
        body: "La lame respecte la peau.",
        bullets: ["Zéro rougeur", "Rasage net"],
      },
    ],
    call_to_action_text: "Decouvrir le rasoir",
    disclaimer: "Resultats variables selon la peau.",
    model_provider: "anthropic",
    model_name: "claude-opus-4-8",
    prompt_version: "publy-advertorial-v1",
    created_at: "2026-07-12T00:00:00Z",
    updated_at: "2026-07-12T00:00:00Z",
    ...overrides,
  };
}

describe("DraftPreview", () => {
  it("renders the structured draft content and metadata", () => {
    const html = renderToStaticMarkup(<DraftPreview draft={draft()} />);
    expect(html).toContain("Un rasage plus doux");
    expect(html).toContain("Pour les peaux sensibles");
    expect(html).toContain("Douceur maximale");
    expect(html).toContain("Zéro rougeur");
    expect(html).toContain("Decouvrir le rasoir");
    expect(html).toContain("Resultats variables");
    // Framework label + version metadata.
    expect(html).toContain("5 raisons de choisir ce produit");
    expect(html).toContain("v2");
  });

  it("renders field content as escaped text — never as raw HTML", () => {
    const html = renderToStaticMarkup(
      <DraftPreview
        draft={draft({ headline: "Titre injecte gras" + " <b>x</b>" })}
      />,
    );
    // The tag is escaped (no dangerouslySetInnerHTML anywhere).
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).not.toContain("<b>x</b>");
  });

  it("omits optional blocks when absent", () => {
    const html = renderToStaticMarkup(
      <DraftPreview draft={draft({ subheadline: null, disclaimer: null })} />,
    );
    expect(html).not.toContain("Pour les peaux sensibles");
    expect(html).not.toContain("Resultats variables");
  });
});
