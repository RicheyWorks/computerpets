import { createFileRoute } from "@tanstack/react-router";
import { SpeciesCard } from "@/components/pet-card";
import { SPECIES, type Rarity } from "@/lib/pets/catalog";
import { isLivingSpecies } from "@/lib/pets/living";

export const Route = createFileRoute("/catalog")({ component: Catalog });

const ORDER: Rarity[] = ["LEGENDARY", "RARE", "UNCOMMON", "COMMON"];

function Catalog() {
  return (
    <main className="space-y-10">
      <header className="max-w-xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Catalog</p>
        <h1 className="font-display text-4xl">The twenty.</h1>
        <p className="text-sm text-muted">
          Wire keys match the ComputerPets backend. What you hatch here is the
          same species the license service already knows.
        </p>
      </header>

      {ORDER.map((rarity) => {
        const group = SPECIES.filter((s) => s.rarity === rarity);
        return (
          <section key={rarity} className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.18em] text-subtle">{rarity}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((s) => (
                <SpeciesCard
                  key={s.key}
                  speciesKey={s.key}
                  name={s.displayName}
                  rarity={s.rarity}
                  blurb={s.blurb}
                  to={isLivingSpecies(s.key) ? "/" : undefined}
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
