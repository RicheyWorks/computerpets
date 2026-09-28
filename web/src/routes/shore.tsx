import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { ShoreDen, ShoreRail } from "@/components/desk/shore-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { SHORE_GUIDE } from "@/lib/pets/shore-guide";
import { SHORE_KEYS } from "@/lib/pets/shore";

export const Route = createFileRoute("/shore")({
  component: ShorePage,
  head: () => ({
    meta: [
      { title: "The shore — ComputerPets" },
      {
        name: "description",
        content: "Ten of the shore. A fiddler is not a hermit. A ghost crab is not a horseshoe crab.",
      },
    ],
  }),
});

function ShorePage() {
  const [selected, setSelected] = useState(SHORE_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="shore"
        headline="They walk. They stay."
        line="Ten of the shore live on this blotter. Watch the wave. Read the plaque. Leave knowing a fiddler is not a hermit, a ghost crab is not a horseshoe crab, a barnacle is not a limpet, and Heap is not Cast."
      />

      <ShoreDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <ShoreRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the shore</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They walk. A fiddler is not a hermit. A ghost
              crab is not a horseshoe crab. The plaque teaches.
            </p>
            <p className="mt-4">
              <Link to="/" search={{ pet: selected }} className="text-sm text-fg">
                Open the desk with this one
              </Link>
            </p>
          </aside>
        </div>
      </section>

      {/* The field notes: closed drawers, a search and #note-<slug> links (components/desk/field-notes.tsx). */}
      <FieldNotes notes={SHORE_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
