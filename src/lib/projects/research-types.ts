/**
 * Shape of a row in `public.project_research` (see the Supabase migration).
 * Defined by hand so the app never needs the service-role key or a build-time
 * Supabase connection.
 */
export interface ProjectResearch {
  id: string;
  project_id: string;
  user_id: string;
  brand_name: string | null;
  product_category: string | null;
  product_price: string | null;
  customer_age_range: string | null;
  customer_gender: string | null;
  customer_awareness_level: string | null;
  main_problem: string | null;
  desired_outcome: string | null;
  main_promise: string | null;
  unique_mechanism: string | null;
  main_objections: string | null;
  competitor_names: string | null;
  proof_points: string | null;
  offer_details: string | null;
  guarantee_details: string | null;
  urgency_details: string | null;
  preferred_tone: string | null;
  call_to_action: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Writable columns (never id, project_id, user_id, timestamps). */
export type ResearchInput = Omit<
  ProjectResearch,
  "id" | "project_id" | "user_id" | "created_at" | "updated_at"
>;
