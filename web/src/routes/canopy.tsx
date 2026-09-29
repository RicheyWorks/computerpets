import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { CanopyDen, CanopyRail } from "@/components/desk/canopy-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { CANOPY_GUIDE } from "@/lib/pets/canopy-guide";
import { CANOPY_KEYS } from "@/lib/pets/canopy";

export const Route = createFileRoute("/canopy")({
  component: CanopyPage,
  head: () => ({
    meta: [
      { title: "The canopy — ComputerPets" },
      {
        name: "description",
        content: "Ten of the canopy. A sloth is not a red panda. A koala is not a bear.",
      },
    ],
  }),
});

function CanopyPage() {
  const [selected, setSelected] = useState(CANOPY_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="canopy"
        headline="They hang. They glide."
        line="Ten of the canopy live on this blotter. Watch the hang. Read the plaque. Leave knowing a sloth is not a red panda, a lemur is not a raccoon, a gibbon is not a monkey, a flying squirrel is not a bird, and a koala is not a bear."
      />

      <CanopyDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <CanopyRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the canopy</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They hang. They glide. They howl. They keep
              still. The plaque teaches.
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
      <FieldNotes notes={CANOPY_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
