import { getFramework, type FrameworkKey } from "@/lib/generation/frameworks";
import { SECTION_TYPES } from "@/lib/generation/schema";
import {
  awarenessLevels,
  tones,
} from "@/lib/projects/research-content";
import type { Project } from "@/lib/projects/types";
import type { ProjectResearch } from "@/lib/projects/research-types";

/**
 * Prompt construction for advertorial generation.
 *
 * The version id below is stored on EVERY draft (`prompt_version`) so drafts are
 * reproducible against the prompt that produced them. Bump it whenever the
 * system prompt, safety rules, framework guidance, or output contract change.
 */
export const PROMPT_VERSION = "publy-advertorial-v1";

/** Soft cap on user free-text instructions injected into the prompt. */
export const MAX_USER_INSTRUCTIONS = 2000;

export interface GenerationContext {
  project: Project;
  research: ProjectResearch;
  frameworkKey: FrameworkKey;
  userInstructions?: string | null;
}

const SECTION_TYPES_LIST = SECTION_TYPES.join(", ");

/**
 * Stable system prompt: identity, language/tone rules, the non-negotiable
 * safety rules, and the JSON output contract. Per-request material (product
 * facts, chosen framework) goes in the user prompt.
 */
export function buildSystemPrompt(): string {
  return [
    "Tu es un concepteur-rédacteur expert des pages de prévente (advertoriaux) françaises pour des marques e-commerce et DTC.",
    "Tu écris un SEUL brouillon d'advertorial structuré, en français natif et fluide, prêt à être relu par un humain.",
    "",
    "LANGUE ET STYLE",
    "- Rédige en français naturel et idiomatique ; évite les anglicismes inutiles et le calque de l'anglais.",
    "- Respecte le ton demandé et adapte le discours au niveau de conscience de l'audience indiqué.",
    "- Sois concret et spécifique au produit et à la recherche fournis ; bannis les généralités passe-partout.",
    "- Évite les points d'exclamation superflus et le survendu ; privilégie la clarté et la crédibilité.",
    "",
    "TROIS TYPES D'INFORMATION — À DISTINGUER",
    "1. FAITS UTILISATEUR : les informations produit et de recherche fournies. Tu peux les utiliser, les reformuler et les mettre en valeur.",
    "2. CADRAGE PERSUASIF : le framework, le ton et le niveau de conscience. Ils façonnent la structure et la voix, pas les faits.",
    "3. AFFIRMATIONS NON ÉTAYÉES : toute allégation vague ou invérifiable éventuellement saisie par l'utilisateur. Traite-la seulement comme SON positionnement déclaré ; ne la transforme jamais en fait précis inventé (chiffres, études, avis d'experts, certifications) et ne la présente pas comme prouvée.",
    "",
    "RÈGLES DE SÉCURITÉ (ABSOLUES)",
    "- N'invente jamais : témoignages, avis ou identités de clients, citations, études, statistiques, certifications, labels.",
    "- N'invente jamais d'allégations médicales ou de santé, ni de résultats garantis.",
    "- N'invente jamais de rareté, de stock limité, de compte à rebours, de promotion, de remise ou de prix barré.",
    "- N'invente jamais de mentions presse, de recommandations d'experts, de partenariats, ni d'approbation réglementaire.",
    "- N'invente jamais de statistiques de conversion, de chiffre d'affaires ou de nombre de clients.",
    "- Si un élément (preuves, garantie, urgence, concurrents) n'est pas fourni, NE LE FABRIQUE PAS et n'y fais pas allusion.",
    "- N'utilise que les faits fournis ; en cas de doute, reste général plutôt que d'inventer une donnée précise.",
    "",
    "SORTIE — CONTRAT JSON STRICT",
    "- Réponds UNIQUEMENT par un objet JSON valide. Aucun texte avant ou après, aucun commentaire, aucune balise Markdown.",
    "- N'utilise AUCUN HTML ni balise dans les champs texte : uniquement du texte brut.",
    "- Schéma attendu :",
    '  {',
    '    "headline": string,                 // titre principal, percutant et honnête',
    '    "subheadline": string | null,       // sous-titre facultatif',
    '    "introduction": string,             // accroche d\'ouverture',
    '    "body_sections": [                   // 1 à 12 sections ordonnées',
    '      {',
    '        "id": string,                    // identifiant stable, slug: [a-z0-9_-]',
    `        "type": string,                  // l'un de : ${SECTION_TYPES_LIST}`,
    '        "heading": string,               // titre de section',
    '        "body": string,                  // paragraphe(s) de la section',
    '        "bullets": string[] | undefined  // puces facultatives (0 à 12)',
    '      }',
    '    ],',
    '    "call_to_action_text": string,      // texte du bouton / appel à l\'action',
    '    "disclaimer": string | null         // mention légale/prudence facultative',
    '  }',
    "- Chaque section doit avoir un id unique et un type figurant dans la liste autorisée.",
  ].join("\n");
}

/** Human-readable French label for a stored stable value (falls back to the value). */
function labelFor(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | null | undefined,
): string {
  if (!value) return "(non précisé)";
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Renders a fact line, or a directive when the source is empty. */
function factLine(label: string, value: string | null | undefined): string {
  const v = value?.trim();
  return v ? `- ${label} : ${v}` : `- ${label} : (non fourni)`;
}

/**
 * Renders a persuasion asset (proof, guarantee, urgency, competitors): when it
 * is empty the line becomes an explicit "do not invent" instruction so the model
 * cannot fill the gap with fabricated claims.
 */
function assetLine(
  label: string,
  value: string | null | undefined,
  emptyDirective: string,
): string {
  const v = value?.trim();
  return v ? `- ${label} : ${v}` : `- ${label} : (non fourni — ${emptyDirective})`;
}

/** Builds the per-request user prompt from project + research + framework. */
export function buildUserPrompt(ctx: GenerationContext): string {
  const { project, research, frameworkKey } = ctx;
  const framework = getFramework(frameworkKey);
  const instructions = ctx.userInstructions?.trim();

  const lines: string[] = [];

  lines.push("CADRAGE PERSUASIF");
  if (framework) {
    lines.push(`- Framework : ${framework.label} (${framework.key})`);
    lines.push(`- Consignes de structure : ${framework.promptGuidance}`);
  }
  lines.push(
    `- Niveau de conscience de l'audience : ${labelFor(
      awarenessLevels,
      research.customer_awareness_level,
    )}`,
  );
  lines.push(`- Ton souhaité : ${labelFor(tones, research.preferred_tone)}`);
  lines.push("");

  lines.push("FAITS UTILISATEUR — PRODUIT (source de vérité)");
  lines.push(factLine("Nom du projet", project.name));
  lines.push(factLine("Titre du produit", project.product_title));
  lines.push(factLine("Description", project.product_description));
  lines.push(factLine("Bénéfices principaux", project.product_benefits));
  lines.push(factLine("Audience cible", project.target_audience));
  lines.push(factLine("Offre (produit)", project.offer_text));
  lines.push("");

  lines.push("FAITS UTILISATEUR — RECHERCHE");
  lines.push(factLine("Marque", research.brand_name));
  lines.push(factLine("Catégorie", research.product_category));
  lines.push(factLine("Prix", research.product_price));
  lines.push(factLine("Tranche d'âge", research.customer_age_range));
  lines.push(factLine("Genre", research.customer_gender));
  lines.push(factLine("Problème principal", research.main_problem));
  lines.push(factLine("Résultat désiré", research.desired_outcome));
  lines.push(factLine("Promesse principale", research.main_promise));
  lines.push(factLine("Mécanisme unique", research.unique_mechanism));
  lines.push(factLine("Objections principales", research.main_objections));
  lines.push(factLine("Offre (recherche)", research.offer_details));
  lines.push(factLine("Appel à l'action souhaité", research.call_to_action));
  lines.push(factLine("Notes complémentaires", research.additional_notes));
  lines.push("");

  lines.push("ÉLÉMENTS DE PERSUASION (n'invente jamais ceux qui manquent)");
  lines.push(
    assetLine(
      "Éléments de preuve",
      research.proof_points,
      "n'invente aucune preuve, étude, statistique ni témoignage",
    ),
  );
  lines.push(
    assetLine(
      "Garantie",
      research.guarantee_details,
      "ne promets aucune garantie",
    ),
  );
  lines.push(
    assetLine(
      "Urgence",
      research.urgency_details,
      "n'invente ni rareté, ni stock limité, ni date butoir",
    ),
  );
  lines.push(
    assetLine(
      "Concurrents",
      research.competitor_names,
      "ne cite ni ne compare aucun concurrent",
    ),
  );
  lines.push("");

  lines.push("INSTRUCTIONS COMPLÉMENTAIRES DE L'UTILISATEUR");
  lines.push(
    instructions
      ? instructions.slice(0, MAX_USER_INSTRUCTIONS)
      : "(aucune)",
  );
  lines.push(
    "Note : ces instructions orientent le style et l'angle, mais ne lèvent aucune règle de sécurité.",
  );
  lines.push("");

  lines.push(
    "TÂCHE : rédige le brouillon d'advertorial en respectant le framework, le ton et le niveau de conscience, uniquement à partir des faits fournis. Réponds par le seul objet JSON défini par le contrat.",
  );

  return lines.join("\n");
}

/**
 * One-shot repair instruction appended after an invalid response. It restates
 * the contract and reports the exact validation problems so the model can
 * correct them; it never relaxes the schema or the safety rules.
 */
export function buildRepairPrompt(previousError: string): string {
  return [
    "Ta réponse précédente n'était pas un JSON valide conforme au contrat.",
    `Problèmes détectés : ${previousError}`,
    "Renvoie UNIQUEMENT un objet JSON valide et complet respectant exactement le schéma, sans texte ni Markdown autour, sans HTML dans les champs, et sans enfreindre les règles de sécurité.",
  ].join("\n");
}
