import { redirect } from "next/navigation";

/**
 * Pas de landing page dédiée pour le MVP : la proposition de valeur EST la
 * recherche de coachs, on y envoie directement. Une vraie home marketing
 * pourra remplacer cette redirection sans toucher au reste.
 */
export default function Home() {
  redirect("/coachs");
}
