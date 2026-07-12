import { z } from "zod";

/**
 * The three advertorial frameworks available in this milestone. The `key` is a
 * STABLE internal value stored on every draft (`framework_key`) and used in the
 * prompt — never the translated label — so DB rows and prompts don't depend on
 * UI wording. Adding a framework here is the only place a new option is defined.
 *
 * Deliberately excluded (out of scope / higher claim-risk): comparison, expert,
 * medical, and testimonial frameworks.
 */

export const FRAMEWORK_KEYS = [
  "five_reasons",
  "editorial_test",
  "problem_agitation_solution",
] as const;

export type FrameworkKey = (typeof FRAMEWORK_KEYS)[number];

const nonEmpty = z.string().min(1);

const frameworkSchema = z.object({
  key: z.enum(FRAMEWORK_KEYS),
  /** Customer-facing name shown in the framework picker. */
  label: nonEmpty,
  /** One-line French explanation shown under the label. */
  tagline: nonEmpty,
  /** French guidance injected into the prompt to shape this framework. */
  promptGuidance: nonEmpty,
});

export type Framework = z.infer<typeof frameworkSchema>;

export const FRAMEWORKS: readonly Framework[] = z
  .array(frameworkSchema)
  .length(FRAMEWORK_KEYS.length)
  .parse([
    {
      key: "five_reasons",
      label: "5 raisons de choisir ce produit",
      tagline:
        "Un article qui déroule les raisons concrètes d'adopter le produit.",
      promptGuidance: [
        "Structure « 5 raisons de… ». Rédige une introduction qui pose le contexte et le bénéfice central,",
        "puis 4 à 6 sections de type \"reason\", chacune avec un titre court et un paragraphe développant UNE raison distincte,",
        "ancrée dans un bénéfice réel, la promesse principale ou le mécanisme unique fournis.",
        "Une courte liste à puces est possible quand elle clarifie la raison.",
        "Ordonne les raisons de la plus convaincante à la moins forte, puis termine par une section de type \"conclusion\" qui récapitule et amène naturellement à l'appel à l'action.",
      ].join(" "),
    },
    {
      key: "editorial_test",
      label: "J'ai testé (test éditorial)",
      tagline:
        "Un test éditorial honnête, sans faux témoignage ni expérience inventée.",
      promptGuidance: [
        "Structure de test/revue éditoriale. RÈGLE ABSOLUE : n'invente jamais d'expérience personnelle, de « je » fictif, ni de témoignage.",
        "Sauf si l'utilisateur a explicitement fourni une expérience vécue et vérifiée, rédige à la troisième personne / sur un ton d'évaluation éditoriale neutre",
        "(par exemple « Ce que propose le produit », « Les points examinés », « Ce qu'il faut retenir »).",
        "Sections suggérées : une mise en contexte (type \"context\" ou \"story\"), l'examen des atouts du produit (type \"benefit\" ou \"proof\", uniquement à partir des faits fournis),",
        "les points de vigilance ou objections traitées honnêtement (type \"objection\"), puis un verdict mesuré (type \"conclusion\") qui mène à l'appel à l'action.",
      ].join(" "),
    },
    {
      key: "problem_agitation_solution",
      label: "Problème → Agitation → Solution",
      tagline:
        "On nomme le problème, on en montre l'impact réel, puis la solution.",
      promptGuidance: [
        "Structure Problème → Agitation → Solution.",
        "Commence par une section de type \"problem\" qui nomme précisément le problème principal du client.",
        "Enchaîne avec une ou deux sections de type \"agitation\" qui montrent les conséquences CONCRÈTES et réalistes du problème, sans dramatiser faussement ni inventer de peurs.",
        "Présente ensuite une section de type \"solution\" qui positionne le produit comme la réponse, en t'appuyant sur la promesse principale et le mécanisme unique.",
        "Ajoute au besoin une section de type \"proof\" ou \"objection\" (uniquement à partir des preuves fournies), puis une section de type \"conclusion\" qui mène à l'appel à l'action.",
      ].join(" "),
    },
  ]);

const BY_KEY = new Map(FRAMEWORKS.map((f) => [f.key, f]));

export function getFramework(key: string): Framework | undefined {
  return BY_KEY.get(key as FrameworkKey);
}

export function isFrameworkKey(value: unknown): value is FrameworkKey {
  return typeof value === "string" && BY_KEY.has(value as FrameworkKey);
}
