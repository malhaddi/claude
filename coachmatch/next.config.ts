import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Les photos de coachs sont servies via <Avatar> (balise <img> Radix avec
   * fallback initiales), pas via next/image — pas de remotePatterns à
   * déclarer tant qu'on n'optimise pas les images distantes. Quand un vrai
   * stockage (Supabase Storage) sera branché, ajouter ici :
   *   images: { remotePatterns: [{ hostname: "<project>.supabase.co" }] }
   */
};

export default nextConfig;
