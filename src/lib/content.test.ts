import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  faqItemSchema,
  navLinkSchema,
  pricingPlanSchema,
} from "@/lib/content-schema";
import {
  comparisonApproaches,
  comparisonRows,
  differentiators,
  faqItems,
  finalCta,
  footerGroups,
  hero,
  launchCapabilities,
  navCtas,
  navLinks,
  plannedCapabilities,
  pricingPlans,
  problems,
  templates,
  workflowSteps,
} from "@/lib/content";

// Importing the content module above already parses every export against its
// Zod schema at load time, so a malformed entry fails this suite immediately.
// The tests below pin the invariants the UI and the brief depend on.

/**
 * Marketing copy flattened for claim-scanning. FAQ *questions* are excluded
 * (a question like "…garantit de meilleures conversions ?" is not a claim —
 * it is answered "Non."); FAQ answers ARE included, since an answer must not
 * make an unsupported promise either.
 */
const claimsHaystack = JSON.stringify([
  hero,
  problems,
  workflowSteps,
  templates,
  launchCapabilities,
  plannedCapabilities,
  differentiators,
  pricingPlans,
  comparisonApproaches,
  comparisonRows,
  faqItems.map((f) => f.answer),
  finalCta,
  footerGroups,
  navLinks,
  navCtas,
]);

describe("navigation", () => {
  it("exposes the required section links", () => {
    const labels = navLinks.map((l) => l.label);
    expect(labels).toEqual(
      expect.arrayContaining(["Produit", "Modèles", "Tarifs", "FAQ"]),
    );
  });

  it("only uses internal links", () => {
    for (const link of navLinks) {
      expect(link.href).toMatch(/^[/#]/);
    }
  });

  it("provides Connexion and Commencer gratuitement CTAs", () => {
    expect(navCtas.login.label).toBe("Connexion");
    expect(navCtas.signup.label).toBe("Commencer gratuitement");
    expect(navCtas.login.href).toMatch(/^[/#]/);
    expect(navCtas.signup.href).toMatch(/^[/#]/);
  });
});

describe("workflow", () => {
  it("describes the four-step flow", () => {
    expect(workflowSteps).toHaveLength(4);
    const titles = workflowSteps.map((s) => s.title);
    expect(titles).toEqual([
      "Collez votre URL",
      "Choisissez un angle",
      "Générez la page",
      "Modifiez et publiez",
    ]);
  });
});

describe("templates", () => {
  it("offers at least five frameworks including the named ones", () => {
    expect(templates.length).toBeGreaterThanOrEqual(5);
    const names = templates.map((t) => t.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "« 5 raisons de… »",
        "« J'ai testé… »",
        "Problème → agitation → solution",
        "Comparatif",
        "Guide d'achat",
      ]),
    );
  });

  it("labels each template's availability and gives it a structure", () => {
    for (const template of templates) {
      expect(["launch", "soon"]).toContain(template.availability);
      expect(template.structure.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps at least three frameworks available at launch", () => {
    const launch = templates.filter((t) => t.availability === "launch");
    expect(launch.length).toBeGreaterThanOrEqual(3);
  });
});

describe("capabilities", () => {
  it("separates launch capabilities from planned ones", () => {
    expect(launchCapabilities.every((c) => c.availability === "launch")).toBe(
      true,
    );
    expect(plannedCapabilities.every((c) => c.availability === "soon")).toBe(
      true,
    );
  });
});

describe("pricing", () => {
  it("defines exactly the three tiers", () => {
    expect(pricingPlans).toHaveLength(3);
    expect(pricingPlans.map((p) => p.id)).toEqual([
      "discovery",
      "launcher",
      "growth",
    ]);
  });

  it("prices Découverte free, Lanceur at 39 and Croissance at 79", () => {
    const byId = Object.fromEntries(pricingPlans.map((p) => [p.id, p]));
    expect(byId.discovery.priceMonthlyEur).toBe(0);
    expect(byId.launcher.priceMonthlyEur).toBe(39);
    expect(byId.growth.priceMonthlyEur).toBe(79);
  });

  it("marks Lanceur as the recommended plan", () => {
    const launcher = pricingPlans.find((p) => p.id === "launcher");
    expect(launcher?.recommended).toBe(true);
    expect(launcher?.badge).toBe("Recommandé");
    expect(launcher?.available).toBe(true);
  });

  it("keeps the Growth plan unavailable with no actionable CTA", () => {
    const growth = pricingPlans.find((p) => p.id === "growth");
    expect(growth?.available).toBe(false);
    // A disabled/waitlist CTA must never link anywhere (no purchase path).
    expect(growth?.cta.href).toBeNull();
    expect(growth?.badge).toBe("Bientôt disponible");
  });

  it("never routes a pricing CTA to a checkout/billing destination", () => {
    for (const plan of pricingPlans) {
      if (plan.cta.href) {
        expect(plan.cta.href).not.toMatch(
          /checkout|stripe|billing|paiement|payment|\bpay\b/i,
        );
      }
    }
  });
});

describe("comparison", () => {
  it("compares four approaches and highlights AdvertoAI only", () => {
    expect(comparisonApproaches).toHaveLength(4);
    const highlighted = comparisonApproaches.filter((a) => a.highlight);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].id).toBe("advertoai");
  });

  it("gives every row a value for every approach", () => {
    for (const row of comparisonRows) {
      for (const approach of comparisonApproaches) {
        expect(row.values[approach.id]).toBeTruthy();
      }
    }
  });

  it("does not invent competitor prices", () => {
    // No euro amounts should appear inside the comparison copy.
    const comparisonText = JSON.stringify([comparisonRows, comparisonApproaches]);
    expect(comparisonText).not.toMatch(/\d+\s?€/);
  });
});

describe("FAQ", () => {
  it("includes at least the nine required questions ending with '?'", () => {
    expect(faqItems.length).toBeGreaterThanOrEqual(9);
    for (const item of faqItems) {
      expect(item.question).toMatch(/\?$/);
    }
    const required = [
      "Qu'est-ce qu'un advertorial ?",
      "Est-ce réservé à Shopify ?",
      "Puis-je modifier le texte ?",
      "Les pages sont-elles adaptées au mobile ?",
      "Puis-je ajouter mon Pixel Meta ?",
      "Est-ce que l'outil garantit de meilleures conversions ?",
      "Où la page sera-t-elle publiée ?",
      "Puis-je annuler mon abonnement ?",
      "Le plan Croissance est-il disponible ?",
    ];
    const questions = faqItems.map((f) => f.question);
    expect(questions).toEqual(expect.arrayContaining(required));
  });

  it("answers the conversions question by denying any guarantee", () => {
    const item = faqItems.find((f) => f.question.includes("garantit"));
    expect(item).toBeDefined();
    expect(item?.answer.toLowerCase()).toMatch(/ne peut garantir|non/);
  });
});

describe("key CTAs", () => {
  it("uses the required primary CTA wording", () => {
    expect(hero.primaryCta.label).toBe("Créer mon premier advertorial");
    expect(hero.secondaryCta.label).toBe("Voir comment ça fonctionne");
    expect(finalCta.cta.label).toBe("Créer mon premier advertorial");
  });

  it("keeps the no-card note in the hero", () => {
    expect(hero.noCardNote).toBe("Aucune carte bancaire requise");
  });
});

describe("auth link destinations", () => {
  it("points the nav CTAs at the auth routes", () => {
    expect(navCtas.login.href).toBe("/connexion");
    expect(navCtas.signup.href).toBe("/inscription");
  });

  it("points the primary conversion CTAs at registration", () => {
    expect(hero.primaryCta.href).toBe("/inscription");
    expect(finalCta.cta.href).toBe("/inscription");
    const byId = Object.fromEntries(pricingPlans.map((p) => [p.id, p]));
    expect(byId.discovery.cta.href).toBe("/inscription");
    expect(byId.launcher.cta.href).toBe("/inscription");
  });

  it("never links public marketing content to the protected /dashboard", () => {
    const hrefs = [
      ...navLinks.map((l) => l.href),
      navCtas.login.href,
      navCtas.signup.href,
      hero.primaryCta.href,
      hero.secondaryCta.href,
      finalCta.cta.href,
      ...pricingPlans.map((p) => p.cta.href),
      ...footerGroups.flatMap((g) => g.links.map((l) => l.href)),
    ];
    expect(hrefs).not.toContain("/dashboard");
  });
});

describe("no unsupported performance claims", () => {
  it("never mentions ROAS or CAC", () => {
    expect(claimsHaystack).not.toMatch(/\bROAS\b/i);
    expect(claimsHaystack).not.toMatch(/\bCAC\b/i);
  });

  it("never quotes a percentage or revenue uplift", () => {
    expect(claimsHaystack).not.toMatch(/\d+\s?%/);
  });

  it("never promises guaranteed conversions or results", () => {
    expect(claimsHaystack).not.toMatch(/conversions?\s+garanties?/i);
    expect(claimsHaystack).not.toMatch(/r[ée]sultats?\s+garantis?/i);
    expect(claimsHaystack).not.toMatch(/garantit?\s+(de\s+)?(meilleures?|plus)/i);
  });
});

describe("content schemas", () => {
  it("rejects FAQ questions without a question mark", () => {
    expect(
      faqItemSchema.safeParse({ question: "Pas une question", answer: "x" })
        .success,
    ).toBe(false);
  });

  it("rejects external nav links", () => {
    expect(
      navLinkSchema.safeParse({ href: "https://x.com", label: "x" }).success,
    ).toBe(false);
  });

  it("rejects an unavailable plan that still links its CTA", () => {
    const result = pricingPlanSchema.safeParse({
      id: "x",
      name: "X",
      priceMonthlyEur: 10,
      tagline: "t",
      features: ["a", "b", "c"],
      badge: null,
      cta: { label: "Acheter", href: "/checkout" },
      recommended: false,
      available: false,
    });
    expect(result.success).toBe(false);
  });
});

describe("reduced-motion & no-JS safety", () => {
  const cwd = process.cwd();

  it("hides reveal elements only behind prefers-reduced-motion: no-preference", () => {
    const css = readFileSync(
      path.resolve(cwd, "src/app/globals.css"),
      "utf8",
    );
    expect(css).toContain("prefers-reduced-motion: no-preference");
    // The opacity:0 hidden state must sit inside a no-preference block, so
    // reduced-motion users are never left with invisible content.
    const guarded = css
      .split("prefers-reduced-motion: no-preference")
      .slice(1)
      .join("\n");
    expect(guarded).toContain(".reveal");
  });

  it("forces reveal elements visible when JavaScript is disabled", () => {
    const layout = readFileSync(
      path.resolve(cwd, "src/app/layout.tsx"),
      "utf8",
    );
    expect(layout).toContain("noscript");
    expect(layout.replace(/\s+/g, "")).toContain(
      ".reveal{opacity:1!important;transform:none!important;}",
    );
  });
});
