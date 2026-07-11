/**
 * Shape of a row in the `public.projects` table (see the Supabase migration).
 * We define it by hand rather than generating types so the app never needs the
 * service-role key or a build-time Supabase connection.
 */
export interface Project {
  id: string;
  user_id: string;
  name: string;
  product_url: string | null;
  product_title: string | null;
  product_description: string | null;
  product_benefits: string | null;
  target_audience: string | null;
  offer_text: string | null;
  product_image_url: string | null;
  destination_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

/** Column subset a user may write (never `id`, `user_id`, timestamps, status). */
export interface ProjectInput {
  name: string;
  product_url: string | null;
  product_title: string | null;
  product_description: string | null;
  product_benefits: string | null;
  target_audience: string | null;
  offer_text: string | null;
  product_image_url: string | null;
  destination_url: string | null;
}
