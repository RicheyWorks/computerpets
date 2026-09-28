import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { CellarDen, CellarRail } from "@/components/desk/cellar-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { FUNGI_GUIDE } from "@/lib/pets/fungi-guide";
import { FUNGI_KEYS } from "@/lib/pets/fungi";

export const Route = createFileRoute("/cellar")({
  component: CellarPage,
  head: () => ({
    meta: [
      { title: "The cellar den — ComputerPets" },
      {
        name: "description",
        content: "Ten living fungi on the blotter. Learn the species by watching them stay.",
      },
    ],
  }),
});

function CellarPage() {
  const [selected, setSelected] = useState(FUNGI_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="cellar"
        headline="They stay. The plaque teaches."
        line="Ten fungi live on this blotter. Watch the lean. Read the plaque. Leave knowing a mushroom is not a plant, a puff is a cloud, and a lichen is two kingdoms in one guest."
      />

      <CellarDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <CellarRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the cellar</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They stay. They do not commute.
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
      <FieldNotes notes={FUNGI_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
