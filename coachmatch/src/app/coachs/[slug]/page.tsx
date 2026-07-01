import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, GraduationCap, MapPin, Quote, Star } from "lucide-react";

import { ContactForm } from "@/components/coach/contact-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCoachBySlug, getCoaches } from "@/lib/coaches";
import { availabilityMeta, modeMeta, specializationMeta } from "@/lib/types";

/**
 * Fiche coach — Server Component. Next 16 : `params` est une Promise, on
 * l'attend avant usage. Seul le formulaire de contact est un Client Component.
 */
type PageProps = { params: Promise<{ slug: string }> };

// Les fiches publiées sont connues au build : on les pré-rend (SSG).
export async function generateStaticParams() {
  const coaches = await getCoaches();
  return coaches.map((coach) => ({ slug: coach.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);
  if (!coach) return { title: "Coach introuvable" };
  return {
    title: coach.fullName,
    description: coach.headline,
  };
}

function initials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function CoachPage({ params }: PageProps) {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);
  if (!coach) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ── Colonne principale : le profil ─────────────────────────── */}
        <article className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar className="size-24 border sm:size-28">
              <AvatarImage
                src={coach.avatarUrl}
                alt={`Photo de ${coach.fullName}`}
              />
              <AvatarFallback className="text-2xl font-semibold">
                {initials(coach.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                {coach.fullName}
                {coach.verified && (
                  <BadgeCheck
                    className="size-5 text-sky-600"
                    aria-label="Profil vérifié"
                  />
                )}
              </h1>
              <p className="text-muted-foreground">{coach.headline}</p>

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

              <div className="flex flex-wrap gap-1.5 pt-1">
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
            </div>
          </header>

          <Separator />

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold">À propos</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {coach.bio}
            </p>
          </section>

          {/* La méthodologie a sa propre section : c'est LE critère
              différenciant entre deux coachs au même prix. */}
          <section className="flex flex-col gap-2">
            <h2 className="font-semibold">Méthodologie</h2>
            <blockquote className="bg-muted/50 flex gap-3 rounded-lg border p-4">
              <Quote className="text-muted-foreground size-4 shrink-0" aria-hidden />
              <p className="text-sm leading-relaxed italic">{coach.methodology}</p>
            </blockquote>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold">Certifications</h2>
            <ul className="flex flex-col gap-1.5">
              {coach.certifications.map((certification) => (
                <li
                  key={certification}
                  className="text-muted-foreground flex items-center gap-2 text-sm"
                >
                  <GraduationCap className="size-4 shrink-0" aria-hidden />
                  {certification}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold">Créneaux habituels</h2>
            <div className="flex flex-wrap gap-2">
              {coach.availability.map((slot) => (
                <Badge key={slot} variant="secondary">
                  {availabilityMeta[slot].label}
                </Badge>
              ))}
            </div>
          </section>
        </article>

        {/* ── Colonne latérale : tarifs + contact, sticky au scroll ───── */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Tarifs</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <PriceRow label="Séance individuelle" value={`${coach.pricePerSession} €`} />
              {coach.priceMonthly !== undefined && (
                <PriceRow label="Suivi mensuel" value={`${coach.priceMonthly} €`} />
              )}
              <p className="text-muted-foreground pt-1 text-xs">
                Formats proposés :{" "}
                {coach.modes.map((mode) => modeMeta[mode].label).join(" · ")}
              </p>
            </CardContent>
          </Card>

          <ContactForm coach={coach} />
        </aside>
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-base font-semibold">{value}</span>
    </div>
  );
}
