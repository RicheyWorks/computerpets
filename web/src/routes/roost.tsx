import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { RoostDen, RoostRail } from "@/components/desk/roost-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { ROOST_GUIDE } from "@/lib/pets/roost-guide";
import { ROOST_KEYS } from "@/lib/pets/roost";

export const Route = createFileRoute("/roost")({
  component: RoostPage,
  head: () => ({
    meta: [
      { title: "The roost den — ComputerPets" },
      {
        name: "description",
        content: "Ten birds on the blotter. Learn the species by watching them stay.",
      },
    ],
  }),
});

function RoostPage() {
  const [selected, setSelected] = useState(ROOST_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="roost"
        headline="They fly. They hop."
        line="Ten birds live on this blotter. Watch the fan. Read the plaque. Leave knowing a crow is not a raven, a hawk is not an owl, a mallard is not a goose, and a hummingbird is not a bee."
      />

      <RoostDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <RoostRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the roost</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They fly. They hop. The plaque teaches.
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
      <FieldNotes notes={ROOST_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
