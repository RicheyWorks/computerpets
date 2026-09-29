import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes, type FieldNoteSet } from "@/components/desk/field-notes";
import { HiveDen, HiveRail } from "@/components/desk/hive-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { BEE_GUIDE } from "@/lib/pets/bee-guide";
import { INSECT_GUIDE } from "@/lib/pets/insect-guide";
import { INSECT_KEYS } from "@/lib/pets/insects";

const BEES_AND_COMB: FieldNoteSet = {
  notes: BEE_GUIDE,
  kicker: "Bees and comb",
  heading: "Not ten copies of Comb.",
  intro:
    "Comb stays Comb. These ten are other bees, a drone, a queen, and the nest itself. A colony is many bees sharing one nest.",
};

export const Route = createFileRoute("/hive")({
  component: HivePage,
  head: () => ({
    meta: [
      { title: "The hive den — ComputerPets" },
      {
        name: "description",
        content: "A honeycomb and the insects around it. Feed the hive with Nectar and let it rest with Tend.",
      },
    ],
  }),
});

function HivePage() {
  const [selected, setSelected] = useState(INSECT_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="hive"
        headline="A beehive, and the bugs around it."
        line="The honeycomb in the middle is the hive itself. Comb the honeybee, Keep the queen, and Hum the drone sit on it, and the other insects take turns on the wood. Brood counts the cells with young bees in them; Stores is the food put by. Left alone too long, the hive goes quiet, and care brings it back. Tap a guest to read its plaque and leave knowing a bumblebee is not a honey bee, a carpenter bee does not keep honey the honey-bee way, a drone is not a worker, and the queen is not a second Comb."
      />

      <HiveDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <HiveRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the hive</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Tap any guest to read about it. <strong className="text-fg">Nectar</strong> feeds the
              hive and fills its Stores. <strong className="text-fg">Tend</strong> lets the bees rest
              and get their energy back. If the hive has gone quiet, either one brings it back. Treat,
              hide, and talk are on each guest&apos;s demo and on the desk. It is not a shop.
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
      {/* One search and one Open all for both sets: the bees and comb were a second section with its own search. */}
      <FieldNotes notes={INSECT_GUIDE} heading="The insects, told apart." more={BEES_AND_COMB} />
    </main>
  );
}
