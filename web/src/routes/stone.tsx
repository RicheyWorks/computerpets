import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { StoneDen, StoneRail } from "@/components/desk/stone-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { STONE_GUIDE } from "@/lib/pets/stone-guide";
import { STONE_KEYS } from "@/lib/pets/stone";

export const Route = createFileRoute("/stone")({
  component: StonePage,
  head: () => ({
    meta: [
      { title: "The stone — ComputerPets" },
      {
        name: "description",
        content: "Ten of the stone on the blotter. A tuatara is not a lizard. An alligator is not a crocodile.",
      },
    ],
  }),
});

function StonePage() {
  const [selected, setSelected] = useState(STONE_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="stone"
        headline="A gecko climbs. A tuatara is still."
        line="Ten of the stone live on this blotter. Watch the pads. Read the plaque. Leave knowing a tuatara is not a lizard, an alligator is not a crocodile, a gecko is not a salamander, and Lid shuts."
      />

      <StoneDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <StoneRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the stone</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. A gecko climbs. A chameleon walks slow. An
              alligator sits the bank. A tuatara is still. The plaque teaches.
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
      <FieldNotes notes={STONE_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
