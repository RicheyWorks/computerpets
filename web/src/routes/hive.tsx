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
    "Comb stays Comb. These ten are other bees, a drone, a queen, and the nest as a place. A colony is many bees, one nest. Neglect can go quiet.",
};

export const Route = createFileRoute("/hive")({
  component: HivePage,
  head: () => ({
    meta: [
      { title: "The hive den — ComputerPets" },
      {
        name: "description",
        content: "The comb sits. Comb, Keep, and Hum keep it. The hive keeps a line. Neglect can go quiet.",
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
        headline="The comb sits. The line stays."
        line="Wax is the nest. Comb, Keep, and Hum sit on it. Brood in some cells. Stores in others. Neglect can go quiet. The nest still keeps one. Read the plaque. Leave knowing a bumblebee is not a honey bee, a carpenter bee does not keep honey the honey-bee way, a drone is not a worker, and the queen is not a second Comb."
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
              The comb sits. Comb, Keep, and Hum keep it. The rest cycle onto the wood. Nectar
              fills the stores. Tend the brood. Neglect can go quiet. Treat, hide, and talk still
              live on each guest&apos;s demo and on the desk. It is not a shop.
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
