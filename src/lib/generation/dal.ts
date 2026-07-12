import { cache } from "react";

import { getUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type {
  AdvertorialDraft,
  AdvertorialDraftSummary,
} from "@/lib/generation/types";

/**
 * Read access to advertorial drafts. Every query runs through the authenticated
 * Supabase client, so RLS scopes results to `auth.uid()` automatically — a
 * foreign or non-existent id simply returns nothing (no IDOR). We short-circuit
 * when there is no session so we never issue an anonymous query.
 */

const SUMMARY_COLUMNS =
  "id, framework_key, status, generation_version, headline, created_at";

/** Draft summaries for a project's history, newest version first. */
export const getDrafts = cache(
  async (projectId: string): Promise<AdvertorialDraftSummary[]> => {
    const user = await getUser();
    if (!user) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("advertorial_drafts")
      .select(SUMMARY_COLUMNS)
      .eq("project_id", projectId)
      .order("generation_version", { ascending: false });

    if (error || !data) return [];
    return data as AdvertorialDraftSummary[];
  },
);

/** The most recent draft for a project, or null. */
export const getLatestDraft = cache(
  async (projectId: string): Promise<AdvertorialDraft | null> => {
    const user = await getUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("advertorial_drafts")
      .select("*")
      .eq("project_id", projectId)
      .order("generation_version", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as AdvertorialDraft;
  },
);

/** A single draft by id, only if it exists AND belongs to the current user. */
export const getDraft = cache(
  async (id: string): Promise<AdvertorialDraft | null> => {
    const user = await getUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("advertorial_drafts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return data as AdvertorialDraft;
  },
);
