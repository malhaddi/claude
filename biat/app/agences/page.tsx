import type { Metadata } from "next";
import AgencesExplorer from "@/components/AgencesExplorer";

export const metadata: Metadata = {
  title: "Trouver une agence",
  description:
    "Plus de 205 agences BIAT partout en Tunisie. Trouvez la vôtre, consultez ses horaires et prenez rendez-vous avec un conseiller.",
};

export default function AgencesPage() {
  return <AgencesExplorer />;
}
