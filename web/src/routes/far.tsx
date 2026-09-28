import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { FarDen, FarRail } from "@/components/desk/far-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { FAR_GUIDE } from "@/lib/pets/far-guide";
import { FAR_KEYS } from "@/lib/pets/far";

export const Route = createFileRoute("/far")({
  component: FarPage,
  head: () => ({
    meta: [
      { title: "The far den — ComputerPets" },
      {
        name: "description",
        content: "Ten guests that never evolved here. Learn the species by watching them stay.",
      },
    ],
  }),
});

function FarPage() {
  const [selected, setSelected] = useState(FAR_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="far"
        headline="They arrived. They stay."
        line="Ten guests that never evolved here live on this blotter. Watch the hover. Read the plaque. Leave knowing a thirst is a wavelength, a colony can be one name, and most of a life can be the wait."
      />

      <FarDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <FarRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the far den</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They arrived. They stay. You learn the
              species.
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
      <FieldNotes notes={FAR_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
