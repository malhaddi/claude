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
  it("links to product info and research", () => {
    const html = renderToStaticMarkup(
      <ProjectTabs projectId="p1" active="research" />,
    );
    expect(html).toContain('href="/dashboard/projets/p1"');
    expect(html).toContain('href="/dashboard/projets/p1/recherche"');
    expect(html).toContain(researchContent.tabs.product);
    expect(html).toContain(researchContent.tabs.research);
  });

  it("keeps generation DISABLED until the research is complete", () => {
    const html = renderToStaticMarkup(
      <ProjectTabs projectId="p1" active="research" generationReady={false} />,
    );
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain(researchContent.tabs.generation);
    expect(html).toContain(researchContent.tabs.locked);
    // Not a link while locked.
    expect(html).not.toContain('href="/dashboard/projets/p1/generation"');
  });

  it("links to generation once the research is ready", () => {
    const html = renderToStaticMarkup(
      <ProjectTabs projectId="p1" active="generation" generationReady />,
    );
    expect(html).toContain('href="/dashboard/projets/p1/generation"');
    expect(html).not.toContain('aria-disabled="true"');
  });
});
