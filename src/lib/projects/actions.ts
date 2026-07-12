"use server";

import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/auth/dal";
import { projectsContent } from "@/lib/projects/content";
import {
  readProjectForm,
  validateProject,
  type FieldErrors,
} from "@/lib/projects/validation";
import { createClient } from "@/lib/supabase/server";

export interface ProjectActionState {
  fieldErrors?: FieldErrors;
  formError?: string;
  success?: boolean;
}

const e = projectsContent.errors;

/**
 * Create a project owned by the current user.
 *
 * Security: the identity comes from `requireUser()` (the validated session) —
 * any `user_id` present in the submitted form is ignored. RLS is the final
 * check: the insert's WITH CHECK forbids a mismatched user_id.
 */
export async function createProject(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const validation = validateProject(readProjectForm(formData));
  if (validation.fieldErrors) return { fieldErrors: validation.fieldErrors };

  const user = await requireUser();
  if (!isSupabaseConfigured) return { formError: e.notConfigured };

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("projects")
    .insert({ ...validation.data, user_id: user.id })
    .select("id")
    .single();

  if (error || !inserted) return { formError: e.saveFailed };

  redirect(`/dashboard/projets/${inserted.id}`);
}

/**
 * Update a project the current user owns. The id is a bound server-action
 * argument (not a trusted form field). The update is filtered by both id AND
 * user_id, and RLS enforces ownership again — a foreign id updates 0 rows.
 */
export async function updateProject(
  id: string,
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const validation = validateProject(readProjectForm(formData));
  if (validation.fieldErrors) return { fieldErrors: validation.fieldErrors };

  const user = await requireUser();
  if (!isSupabaseConfigured) return { formError: e.notConfigured };

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("projects")
    .update(validation.data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) return { formError: e.saveFailed };
  if (!updated) return { formError: e.notFound };

  return { success: true };
}

/**
 * Delete a project the current user owns, then return to the dashboard.
 * Filtered by id AND user_id (plus RLS), so a foreign id deletes nothing.
 */
export async function deleteProject(id: string): Promise<void> {
  const user = await requireUser();
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  }
  redirect("/dashboard");
}
