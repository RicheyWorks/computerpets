import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { RoomHero } from "@/components/desk/room-hero";
import { SeaDen, SeaRail } from "@/components/desk/sea-den";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { SEA_GUIDE } from "@/lib/pets/sea-guide";
import { SEA_KEYS } from "@/lib/pets/sea";

export const Route = createFileRoute("/sea")({
  component: SeaPage,
  head: () => ({
    meta: [
      { title: "The tide den — ComputerPets" },
      {
        name: "description",
        content: "Ten living sea creatures on the blotter. Learn the species by watching them swim.",
      },
    ],
  }),
});

function SeaPage() {
  const [selected, setSelected] = useState(SEA_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="tide"
        headline="They swim. They stay. You learn the species."
        line="Ten marine animals live on this blotter. Watch the gait. Read the plaque. Leave knowing a moon jelly is not a fish, and a horseshoe crab is not a crab."
      />

      <SeaDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <SeaRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the tide</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five swim at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. The house turtle and the goldfish kept their
              corners.
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
      <FieldNotes notes={SEA_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
