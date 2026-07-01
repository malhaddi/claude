import type { Metadata } from "next";
import { Lock, MessageSquare, Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Messages",
};

/**
 * Messagerie privée — volontairement en placeholder pour l'itération 1 :
 * elle n'a de sens qu'avec l'authentification. Le modèle de données est
 * lui DÉJÀ prêt (tables conversations + messages, policies RLS limitant
 * l'accès aux deux participants — migrations 0001/0002).
 */
export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Card>
        <CardHeader>
          <MessageSquare className="text-muted-foreground size-8" aria-hidden />
          <CardTitle className="text-xl">Messagerie privée</CardTitle>
          <CardDescription>
            Les demandes de coaching envoyées depuis les fiches arriveront ici,
            et chaque coach y retrouvera ses conversations avec ses prospects.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-col gap-3 text-sm">
          <p className="flex items-start gap-2">
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            Confidentialité garantie par la base : les policies RLS
            n&apos;exposent une conversation qu&apos;à ses deux participants
            (voir supabase/migrations/0002_rls.sql).
          </p>
          <p className="flex items-start gap-2">
            <Zap className="mt-0.5 size-4 shrink-0" aria-hidden />
            Prochaine itération : connexion requise, boîte de réception par
            rôle (client / coach) et temps réel via Supabase Realtime sur la
            table messages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
