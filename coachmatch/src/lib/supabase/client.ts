/**
 * Client Supabase NAVIGATEUR — pour les composants "use client"
 * (envoi d'une demande de coaching, messagerie temps réel, auth UI).
 *
 * La clé anon est publique par conception : les droits réels sont appliqués
 * par les policies RLS (supabase/migrations/0002_rls.sql).
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
