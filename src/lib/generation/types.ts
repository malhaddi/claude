import type { BodySection } from "@/lib/generation/schema";

/**
 * Shape of a row in `public.advertorial_drafts` (see the Supabase migration).
 * Defined by hand so the app never needs the service-role key or a build-time
 * Supabase connection. `body_sections` is stored as jsonb.
 */
export interface AdvertorialDraft {
  id: string;
  project_id: string;
  research_id: string | null;
  user_id: string;
  framework_key: string;
  status: string;
  generation_version: number;
  headline: string;
  subheadline: string | null;
  introduction: string;
  body_sections: BodySection[];
  call_to_action_text: string;
  disclaimer: string | null;
  model_provider: string;
  model_name: string;
  prompt_version: string;
  created_at: string;
  updated_at: string;
}

/** Compact row for the history list (no heavy jsonb). */
export interface AdvertorialDraftSummary {
  id: string;
  framework_key: string;
  status: string;
  generation_version: number;
  headline: string;
  created_at: string;
}
