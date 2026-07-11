import { describe, expect, it } from "vitest";

import { formatEur } from "@/lib/format";

describe("formatEur", () => {
  it("formats whole euros in French style", () => {
    // French formatting uses a (non-breaking) space before the euro sign.
    expect(formatEur(39)).toMatch(/^39\s€$/);
  });

  it("groups thousands the French way", () => {
    expect(formatEur(1200)).toMatch(/^1\s200\s€$/);
  });
});
