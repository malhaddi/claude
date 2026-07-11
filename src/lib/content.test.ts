import { describe, expect, it } from "vitest";

import {
  faqItemSchema,
  navLinkSchema,
  pricingPlanSchema,
} from "@/lib/content-schema";
import {
  benefits,
  faqItems,
  foundingOffer,
  navLinks,
  steps,
  templates,
} from "@/lib/content";

// The content module parses everything against its schemas at import time,
// so merely importing it above already guards against malformed content.
// The tests below pin the invariants the UI relies on.

describe("marketing content", () => {
  it("defines exactly three advertorial templates with unique ids", () => {
    expect(templates).toHaveLength(3);
    const ids = templates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("describes the flow in four steps", () => {
    expect(steps).toHaveLength(4);
  });

  it("lists at least four benefits", () => {
    expect(benefits.length).toBeGreaterThanOrEqual(4);
  });

  it("prices the founding offer at 39 EUR per month", () => {
    expect(foundingOffer.priceMonthlyEur).toBe(39);
  });

  it("ends every FAQ question with a question mark", () => {
    expect(faqItems.length).toBeGreaterThanOrEqual(4);
    for (const item of faqItems) {
      expect(item.question).toMatch(/\?$/);
    }
  });

  it("only uses internal nav links", () => {
    for (const link of navLinks) {
      expect(link.href).toMatch(/^[/#]/);
    }
  });
});

describe("content schemas", () => {
  it("rejects FAQ questions without a question mark", () => {
    const result = faqItemSchema.safeParse({
      question: "Ceci n'est pas une question",
      answer: "Réponse",
    });
    expect(result.success).toBe(false);
  });

  it("rejects external nav links", () => {
    const result = navLinkSchema.safeParse({
      href: "https://example.com",
      label: "Externe",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive prices", () => {
    const result = pricingPlanSchema.safeParse({
      ...foundingOffer,
      priceMonthlyEur: 0,
    });
    expect(result.success).toBe(false);
  });
});
