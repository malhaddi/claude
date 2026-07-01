"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoachCard } from "@/components/search/coach-card";
import { SearchFilters } from "@/components/search/search-filters";
import {
  applyFilters,
  countActiveFilters,
  defaultFilters,
  getCities,
  sortCoaches,
  sortMeta,
  sortOrder,
  type CoachFilters,
  type SortKey,
} from "@/lib/filters";
import type { Coach } from "@/lib/types";

/**
 * COMPOSANT PRINCIPAL de l'annuaire : barre de recherche + filtres + grille.
 *
 * Architecture :
 *  - Les coachs arrivent EN PROP depuis un Server Component (la page), qui
 *    les tient de la façade lib/coaches.ts. Ce composant ne sait pas si les
 *    données viennent d'un mock ou de Supabase — il n'a pas à le savoir.
 *  - L'état des filtres est UN SEUL objet CoachFilters (lib/filters.ts) :
 *    une source de vérité unique, sérialisable telle quelle vers la RPC SQL
 *    `search_coaches` quand le filtrage passera côté serveur.
 *  - Le filtrage/tri est dérivé par useMemo — jamais stocké dans un état
 *    secondaire (pas de setState dans un effet, conformément au lint du dépôt).
 */
export function CoachSearch({ coaches }: { coaches: Coach[] }) {
  const [filters, setFilters] = useState<CoachFilters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("rating");

  // Le select « Ville » est alimenté par les données réelles : une ville
  // n'apparaît que si au moins un coach y exerce.
  const cities = useMemo(() => getCities(coaches), [coaches]);

  const results = useMemo(
    () => sortCoaches(applyFilters(coaches, filters), sort),
    [coaches, filters, sort]
  );

  const activeCount = countActiveFilters(filters);

  return (
    <div className="flex flex-col gap-5">
      {/* Barre de recherche libre — complète les filtres structurés. */}
      <div className="relative">
        <Search
          className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          type="search"
          value={filters.query}
          onChange={(event) =>
            setFilters({ ...filters, query: event.target.value })
          }
          placeholder="Rechercher un coach, une ville, une approche… (ex : « powerlifting Lyon »)"
          className="h-11 pl-9"
          aria-label="Recherche libre de coachs"
        />
      </div>

      <SearchFilters filters={filters} onChange={setFilters} cities={cities} />

      {/* Ligne de résultats : compteur à gauche, tri à droite. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-semibold">{results.length}</span>{" "}
          coach{results.length > 1 ? "s" : ""} disponible
          {results.length > 1 ? "s" : ""}
          {activeCount > 0 && (
            <>
              {" "}
              ·{" "}
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="hover:text-foreground underline underline-offset-2"
              >
                réinitialiser les filtres ({activeCount})
              </button>
            </>
          )}
        </p>

        <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
          <SelectTrigger size="sm" aria-label="Trier les résultats">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {sortOrder.map((key) => (
              <SelectItem key={key} value={key}>
                {sortMeta[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      ) : (
        /* État vide actionnable : on propose la sortie plutôt qu'un cul-de-sac. */
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <SearchX className="text-muted-foreground size-8" aria-hidden />
          <div>
            <p className="font-medium">Aucun coach ne correspond à ces critères</p>
            <p className="text-muted-foreground text-sm">
              Essayez d&apos;élargir la zone, le budget ou les spécialisations.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setFilters(defaultFilters)}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
