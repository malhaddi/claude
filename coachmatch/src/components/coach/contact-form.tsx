"use client";

import { useState } from "react";
// lucide-react 1.x : les alias dépréciés ont été supprimés — c'est CircleCheck
// (noms « nom d'abord »), pas CheckCircle2.
import { CircleCheck, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  modeMeta,
  specializationMeta,
  type Coach,
  type CoachingMode,
} from "@/lib/types";

/**
 * Formulaire « demande de coaching » — la première brique du système de
 * contact. Les champs reprennent les colonnes de la table coaching_requests
 * (goal, preferred_mode, budget_cents, message) : à l'itération 2, la
 * soumission devient un simple INSERT Supabase (la policy RLS
 * requests_insert_as_client garantit que client_id = utilisateur connecté),
 * puis ouvre la conversation privée côté coach.
 *
 * En attendant l'auth, l'envoi est SIMULÉ : l'état passe à "sent" et on
 * affiche la confirmation — le parcours UX complet est donc déjà testable.
 */
export function ContactForm({ coach }: { coach: Coach }) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [goal, setGoal] = useState<string>(coach.specializations[0]);
  const [mode, setMode] = useState<CoachingMode>(coach.modes[0]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO(itération 2) :
    //   const supabase = createClient();               // lib/supabase/client
    //   await supabase.from("coaching_requests").insert({
    //     coach_id: coach.id, goal, preferred_mode: mode,
    //     message: …, budget_cents: … });
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <CircleCheck className="size-8 text-emerald-600" aria-hidden />
          <div>
            <p className="font-medium">Demande envoyée !</p>
            <p className="text-muted-foreground text-sm">
              {coach.fullName} vous répondra dans sa messagerie. (Démo : aucune
              donnée n&apos;est encore transmise.)
            </p>
          </div>
          {/* Reset dans un gestionnaire d'événement — jamais dans un effet. */}
          <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
            Envoyer une autre demande
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacter {coach.fullName.split(" ")[0]}</CardTitle>
        <CardDescription>
          Décrivez votre objectif — le coach vous répond en message privé.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-name">Votre nom</Label>
            <Input id="contact-name" name="name" required placeholder="Alex Dupont" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">Votre e-mail</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="alex@exemple.fr"
            />
          </div>

          {/* L'objectif est borné aux spécialités du coach : on évite les
              demandes hors sujet dès la saisie. */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-goal">Objectif principal</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger id="contact-goal" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {coach.specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {specializationMeta[spec].label} —{" "}
                    {specializationMeta[spec].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-mode">Format souhaité</Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as CoachingMode)}
            >
              <SelectTrigger id="contact-mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {coach.modes.map((coachMode) => (
                  <SelectItem key={coachMode} value={coachMode}>
                    {modeMeta[coachMode].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Votre message</Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              minLength={20}
              rows={4}
              placeholder="Votre niveau actuel, votre objectif, vos contraintes…"
            />
          </div>

          <Button type="submit" className="w-full">
            <Send aria-hidden />
            Envoyer ma demande
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
