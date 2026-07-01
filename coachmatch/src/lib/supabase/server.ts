/**
 * Client Supabase SERVEUR — pour les Server Components, Server Actions et
 * route handlers (lecture de l'annuaire, création de session Stripe…).
 *
 * La session utilisateur vit dans les cookies : @supabase/ssr la lit/rafraîchit
 * ici. Next 16 : cookies() est asynchrone, d'où le `await` (et donc une
 * factory async).
 */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component : l'écriture de cookies y est
            // interdite. Sans conséquence si un proxy/middleware rafraîchit
            // la session (à ajouter avec l'auth, itération 2).
          }
        },
      },
    }
  );
}
