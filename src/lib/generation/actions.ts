"use server";

import { revalidatePath } from "next/cache";

import { getProvider, isProviderConfigured } from "@/lib/ai/provider";
import { requireUser } from "@/lib/auth/dal";
import { isSupabaseConfigured } from "@/lib/env";
import { generationContent } from "@/lib/generation/content";
import { runGeneration } from "@/lib/generation/generate";
import type { GenerationContext } from "@/lib/generation/prompt";
import type { AdvertorialDraft } from "@/lib/generation/types";
import {
  readGenerationForm,
  validateGeneration,
  type FieldErrors,
} from "@/lib/generation/validation";
import { getProject } from "@/lib/projects/dal";
import { getResearch } from "@/lib/projects/research-dal";
import { computeResearchProgress } from "@/lib/projects/research-progress";
import { createClient } from "@/lib/supabase/server";

export interface GenerationActionState {
  fieldErrors?: FieldErrors;
  formError?: string;
  success?: boolean;
  draft?: AdvertorialDraft;
}

const e = generationContent.errors;

/**
 * Generate ONE structured advertorial draft for a project the current user owns.
 *
 * Gating (all enforced server-side, before any provider call):
 * - `requireUser()` → a confirmed, authenticated session (unconfirmed users are
 *   already redirected by the guard). The `user_id` written is always the
 *   session's, never a form value.
 * - project ownership via the RLS-scoped DAL (foreign/absent id → notFound).
 * - a research row that is 100% complete (else researchIncomplete).
 *
 * Storage: only a valid generation is stored, as a NEW row with the next
 * `generation_version` for the project (never overwriting an earlier draft).
 * Provider internals are never surfaced; rate limits map to a French message
 * and are never auto-retried.
 */
export async function generateAdvertorial(
  projectId: string,
  _prevState: GenerationActionState,
  formData: FormData,
): Promise<GenerationActionState> {
  const validation = validateGeneration(readGenerationForm(formData));
  if (validation.fieldErrors) return { fieldErrors: validation.fieldErrors };

  const user = await requireUser();
  if (!isSupabaseConfigured) return { formError: e.notConfigured };
  if (!isProviderConfigured()) return { formError: e.aiNotConfigured };

  // RLS-scoped reads: a foreign/non-existent project returns null (no IDOR).
  const project = await getProject(projectId);
  if (!project) return { formError: e.notFound };

  const research = await getResearch(projectId);
  if (!research || !computeResearchProgress(research).ready) {
    return { formError: e.researchIncomplete };
  }

  const context: GenerationContext = {
    project,
    research,
    frameworkKey: validation.data.framework_key,
    userInstructions: validation.data.user_instructions,
  };

  const outcome = await runGeneration(getProvider(), context);
  if (!outcome.ok) {
    if (outcome.reason === "rate_limited") return { formError: e.rateLimited };
    if (outcome.reason === "not_configured") {
      return { formError: e.aiNotConfigured };
    }
    return { formError: e.generationFailed };
  }

  const supabase = await createClient();

  // Next version for THIS project = current max + 1 (first draft → 1).
  const { data: latest } = await supabase
    .from("advertorial_drafts")
    .select("generation_version")
    .eq("project_id", projectId)
    .order("generation_version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextVersion = (latest?.generation_version ?? 0) + 1;

  const { output } = outcome;
  const { data: inserted, error } = await supabase
    .from("advertorial_drafts")
    .insert({
      project_id: projectId,
      research_id: research.id,
      user_id: user.id,
      framework_key: validation.data.framework_key,
      status: "draft",
      generation_version: nextVersion,
      headline: output.headline,
      subheadline: output.subheadline ?? null,
      introduction: output.introduction,
      body_sections: output.body_sections,
      call_to_action_text: output.call_to_action_text,
      disclaimer: output.disclaimer ?? null,
      model_provider: outcome.modelProvider,
      model_name: outcome.modelName,
      prompt_version: outcome.promptVersion,
    })
    .select("*")
    .single();

  if (error || !inserted) return { formError: e.saveFailed };

  revalidatePath(`/dashboard/projets/${projectId}/generation`);
  return { success: true, draft: inserted as AdvertorialDraft };
}
