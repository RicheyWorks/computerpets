import { createFileRoute, Link } from "@tanstack/react-router";
import { SpeciesCard } from "@/components/pet-card";
import { SPECIES, type Rarity } from "@/lib/pets/catalog";
import { isLivingSpecies, livingByKey } from "@/lib/pets/living";

export const Route = createFileRoute("/catalog")({ component: Catalog });

const ORDER: Rarity[] = ["LEGENDARY", "RARE", "UNCOMMON", "COMMON"];

function Catalog() {
  return (
    <main className="space-y-10">
      <header className="max-w-xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Catalog</p>
        <h1 className="font-display text-4xl">The seventy.</h1>
        <p className="text-sm text-muted">
          Wire keys match the ComputerPets backend. What you hatch here is the
          same species the license service already knows. The study is where you
          learn the twenty who walk. The den is where you learn the ten snakes.
          The tide is where you learn the ten sea creatures. The garden is where
          you learn the ten plants. The hive is where you learn the ten insects.
          The cellar is where you learn the ten fungi.
        </p>
        <p className="flex flex-wrap gap-4">
          <Link to="/study" className="text-sm text-fg">
            Open the study
          </Link>
          <Link to="/snakes" className="text-sm text-fg">
            Open the snake den
          </Link>
          <Link to="/sea" className="text-sm text-fg">
            Open the tide
          </Link>
          <Link to="/garden" className="text-sm text-fg">
            Open the garden
          </Link>
          <Link to="/hive" className="text-sm text-fg">
            Open the hive
          </Link>
          <Link to="/cellar" className="text-sm text-fg">
            Open the cellar
          </Link>
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
                  to={isLivingSpecies(s.key) ? `/demo/${livingByKey(s.key).slug}` : undefined}
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
