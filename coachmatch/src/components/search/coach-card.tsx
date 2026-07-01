import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  availabilityMeta,
  modeMeta,
  specializationMeta,
  type Coach,
} from "@/lib/types";

/** Initiales pour le fallback d'avatar (réseau coupé, photo manquante). */
function initials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Carte d'un coach dans la grille de résultats. Purement présentationnelle
 * (aucun état) : tout ce que le brief demande de voir AVANT de contacter —
 * photo, prix, spécialisations, format, ville, note — tient sur la carte.
 */
export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <Card className="gap-4 py-5 transition-shadow hover:shadow-md">
      <CardHeader className="items-center gap-3 [grid-template-columns:auto_1fr]">
        {/* La photo d'abord : on doit « voir la tête » du coach. */}
        <Avatar className="row-span-2 size-16 border">
          <AvatarImage src={coach.avatarUrl} alt={`Photo de ${coach.fullName}`} />
          <AvatarFallback className="text-lg font-semibold">
            {initials(coach.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1.5">
          <Link
            href={`/coachs/${coach.slug}`}
            className="font-semibold hover:underline"
          >
            {coach.fullName}
          </Link>
          {coach.verified && (
            <BadgeCheck
              className="size-4 shrink-0 text-sky-600"
              aria-label="Profil vérifié"
            />
          )}
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {coach.headline}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {coach.specializations.map((spec) => (
            <Badge
              key={spec}
              variant="outline"
              className={specializationMeta[spec].badgeClassName}
            >
              {specializationMeta[spec].label}
            </Badge>
          ))}
          {coach.modes.map((mode) => (
            <Badge key={mode} variant="secondary">
              {modeMeta[mode].shortLabel}
            </Badge>
          ))}
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden />
            {coach.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star
              className="size-3.5 fill-amber-400 text-amber-400"
              aria-hidden
            />
            <span className="text-foreground font-medium">
              {coach.rating.toFixed(1)}
            </span>
            ({coach.reviewCount} avis)
          </span>
          <span>{coach.yearsExperience} ans d&apos;expérience</span>
        </div>

        <p className="text-muted-foreground text-xs">
          Disponible :{" "}
          {coach.availability.map((slot) => availabilityMeta[slot].label).join(" · ")}
        </p>
      </CardContent>

      <CardFooter className="mt-auto justify-between border-t pt-4">
        <p className="text-sm">
          <span className="text-lg font-semibold">{coach.pricePerSession} €</span>
          <span className="text-muted-foreground"> / séance</span>
        </p>
        <Button size="sm" asChild>
          <Link href={`/coachs/${coach.slug}`}>Voir le profil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
