import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { PondDen, PondRail } from "@/components/desk/pond-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { POND_GUIDE } from "@/lib/pets/pond-guide";
import { POND_KEYS } from "@/lib/pets/pond";

export const Route = createFileRoute("/pond")({
  component: PondPage,
  head: () => ({
    meta: [
      { title: "The pond den — ComputerPets" },
      {
        name: "description",
        content: "Ten pond guests on the blotter. Learn the species by watching them stay.",
      },
    ],
  }),
});

function PondPage() {
  const [selected, setSelected] = useState(POND_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="pond"
        headline="They walk. They swim."
        line="Ten pond guests live on this blotter. Watch the hop. Read the plaque. Leave knowing a frog is not a toad, a newt is not a lizard, a caecilian is not a worm, and a crayfish is not an insect."
      />

      <PondDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <PondRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the pond</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They walk. They swim. The plaque teaches.
            </p>
            <p className="mt-4">
              <Link to="/" search={{ pet: selected }} className="inline-flex min-h-11 items-center text-sm text-fg">
                Open the desk with this one
              </Link>
            </p>
          </aside>
        </div>
      </section>

      {/* The field notes: closed drawers, a search and #note-<slug> links (components/desk/field-notes.tsx). */}
      <FieldNotes notes={POND_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
