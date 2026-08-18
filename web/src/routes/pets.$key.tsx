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
  releasePet,
  renamePet,
  setActivePet,
  type CompanionView,
} from "@/lib/pets/actions";
import { findSpecies } from "@/lib/pets/catalog";
import { adultLuna, bondScore, moodWord } from "@/lib/pets/care";
import { formatDiploid } from "@/lib/pets/genetics";
import { departLine } from "@/lib/pets/nest";

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
        const found = d.pets.find((p) => p.id === key) ?? d.departed.find((p) => p.id === key) ?? null;
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
  const gone = pet.departed;

  async function act(action: "feed" | "play" | "rest" | "clean" | "medicine") {
    setBusy(true);
    try {
      const next = await careForPet({ data: { petId, action } });
      setPet(next);
      if (next.note) toast.message(next.note);
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
            {gone ? (
              <p className="text-sm text-muted">{pet.farewell ?? departLine(pet.name, pet.species_key)}</p>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <Meta label="Species" value={species?.displayName ?? pet.species_key} />
            <Meta label="Temperament" value={species?.temperament ?? "—"} />
            <Meta label="Habitat" value={species?.habitat ?? "—"} />
            <Meta label="Eyes" value={`${pet.eyes} · ${formatDiploid(pet.genes.eyes ?? ["A", "A"])}`} />
            <Meta label="Mark" value={`${pet.mark} · ${formatDiploid(pet.genes.band ?? ["B", "B"])}${formatDiploid(pet.genes.mask ?? ["m", "m"])}`} />
            <Meta label="Aura" value={`${pet.aura} · ${formatDiploid(pet.genes.aura ?? ["s", "s"])}`} />
            <Meta label="Stage" value={pet.stage} />
          </dl>
          <p className="text-sm text-muted">
            A hatchling from the nest starts fresh. The square is how a look
            hid, and how it can return.
          </p>

          {gone ? null : (
          <div className="grid gap-3 sm:grid-cols-3">
            <Meter label="Hunger" value={pet.hunger} />
            <Meter label="Mood" value={pet.mood} />
            <Meter label="Energy" value={pet.energy} />
            <Meter label="Hygiene" value={pet.hygiene} />
            <Meter label="Health" value={pet.health} />
          </div>
          )}
          {gone ? null : (
          <p className="text-sm text-muted">
            {pet.stage} · {moodWord(pet)} · bond {bondScore(pet)}
            {adultLuna(pet.species_key, pet) ? " · Ghost does not eat." : ""}
          </p>
          )}

          <div className="flex flex-wrap gap-2">
            {gone ? null : (
              <>
            <Button disabled={busy} onClick={() => void act("feed")}>
              Feed
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void act("play")}>
              Play
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void act("rest")}>
              Rest
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void act("clean")}>
              Clean
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void act("medicine")}>
              Medicine
            </Button>
              </>
            )}
            {gone ? null : !pet.is_active ? (
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
            {gone ? null : (
              <>
            <Button asChild variant="ghost">
              <Link to="/nest">Pair at the nest</Link>
            </Button>
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => {
                if (!window.confirm("Let this one go? The line may end here.")) return;
                setBusy(true);
                void releasePet({ data: { petId } })
                  .then(() => {
                    toast.success("Gone from this house.");
                    setPet(null);
                  })
                  .finally(() => setBusy(false));
              }}
            >
              Let go
            </Button>
              </>
            )}
          </div>

          {gone ? (
            <Button asChild variant="secondary">
              <Link to="/collection">Back to kennel</Link>
            </Button>
          ) : (
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
          )}
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
