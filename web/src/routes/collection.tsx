import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PetCard } from "@/components/pet-card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSanctuary, type CompanionView } from "@/lib/pets/actions";

export const Route = createFileRoute("/collection")({ component: Collection });

function Collection() {
  const { user, isPending } = useCurrentUserState();
  const [pets, setPets] = useState<CompanionView[] | null>(null);

  useEffect(() => {
    if (!user) return;
    void getSanctuary()
      .then((d) => setPets(d.pets))
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
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link to="/hatch">Hatch another</Link>
        </Button>
      </header>

      {pets === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-[var(--radius-xl)] bg-surface" />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-8">
          <p className="font-display text-2xl">No companions yet.</p>
          <p className="mt-2 text-sm text-muted">The hatchery is open.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </main>
  );
}
