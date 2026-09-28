import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { ReefDen, ReefRail } from "@/components/desk/reef-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { REEF_GUIDE } from "@/lib/pets/reef-guide";
import { REEF_KEYS } from "@/lib/pets/reef";

export const Route = createFileRoute("/reef")({
  component: ReefPage,
  head: () => ({
    meta: [
      { title: "The reef — ComputerPets" },
      {
        name: "description",
        content: "Ten of the reef. A coral is not a plant. An anemone is not a jelly.",
      },
    ],
  }),
});

function ReefPage() {
  const [selected, setSelected] = useState(REEF_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="reef"
        headline="They walk the living rock."
        line="Ten of the reef live on this blotter. Watch the ridge. Read the plaque. Leave knowing a coral is not a plant, an anemone is not a jelly, a clownfish is not a goldfish, a parrotfish is not a parrot, and a grouper is not a moray."
      />

      <ReefDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <ReefRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the reef</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They walk the living rock. A coral is not a
              plant. An anemone is not a jelly. The plaque teaches.
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
      <FieldNotes notes={REEF_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
