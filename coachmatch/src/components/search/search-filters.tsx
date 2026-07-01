"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PRICE_RANGE, type CoachFilters } from "@/lib/filters";
import {
  availabilityMeta,
  availabilityOrder,
  genderMeta,
  modeMeta,
  specializationMeta,
  specializationOrder,
  type AvailabilityWindow,
  type CoachingMode,
  type Gender,
  type Specialization,
} from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Panneau de filtres granulaires. Composant CONTRÔLÉ : il ne possède aucun
 * état — il reçoit l'objet CoachFilters et remonte un objet complet via
 * onChange. Le parent (CoachSearch) reste l'unique source de vérité, ce qui
 * permet le « réinitialiser » global et, plus tard, la synchronisation des
 * filtres dans l'URL (searchParams) pour des recherches partageables.
 *
 * Choix d'UX par type de critère :
 *  - multi-sélection (spécialisations, disponibilités) → puces à bascule,
 *    tout est visible d'un coup d'œil ;
 *  - choix exclusif (mode, sexe, ville) → <Select> compact ;
 *  - borne continue (prix max) → slider.
 */
export function SearchFilters({
  filters,
  onChange,
  cities,
}: {
  filters: CoachFilters;
  onChange: (filters: CoachFilters) => void;
  cities: string[];
}) {
  const toggleSpecialization = (spec: Specialization) => {
    onChange({
      ...filters,
      specializations: filters.specializations.includes(spec)
        ? filters.specializations.filter((s) => s !== spec)
        : [...filters.specializations, spec],
    });
  };

  const toggleAvailability = (slot: AvailabilityWindow) => {
    onChange({
      ...filters,
      availability: filters.availability.includes(slot)
        ? filters.availability.filter((a) => a !== slot)
        : [...filters.availability, slot],
    });
  };

  const noPriceCap = filters.maxPrice >= PRICE_RANGE.max;

  return (
    <div className="bg-card flex flex-col gap-5 rounded-xl border p-4 sm:p-5">
      {/* Spécialisations — le critère n° 1, mis en avant. */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Spécialisation</legend>
        <div className="flex flex-wrap gap-2">
          {specializationOrder.map((spec) => {
            const meta = specializationMeta[spec];
            const active = filters.specializations.includes(spec);
            return (
              <button
                key={spec}
                type="button"
                onClick={() => toggleSpecialization(spec)}
                aria-pressed={active}
                title={meta.description}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? meta.badgeClassName
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-mode">Format</Label>
          <Select
            value={filters.mode}
            onValueChange={(value) =>
              onChange({ ...filters, mode: value as CoachingMode | "all" })
            }
          >
            <SelectTrigger id="filter-mode" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">En ligne ou sur place</SelectItem>
              {(Object.keys(modeMeta) as CoachingMode[]).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {modeMeta[mode].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-gender">Sexe du coach</Label>
          <Select
            value={filters.gender}
            onValueChange={(value) =>
              onChange({ ...filters, gender: value as Gender | "all" })
            }
          >
            <SelectTrigger id="filter-gender" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Indifférent</SelectItem>
              {(Object.keys(genderMeta) as Gender[]).map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {genderMeta[gender].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          {/* Ville exacte pour le MVP ; le rayon GPS (PostGIS) prendra ce
              même emplacement quand la géolocalisation navigateur sera branchée. */}
          <Label htmlFor="filter-city">Ville</Label>
          <Select
            value={filters.city}
            onValueChange={(value) => onChange({ ...filters, city: value })}
          >
            <SelectTrigger id="filter-city" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-price">
            Budget max
            <span className="text-muted-foreground ml-auto font-normal">
              {noPriceCap ? "illimité" : `${filters.maxPrice} € / séance`}
            </span>
          </Label>
          <Slider
            id="filter-price"
            value={[filters.maxPrice]}
            min={PRICE_RANGE.min}
            max={PRICE_RANGE.max}
            step={PRICE_RANGE.step}
            onValueChange={([value]) => onChange({ ...filters, maxPrice: value })}
            className="h-9"
            aria-label="Budget maximum par séance"
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">
          Vos disponibilités{" "}
          <span className="text-muted-foreground font-normal">(optionnel)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {availabilityOrder.map((slot) => {
            const active = filters.availability.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => toggleAvailability(slot)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {availabilityMeta[slot].label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
