import { cache } from "react";

import { getUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/projects/types";

/**
 * Read access to projects. Every query runs through the authenticated Supabase
 * client, so RLS scopes results to `auth.uid()` automatically — a foreign or
 * non-existent id simply returns nothing (no IDOR). We also short-circuit when
 * there is no session so we never issue an anonymous query.
 */

export const getProjects = cache(async (): Promise<Project[]> => {
  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Project[];
});

/** Returns the project only if it exists AND belongs to the current user. */
export const getProject = cache(
  async (id: string): Promise<Project | null> => {
    const user = await getUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return data as Project;
  },
);
