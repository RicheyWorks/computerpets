import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { CreekDen, CreekRail } from "@/components/desk/creek-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { CREEK_GUIDE } from "@/lib/pets/creek-guide";
import { CREEK_KEYS } from "@/lib/pets/creek";

export const Route = createFileRoute("/creek")({
  component: CreekPage,
  head: () => ({
    meta: [
      { title: "The creek — ComputerPets" },
      {
        name: "description",
        content: "Ten of the creek on the blotter. A bass is not a trout. A lamprey is not an eel.",
      },
    ],
  }),
});

function CreekPage() {
  const [selected, setSelected] = useState(CREEK_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="creek"
        headline="They swim. They stay."
        line="Ten of the creek live on this blotter. Watch the lunge. Read the plaque. Leave knowing a bass is not a trout, a lamprey is not an eel, a paddlefish filters, and Penny is not Coin."
      />

      <CreekDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <CreekRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the creek</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They swim. A paddlefish filters. A lamprey is a
              disk. The plaque teaches.
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
      <FieldNotes notes={CREEK_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
