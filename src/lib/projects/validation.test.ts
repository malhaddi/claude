import { describe, expect, it } from "vitest";

import { projectsContent } from "@/lib/projects/content";
import { validateProject } from "@/lib/projects/validation";

const v = projectsContent.validation;

const validBase = { name: "Ma campagne" };

describe("project name", () => {
  it("requires a name", () => {
    const r = validateProject({ name: "   " });
    expect(r.fieldErrors?.name).toBe(v.nameRequired);
  });

  it("rejects an over-long name", () => {
    const r = validateProject({ name: "a".repeat(121) });
    expect(r.fieldErrors?.name).toBe(v.nameTooLong);
  });

  it("accepts a minimal valid project and trims the name", () => {
    const r = validateProject({ name: "  Projet  " });
    expect(r.fieldErrors).toBeUndefined();
    expect(r.data?.name).toBe("Projet");
  });
});

describe("optional URLs", () => {
  it("accepts empty URL fields as null", () => {
    const r = validateProject({ ...validBase, product_url: "", destination_url: "  " });
    expect(r.fieldErrors).toBeUndefined();
    expect(r.data?.product_url).toBeNull();
    expect(r.data?.destination_url).toBeNull();
  });

  it("accepts http/https URLs", () => {
    const r = validateProject({
      ...validBase,
      product_url: "https://shop.example.fr/p/1",
      product_image_url: "http://cdn.example.fr/a.jpg",
    });
    expect(r.fieldErrors).toBeUndefined();
    expect(r.data?.product_url).toBe("https://shop.example.fr/p/1");
  });

  it("rejects non-http(s) URLs (javascript:, data:, ftp:)", () => {
    for (const bad of [
      "javascript:alert(1)",
      "data:text/html,x",
      "ftp://x.fr/a",
      "not a url",
    ]) {
      const r = validateProject({ ...validBase, product_url: bad });
      expect(r.fieldErrors?.product_url).toBe(v.urlInvalid);
    }
  });
});

describe("optional text", () => {
  it("nulls empty text fields and keeps provided ones", () => {
    const r = validateProject({
      ...validBase,
      product_description: "  Super produit  ",
      offer_text: "",
    });
    expect(r.data?.product_description).toBe("Super produit");
    expect(r.data?.offer_text).toBeNull();
  });

  it("rejects text over the length limit", () => {
    const r = validateProject({ ...validBase, product_benefits: "x".repeat(5001) });
    expect(r.fieldErrors?.product_benefits).toBe(v.tooLong);
  });
});

describe("full valid payload", () => {
  it("returns a normalized ProjectInput", () => {
    const r = validateProject({
      name: "Projet",
      product_url: "https://a.fr",
      product_title: "Titre",
      product_description: "Desc",
      product_benefits: "Bénéfices",
      target_audience: "Audience",
      offer_text: "Offre",
      product_image_url: "https://a.fr/i.jpg",
      destination_url: "https://a.fr/go",
    });
    expect(r.fieldErrors).toBeUndefined();
    expect(r.data).toMatchObject({ name: "Projet", product_title: "Titre" });
    // Never carries a user_id — that is derived from the session, not the form.
    expect(r.data as unknown as Record<string, unknown>).not.toHaveProperty(
      "user_id",
    );
  });
});
