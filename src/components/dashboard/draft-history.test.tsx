import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { DraftHistory } from "@/components/dashboard/draft-history";
import { generationContent } from "@/lib/generation/content";
import type { AdvertorialDraftSummary } from "@/lib/generation/types";

const drafts: AdvertorialDraftSummary[] = [
  {
    id: "d2",
    framework_key: "editorial_test",
    status: "draft",
    generation_version: 2,
    headline: "Version deux",
    created_at: "2026-07-12T00:00:00Z",
  },
  {
    id: "d1",
    framework_key: "five_reasons",
    status: "draft",
    generation_version: 1,
    headline: "Version une",
    created_at: "2026-07-11T00:00:00Z",
  },
];

describe("DraftHistory", () => {
  it("shows an empty state when there are no drafts", () => {
    const html = renderToStaticMarkup(
      <DraftHistory projectId="p1" drafts={[]} />,
    );
    // renderToStaticMarkup escapes the apostrophe in "l'instant".
    expect(html).toContain(
      generationContent.history.empty.replace(/'/g, "&#x27;"),
    );
  });

  it("lists each draft with version, framework label and an open link", () => {
    const html = renderToStaticMarkup(
      <DraftHistory projectId="p1" drafts={drafts} />,
    );
    expect(html).toContain("Version deux");
    expect(html).toContain("Version une");
    // Framework labels resolved from the stable keys.
    expect(html).toContain("J'ai testé (test éditorial)".replace(/'/g, "&#x27;"));
    expect(html).toContain("5 raisons de choisir ce produit");
    // Each row links to its own draft view.
    expect(html).toContain('href="/dashboard/projets/p1/generation/d2"');
    expect(html).toContain('href="/dashboard/projets/p1/generation/d1"');
  });
});
