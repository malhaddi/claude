import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// Avoid pulling the client delete button (→ server action → next/headers).
vi.mock("@/components/dashboard/delete-project-button", () => ({
  DeleteProjectButton: ({ id }: { id: string }) => (
    <button type="button">delete-{id}</button>
  ),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { ProjectList } from "@/components/dashboard/project-list";
import { projectsContent } from "@/lib/projects/content";
import type { Project } from "@/lib/projects/types";

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: "p1",
    user_id: "u1",
    name: "Ma campagne",
    product_url: null,
    product_title: null,
    product_description: null,
    product_benefits: null,
    target_audience: null,
    offer_text: null,
    product_image_url: null,
    destination_url: null,
    status: "draft",
    created_at: "2026-07-11T10:00:00.000Z",
    updated_at: "2026-07-11T10:00:00.000Z",
    ...overrides,
  };
}

describe("ProjectList empty state", () => {
  const html = renderToStaticMarkup(<ProjectList projects={[]} />);

  it("shows the empty title and a create CTA", () => {
    // renderToStaticMarkup HTML-escapes apostrophes, so match the stable prefix.
    expect(html).toContain("Aucun projet pour");
    expect(html).toContain(projectsContent.dashboard.emptyCta);
    expect(html).toContain('href="/dashboard/projets/nouveau"');
  });
});

describe("ProjectList populated state", () => {
  const html = renderToStaticMarkup(
    <ProjectList projects={[project({ id: "abc" }), project({ id: "def", name: "Deux" })]} />,
  );

  it("renders each project's name, status, open link and delete control", () => {
    expect(html).toContain("Ma campagne");
    expect(html).toContain("Deux");
    expect(html).toContain(projectsContent.status.draft); // "Brouillon"
    expect(html).toContain('href="/dashboard/projets/abc"');
    expect(html).toContain('href="/dashboard/projets/def"');
    expect(html).toContain(projectsContent.dashboard.open); // "Ouvrir"
    expect(html).toContain("delete-abc");
  });

  it("shows the French creation date", () => {
    expect(html).toContain("11 juillet 2026");
    expect(html).toContain(projectsContent.dashboard.createdOn);
  });
});
