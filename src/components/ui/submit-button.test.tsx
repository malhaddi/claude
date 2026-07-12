import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SubmitButton } from "@/components/ui/submit-button";

describe("SubmitButton (duplicate-submit prevention)", () => {
  it("is enabled and shows the idle label when not pending", () => {
    const html = renderToStaticMarkup(
      <SubmitButton pending={false} idleLabel="Se connecter" pendingLabel="Connexion…" />,
    );
    expect(html).toContain("Se connecter");
    expect(html).toContain('aria-disabled="false"');
    // The boolean `disabled` attribute is absent (only Tailwind disabled: classes remain).
    expect(html).not.toContain('disabled=""');
  });

  it("is DISABLED and shows the pending label while pending", () => {
    const html = renderToStaticMarkup(
      <SubmitButton pending idleLabel="Se connecter" pendingLabel="Connexion…" />,
    );
    // A disabled submit button cannot be clicked again → no double submission.
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain("Connexion…");
  });
});
