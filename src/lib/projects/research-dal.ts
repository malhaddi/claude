import { cache } from "react";

import { getUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { ProjectResearch } from "@/lib/projects/research-types";

/**
 * Read access to a project's research. RLS scopes the query to the current
 * user, so a foreign project's research is never returned. Returns null when
 * there is no session, no research row, or the project is not the user's.
 */
export const getResearch = cache(
  async (projectId: string): Promise<ProjectResearch | null> => {
    const user = await getUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_research")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error || !data) return null;
    return data as ProjectResearch;
  },
);
