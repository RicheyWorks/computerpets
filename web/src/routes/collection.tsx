import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PetCard } from "@/components/pet-card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSanctuary, type CompanionView } from "@/lib/pets/actions";
import { departLine, extinctLines, fairHouse } from "@/lib/pets/nest";

export const Route = createFileRoute("/collection")({ component: Collection });

function Collection() {
  const { user, isPending } = useCurrentUserState();
  const [pets, setPets] = useState<CompanionView[] | null>(null);
  const [gone, setGone] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([]);
  const [ribbons, setRibbons] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    void getSanctuary()
      .then((d) => {
        setPets(d.pets);
        setLeft(d.departed.map((p) => p.farewell ?? departLine(p.name, p.species_key)));
        const once = new Set([...d.pets, ...d.departed].map((p) => p.species_key));
        setGone(
          extinctLines(
            once,
            d.pets.map((p) => p.species_key),
            d.clutches.map((c) => c.species_key),
          ).map((e) => e.line),
        );
        setRibbons(
          fairHouse(
            d.pets.map((p) => ({
              id: p.id,
              species_key: p.species_key,
              name: p.name,
              genotype: p.genes,
            })),
            d.departed.map((p) => ({
              id: p.id,
              species_key: p.species_key,
              name: p.name,
              genotype: p.genes,
              departed: true,
            })),
          ).flatMap((row) => row.ribbons.map((r) => r.line)),
        );
      })
      .catch(() => setPets([]));
  }, [user]);

  if (isPending) return <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-surface" />;
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Kennel</p>
          <h1 className="font-display text-4xl">Held tokens</h1>
          <p className="max-w-xl text-sm text-muted">
            Every hatch is a unique token: species, rarity, eyes, mark, aura.
            Neglect can close a line. The nest still keeps one.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link to="/nest">The nest</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/hatch">Hatch another</Link>
          </Button>
        </div>
      </header>

      {pets === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-[var(--radius-xl)] bg-surface" />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-8">
          <p className="font-display text-2xl">The kennel is quiet.</p>
          <p className="mt-2 text-sm text-muted">The hatchery is open. The nest waits.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}

      {ribbons.length > 0 ? (
        <ul className="space-y-1 text-sm text-muted">
          {ribbons.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      {left.length > 0 ? (
        <p className="text-sm text-muted">{left.join(" ")}</p>
      ) : null}

      {gone.length > 0 ? (
        <p className="text-sm text-muted">
          {gone.join(" ")} The catalog still teaches the species. A draw can
          bring a line home.
        </p>
      ) : null}
    </main>
  );
}
