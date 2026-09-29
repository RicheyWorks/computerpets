import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { WellDen, WellRail } from "@/components/desk/well-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { WELL_GUIDE } from "@/lib/pets/well-guide";
import { WELL_KEYS } from "@/lib/pets/well";

export const Route = createFileRoute("/well")({
  component: WellPage,
  head: () => ({
    meta: [
      { title: "The well — ComputerPets" },
      {
        name: "description",
        content: "Ten guests of the rest. A paramecium is not an animal.",
      },
    ],
  }),
});

function WellPage() {
  const [selected, setSelected] = useState(WELL_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="well"
        headline="A drop you look into."
        line="Ten guests of the rest live on this blotter. Watch the row. Read the plaque. Leave knowing a paramecium is not an animal, a euglena is not a plant, a kelp is not Felt, and an archaeon is not a bacterium."
      />

      <WellDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <WellRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the well</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. A drop you look into. The plaque teaches.
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
      <FieldNotes notes={WELL_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
