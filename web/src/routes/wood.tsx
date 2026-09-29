import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { WoodDen, WoodRail } from "@/components/desk/wood-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { WOOD_GUIDE } from "@/lib/pets/wood-guide";
import { WOOD_KEYS } from "@/lib/pets/wood";

export const Route = createFileRoute("/wood")({
  component: WoodPage,
  head: () => ({
    meta: [
      { title: "The wood — ComputerPets" },
      {
        name: "description",
        content: "Eleven of the wood on the blotter. A bat is not a bird. A porcupine is not Burr.",
      },
    ],
  }),
});

function WoodPage() {
  const [selected, setSelected] = useState(WOOD_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="wood"
        headline="They walk. A bat flies."
        line="Ten of the wood live on this blotter. Watch the flag. Read the plaque. Leave knowing a bat is not a bird, a porcupine is not Burr, an opossum can go still, and Coal is a bear, not Rui."
      />

      <WoodDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <WoodRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the wood</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. A bat flies. A deer walks. An otter swims. The
              plaque teaches.
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
      <FieldNotes notes={WOOD_GUIDE} heading="All eleven, told apart." />
    </main>
  );
}
