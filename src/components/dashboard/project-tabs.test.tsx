import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { ProjectTabs } from "@/components/dashboard/project-tabs";
import { researchContent } from "@/lib/projects/research-content";

describe("ProjectTabs", () => {
  const html = renderToStaticMarkup(
    <ProjectTabs projectId="p1" active="research" />,
  );

  it("links to product info and research", () => {
    expect(html).toContain('href="/dashboard/projets/p1"');
    expect(html).toContain('href="/dashboard/projets/p1/recherche"');
    expect(html).toContain(researchContent.tabs.product);
    expect(html).toContain(researchContent.tabs.research);
  });

  it("renders the generation step DISABLED (not a link) with a 'Bientôt' badge", () => {
    // Generation must stay disabled in this milestone.
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain(researchContent.tabs.generation);
    expect(html).toContain(researchContent.tabs.soon);
    // The generation label is not inside an anchor href.
    expect(html).not.toContain('href="/dashboard/projets/p1/generation"');
  });
});
