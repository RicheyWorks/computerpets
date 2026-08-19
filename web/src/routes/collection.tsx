import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { CompanionRoom } from "@/components/desk/companion-room";
import { PetCard } from "@/components/pet-card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { careForPet, getSanctuary, type CompanionView } from "@/lib/pets/actions";
import { normalizeCare, type SanctuaryCare } from "@/lib/pets/care";
import { livingByKey, RED_PANDA_KIND } from "@/lib/pets/living";
import { departLine, extinctLines, fairHouse } from "@/lib/pets/nest";

export const Route = createFileRoute("/collection")({
  component: Collection,
  head: () => ({
    meta: [
      { title: "The kennel — ComputerPets" },
      {
        name: "description",
        content: "The kennel is a room. The cards stay paper.",
      },
    ],
  }),
});

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

  if (isPending) return <div className="h-dvh animate-pulse bg-surface" />;
  if (!user) return <RedirectToSignIn />;
  if (pets === null) return <div className="h-dvh animate-pulse bg-surface" />;

  const walker = pets.find((p) => p.is_active) ?? pets[0] ?? null;
  const kind = walker ? livingByKey(walker.species_key) : RED_PANDA_KIND;
  const walkerId = walker?.id;

  async function persistCare(action: SanctuaryCare) {
    if (!walkerId) return;
    const next = await careForPet({ data: { petId: walkerId, action } });
    setPets((prev) => prev?.map((p) => (p.id === next.id ? next : p)) ?? prev);
    if (next.note) toast.message(next.note);
    return normalizeCare({
      hunger: next.hunger,
      mood: next.mood,
      energy: next.energy,
      hygiene: next.hygiene,
      health: next.health,
      bornAt: next.bornAt,
    });
  }

  return (
    <>
      <Toaster theme="dark" position="bottom-center" />
      <CompanionRoom
        kind={kind}
        name={walker?.name}
        stage={walker?.stage}
        guestKey={walker ? `kennel-${walker.id}` : "kennel"}
        persistLocal={false}
        seed={
          walker
            ? {
                hunger: walker.hunger,
                mood: walker.mood,
                energy: walker.energy,
                hygiene: walker.hygiene,
                health: walker.health,
                bornAt: walker.bornAt,
              }
            : undefined
        }
        onCare={walker ? persistCare : undefined}
        detail="Kennel"
        extraCare={
          walker
            ? [
                { label: "Rest", action: "rest" },
                { label: "Clean", action: "clean" },
                { label: "Medicine", action: "medicine" },
              ]
            : undefined
        }
        line={
          <p className="mt-3 max-w-sm text-sm text-muted">
            The kennel is a room. The cards stay paper. Neglect can close a line.{" "}
            <Link to="/hatch" className="text-fg no-underline hover:text-primary">
              The hatchery is open.
            </Link>
          </p>
        }
        aside={
          <div className="mt-5 max-h-[calc(100dvh-16rem)] max-w-sm space-y-3 overflow-y-auto pr-1">
            <aside className="paper-card rounded-[var(--radius-lg)] border p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Kennel</p>
              <h2 className="mt-1 font-display text-2xl">The guests you keep.</h2>
              {pets.length === 0 ? (
                <p className="mt-3 text-sm text-muted">
                  The kennel is quiet. The hatchery is open. The nest waits.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {pets.map((pet) => (
                    <li key={pet.id}>
                      <PetCard pet={pet} />
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            {ribbons.length > 0 ? (
              <ul className="space-y-1 text-sm text-muted">
                {ribbons.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}

            {left.length > 0 ? <p className="text-sm text-muted">{left.join(" ")}</p> : null}

            {gone.length > 0 ? (
              <p className="text-sm text-muted">
                {gone.join(" ")} The catalog still teaches the species. A draw can bring a line home.
              </p>
            ) : null}
          </div>
        }
        footer={
          <p>
            <Link to="/hatch" className="text-fg no-underline hover:text-primary">
              The hatchery
            </Link>
            {" · "}
            <Link to="/nest" className="text-muted no-underline hover:text-fg">
              Pair at the nest
            </Link>
            {" · "}
            <Link to="/catalog" className="text-muted no-underline hover:text-fg">
              The shelf
            </Link>
            {" · "}
            <Link to="/meet" className="text-muted no-underline hover:text-fg">
              The house
            </Link>
          </p>
        }
      />
    </>
  );
}
