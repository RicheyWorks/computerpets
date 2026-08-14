import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Meter } from "@/components/ui/progress";
import { PetPortrait, RarityBadge } from "@/components/pet-card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  careForPet,
  getSanctuary,
  renamePet,
  setActivePet,
  type CompanionView,
} from "@/lib/pets/actions";
import { findSpecies } from "@/lib/pets/catalog";
import { bondScore, moodWord } from "@/lib/pets/care";

export const Route = createFileRoute("/pets/$key")({ component: PetDetail });

function PetDetail() {
  const { key } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [pet, setPet] = useState<CompanionView | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getSanctuary()
      .then((d) => {
        const found = d.pets.find((p) => p.id === key) ?? null;
        setPet(found);
        setName(found?.name ?? "");
      })
      .catch(() => setPet(null));
  }, [user, key]);

  if (isPending || pet === undefined) {
    return <div className="h-80 animate-pulse rounded-[var(--radius-xl)] bg-surface" />;
  }
  if (!user) return <RedirectToSignIn />;
  if (!pet) {
    return (
      <main className="space-y-3">
        <h1 className="font-display text-3xl">Token not in this kennel.</h1>
        <Link to="/collection" className="text-sm text-primary">
          Back to kennel
        </Link>
      </main>
    );
  }

  const species = findSpecies(pet.species_key);
  const petId = pet.id;

  async function act(action: "feed" | "play" | "rest") {
    setBusy(true);
    try {
      setPet(await careForPet({ data: { petId, action } }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Care failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="space-y-8">
      <Toaster theme="dark" position="bottom-center" />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-elevated">
          <PetPortrait speciesKey={pet.species_key} alt={pet.name} />
        </div>
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <RarityBadge rarity={pet.rarity} />
              {pet.is_active ? (
                <span className="text-xs uppercase tracking-[0.16em] text-subtle">On desk</span>
              ) : null}
            </div>
            <h1 className="font-display text-4xl">{pet.name}</h1>
            <p className="font-mono text-xs text-subtle">{pet.token_id}</p>
            <p className="text-sm text-muted">{species?.blurb}</p>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <Meta label="Species" value={species?.displayName ?? pet.species_key} />
            <Meta label="Temperament" value={species?.temperament ?? "—"} />
            <Meta label="Habitat" value={species?.habitat ?? "—"} />
            <Meta label="Eyes" value={pet.eyes} />
            <Meta label="Mark" value={pet.mark} />
            <Meta label="Aura" value={pet.aura} />
          </dl>

          <div className="grid gap-3 sm:grid-cols-3">
            <Meter label="Hunger" value={pet.hunger} />
            <Meter label="Mood" value={pet.mood} />
            <Meter label="Energy" value={pet.energy} />
          </div>
          <p className="text-sm text-muted">
            {moodWord(pet)} · bond {bondScore(pet)}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button disabled={busy} onClick={() => void act("feed")}>
              Feed
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void act("play")}>
              Play
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void act("rest")}>
              Rest
            </Button>
            {!pet.is_active ? (
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  void setActivePet({ data: { petId: pet.id } }).then(() =>
                    setPet({ ...pet, is_active: true }),
                  );
                }}
              >
                Place on desk
              </Button>
            ) : null}
          </div>

          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void renamePet({ data: { petId: pet.id, name } }).then(() => {
                setPet({ ...pet, name });
                toast.success("Name sealed");
              });
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              className="h-11 flex-1 rounded-[var(--radius-sm)] border border-border bg-elevated px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" variant="secondary">
              Rename
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">{label}</dt>
      <dd className="mt-1 capitalize">{value}</dd>
    </div>
  );
}
