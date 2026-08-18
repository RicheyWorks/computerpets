import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { CompanionRoom } from "@/components/desk/companion-room";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSanctuary, hatchPet } from "@/lib/pets/actions";
import { RED_PANDA_KIND } from "@/lib/pets/living";

export const Route = createFileRoute("/hatch")({
  component: Hatchery,
  head: () => ({
    meta: [
      { title: "The hatchery — ComputerPets" },
      {
        name: "description",
        content: "The hatch is a room. The draw lands you with the guest.",
      },
    ],
  }),
});

function Hatchery() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [ember, setEmber] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getSanctuary()
      .then((d) => setEmber(d.ember))
      .catch(() => setEmber(0));
  }, [user]);

  if (isPending) return <div className="h-dvh animate-pulse bg-surface" />;
  if (!user) return <RedirectToSignIn />;

  async function draw() {
    if (busy) return;
    setBusy(true);
    try {
      const pet = await hatchPet();
      toast.success(`${pet.name} is walking. The draw landed.`);
      await navigate({ to: "/pets/$key", params: { key: pet.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The draw failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Toaster theme="dark" position="bottom-center" />
      <CompanionRoom
        kind={RED_PANDA_KIND}
        guestKey="hatchery"
        persistLocal={false}
        detail="Hatchery"
        extraMarks={[
          {
            label: busy ? "Drawing…" : "Draw",
            onClick: () => void draw(),
            disabled: busy || ember === null,
          },
        ]}
        line={
          <p className="mt-3 max-w-sm text-sm text-muted">
            The hatch is a room. The draw is the act.{" "}
            <Link to="/nest" className="text-fg no-underline hover:text-primary">
              Or pair two you already keep.
            </Link>
          </p>
        }
        aside={
          <article className="paper-card mt-5 max-w-sm rounded-[var(--radius-lg)] border p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Ember on hand</p>
            <p className="mt-2 font-display text-4xl tabular-nums">{ember ?? "—"}</p>
            <p className="mt-3 text-sm text-muted">
              Twelve ember to start. Commons cost four. Cost is taken after the draw.
            </p>
            <p className="mt-2 text-xs text-subtle">Commons come often. Legendaries are scarce on purpose.</p>
          </article>
        }
        footer={
          <p>
            <Link to="/collection" className="text-fg no-underline hover:text-primary">
              The kennel
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
