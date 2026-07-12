import { describe, expect, it } from "vitest";

import {
  advertorialOutputSchema,
  parseAdvertorialOutput,
} from "@/lib/generation/schema";

function validOutput() {
  return {
    headline: "Le rasoir qui change la routine du matin",
    subheadline: "Conçu pour les peaux sensibles",
    introduction: "Se raser ne devrait pas irriter la peau.",
    body_sections: [
      {
        id: "raison-1",
        type: "reason",
        heading: "Une lame qui respecte la peau",
        body: "La géométrie de la lame limite les micro-coupures.",
        bullets: ["Moins d'irritations", "Un rasage plus net"],
      },
      {
        id: "conclusion",
        type: "conclusion",
        heading: "À vous de tester",
        body: "Adoptez une routine plus douce.",
      },
    ],
    call_to_action_text: "Découvrir le rasoir",
    disclaimer: null,
  };
}

describe("advertorialOutputSchema", () => {
  it("accepts a well-formed draft", () => {
    const result = advertorialOutputSchema.safeParse(validOutput());
    expect(result.success).toBe(true);
  });

  it("rejects a missing required field (headline)", () => {
    const bad = validOutput();
    // @ts-expect-error deliberately dropping a required field
    delete bad.headline;
    expect(advertorialOutputSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an empty body_sections array", () => {
    const bad = { ...validOutput(), body_sections: [] };
    expect(advertorialOutputSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an unknown section type", () => {
    const bad = validOutput();
    bad.body_sections[0].type = "not-a-type";
    expect(advertorialOutputSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects HTML in any text field (no raw HTML accepted)", () => {
    const withHtml = validOutput();
    withHtml.headline = "Offre <b>exceptionnelle</b>";
    expect(advertorialOutputSchema.safeParse(withHtml).success).toBe(false);

    const withScript = validOutput();
    withScript.body_sections[0].body = "Texte <script>alert(1)</script>";
    expect(advertorialOutputSchema.safeParse(withScript).success).toBe(false);
  });

  it("allows a bare '<' that is not an HTML tag", () => {
    const ok = validOutput();
    ok.introduction = "Moins de 5 < 10 minutes le matin.";
    expect(advertorialOutputSchema.safeParse(ok).success).toBe(true);
  });
});

describe("parseAdvertorialOutput", () => {
  it("parses a clean JSON string", () => {
    const r = parseAdvertorialOutput(JSON.stringify(validOutput()));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.headline).toContain("rasoir");
  });

  it("strips a ```json code fence", () => {
    const fenced = "```json\n" + JSON.stringify(validOutput()) + "\n```";
    const r = parseAdvertorialOutput(fenced);
    expect(r.ok).toBe(true);
  });

  it("fails on non-JSON text", () => {
    const r = parseAdvertorialOutput("désolé, voici le texte…");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeTruthy();
  });

  it("fails (with an error summary) on schema-invalid JSON", () => {
    const r = parseAdvertorialOutput(JSON.stringify({ headline: "seul" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("body_sections");
  });
});
