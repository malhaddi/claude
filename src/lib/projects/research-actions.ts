"use server";

import { revalidatePath } from "next/cache";

import { isSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/auth/dal";
import { researchContent } from "@/lib/projects/research-content";
import {
  readResearchForm,
  validateResearch,
  type FieldErrors,
} from "@/lib/projects/research-validation";
import { createClient } from "@/lib/supabase/server";

export interface ResearchActionState {
  fieldErrors?: FieldErrors;
  formError?: string;
  success?: boolean;
}

const e = researchContent.errors;

/**
 * Save (create or update) the single research row for a project.
 *
 * Security:
 * - `projectId` is a bound server-action argument, not a trusted form field.
 * - identity comes from `requireUser()` (a confirmed session); an unconfirmed
 *   user is already redirected by the guard. Any `user_id` in the form is
 *   ignored — we always write `user_id: user.id`.
 * - project ownership is verified before writing (blocks attaching research to
 *   a project the user does not own / project_id spoofing).
 * - RLS policies + a DB ownership trigger are the final enforcement layer.
 * - upsert on the unique `project_id` guarantees one row per project (no
 *   duplicate rows under concurrent saves).
 */
export async function saveResearch(
  projectId: string,
  _prevState: ResearchActionState,
  formData: FormData,
): Promise<ResearchActionState> {
  const validation = validateResearch(readResearchForm(formData));
  if (validation.fieldErrors) return { fieldErrors: validation.fieldErrors };

  const user = await requireUser();
  if (!isSupabaseConfigured) return { formError: e.notConfigured };

  const supabase = await createClient();

  // Verify the project belongs to the current user before writing.
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!project) return { formError: e.notFound };

  const { error } = await supabase.from("project_research").upsert(
    { project_id: projectId, user_id: user.id, ...validation.data },
    { onConflict: "project_id" },
  );

  if (error) return { formError: e.saveFailed };

  revalidatePath(`/dashboard/projets/${projectId}`);
  revalidatePath(`/dashboard/projets/${projectId}/recherche`);
  // Saving research can flip the 100% gate, which unlocks the generation tab
  // and the generation route — refresh its cached render too.
  revalidatePath(`/dashboard/projets/${projectId}/generation`);
  return { success: true };
}
