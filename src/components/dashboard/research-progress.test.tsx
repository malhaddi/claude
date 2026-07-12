import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ResearchProgressBar } from "@/components/dashboard/research-progress";
import { researchContent } from "@/lib/projects/research-content";
import { computeResearchProgress } from "@/lib/projects/research-progress";

describe("ResearchProgressBar", () => {
  it("shows an empty draft at 0% and NOT ready", () => {
    const html = renderToStaticMarkup(
      <ResearchProgressBar progress={computeResearchProgress(null)} />,
    );
    expect(html).toContain("0%");
    expect(html).toContain("0 / 12");
    expect(html).toContain(researchContent.progress.notReady); // "Brouillon"
    expect(html).not.toContain(researchContent.progress.ready);
  });

  it("shows a partially completed state without the ready badge", () => {
    const progress = computeResearchProgress({
      brand_name: "Acme",
      product_category: "Cosmétique",
    });
    const html = renderToStaticMarkup(<ResearchProgressBar progress={progress} />);
    expect(html).toContain("2 / 12");
    expect(html).toContain(researchContent.progress.notReady);
    expect(html).not.toContain(researchContent.progress.ready);
  });

  it("marks « Recherche prête » only at 100%", () => {
    const all = Object.fromEntries(
      [
        "brand_name",
        "product_category",
        "product_price",
        "customer_awareness_level",
        "main_problem",
        "desired_outcome",
        "main_promise",
        "main_objections",
        "proof_points",
        "offer_details",
        "preferred_tone",
        "call_to_action",
      ].map((f) => [f, "x"]),
    );
    const html = renderToStaticMarkup(
      <ResearchProgressBar progress={computeResearchProgress(all)} />,
    );
    expect(html).toContain("100%");
    expect(html).toContain(researchContent.progress.ready); // "Recherche prête"
  });
});
