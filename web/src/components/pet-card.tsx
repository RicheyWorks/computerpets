import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Meter } from "@/components/ui/progress";
import { findSpecies, portraitSrc, rarityLabel, type Rarity } from "@/lib/pets/catalog";
import type { CompanionView } from "@/lib/pets/actions";
import { bondScore, moodWord } from "@/lib/pets/care";
import { isLivingSpecies } from "@/lib/pets/living";
import { lookHint } from "@/lib/pets/nest";
import { cn } from "@/lib/utils";

const TONE: Record<Rarity, "common" | "uncommon" | "rare" | "legendary"> = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  LEGENDARY: "legendary",
};

export function PetPortrait({
  speciesKey,
  alt,
  className,
}: {
  speciesKey: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={portraitSrc(speciesKey)}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export function RarityBadge({ rarity }: { rarity: string }) {
  const key = (rarity as Rarity) in TONE ? (rarity as Rarity) : "COMMON";
  return <Badge tone={TONE[key]}>{rarityLabel(key)}</Badge>;
}

export function PetCard({ pet }: { pet: CompanionView }) {
  const species = findSpecies(pet.species_key);
  const score = bondScore(pet);

  return (
    <Link
      to="/pets/$key"
      params={{ key: pet.id }}
      className="group flex gap-3 overflow-hidden rounded-[var(--radius-sm)] border border-border bg-bg/40 no-underline transition-colors duration-200 hover:border-border-strong"
    >
      <div className="relative size-20 shrink-0 overflow-hidden bg-elevated">
        <PetPortrait
          speciesKey={pet.species_key}
          alt={pet.name}
          className="transition-transform duration-400 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1 py-2 pr-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight text-fg">{pet.name}</p>
            <p className="mt-0.5 text-[11px] text-subtle">{species?.displayName ?? pet.species_key}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <RarityBadge rarity={pet.rarity} />
            {pet.is_active ? <Badge>On desk</Badge> : null}
          </div>
        </div>
        <p className="text-xs text-muted">
          {pet.stage} · {pet.origin === "nest" ? "from the nest" : "drawn"}
        </p>
        <p className="text-sm text-muted">The kennel guest is a room. {lookHint(pet)}.</p>
        <p className="text-xs text-subtle">{species?.temperament} · {moodWord(pet)}</p>
        <Meter label="Bond" value={score} />
      </div>
    </Link>
  );
}

export function SpeciesCard({
  speciesKey,
  name,
  rarity,
  blurb,
  to,
}: {
  speciesKey: string;
  name: string;
  rarity: string;
  blurb: string;
  to?: string;
}) {
  const inner = (
    <>
      <div className="relative aspect-square overflow-hidden bg-elevated">
        <PetPortrait speciesKey={speciesKey} alt={name} />
        <div className="absolute left-3 top-3 flex gap-2">
          <RarityBadge rarity={rarity} />
          {isLivingSpecies(speciesKey) ? <Badge>Awake</Badge> : null}
        </div>
      </div>
      <div className="space-y-1.5 p-4">
        <p className="font-display text-lg leading-tight">{name}</p>
        <p className="text-sm text-muted">{blurb}</p>
      </div>
    </>
  );

  if (to) {
    const demoSlug = to.startsWith("/demo/") ? to.slice("/demo/".length) : null;
    return (
      <Link
        to={demoSlug ? "/demo/$slug" : (to as "/")}
        params={demoSlug ? { slug: demoSlug } : undefined}
        search={demoSlug ? undefined : isLivingSpecies(speciesKey) ? { pet: speciesKey } : undefined}
        className="block overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface no-underline transition-colors duration-200 hover:border-border-strong"
      >
        {inner}
      </Link>
    );
  }

  return (
    <article className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
      {inner}
    </article>
  );
}
