import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HouseStudy, StudyRail } from "@/components/desk/house-study";
import { FieldNotes } from "@/components/desk/field-notes";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { HOUSE_GUIDE, HOUSE_KEYS } from "@/lib/pets/house-guide";

export const Route = createFileRoute("/study")({
  component: StudyPage,
  head: () => ({
    meta: [
      { title: "The study — ComputerPets" },
      {
        name: "description",
        content: "Twenty living companions on the blotter. Learn the species by watching them walk.",
      },
    ],
  }),
});

function StudyPage() {
  const [selected, setSelected] = useState(HOUSE_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="house"
        headline="They walk. They stay. You learn the house."
        line="Twenty companions live on this blotter. Watch the gait. Read the plaque. Leave knowing a red panda from a raccoon, and an axolotl from a fish."
      />

      <HouseStudy selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <StudyRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the study</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five walk at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each companion&apos;s demo and on the desk. The ten snakes keep{" "}
              <Link to="/snakes" className="text-fg underline underline-offset-2 hover:text-primary">
                their own den
              </Link>
              . The tide keeps the sea. The garden keeps the plants.
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
      <FieldNotes notes={HOUSE_GUIDE} heading="All twenty, told apart." example="fox" />
    </main>
  );
}
