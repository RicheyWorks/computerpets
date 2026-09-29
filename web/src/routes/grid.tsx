import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { GridDen, GridRail } from "@/components/desk/grid-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { GRID_GUIDE } from "@/lib/pets/grid-guide";
import { GRID_KEYS } from "@/lib/pets/grid";

export const Route = createFileRoute("/grid")({
  component: GridPage,
  head: () => ({
    meta: [
      { title: "The grid — ComputerPets" },
      {
        name: "description",
        content: "Ten of the grid on the blotter. A grid dragon is not a mantel dragon. A coil dragon is not a grid dragon. A path dragon is not a coil dragon. A field dragon is not a path dragon. A crack dragon is not a field dragon. A haze dragon is not a crack dragon. A filing dragon is not a haze dragon. A click dragon is not a filing dragon. A cartridge dragon is not a click dragon. An earth dragon is not a cartridge dragon. Arc is not Vesper. Volt is not Arc. Trace is not Arc. Flux is not Trace. Spark is not Flux. Ion is not Spark. Gauss is not Ion. Relay is not Gauss. Fuse is not Relay. Ground is not Fuse.",
      },
    ],
  }),
});

function GridPage() {
  const [selected, setSelected] = useState(GRID_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="grid"
        headline="Arc sits. Volt coils. Trace traces. Flux fields. Spark crackles. Ion hazes. Gauss files. Relay clicks. Fuse holds. Ground earths. The hide is weather."
        line="Ten of the grid live on this blotter. Watch the arc. Watch the coil. Watch the path. Watch the field. Watch the crackle. Watch the haze. Watch the filings. Watch the click. Watch the filament. Watch the strap. Read the plaque. Leave knowing a grid dragon is not a mantel dragon, a coil dragon is not a grid dragon, a path dragon is not a coil dragon, a field dragon is not a path dragon, a crack dragon is not a field dragon, a haze dragon is not a crack dragon, a filing dragon is not a haze dragon, a click dragon is not a filing dragon, a cartridge dragon is not a click dragon, an earth dragon is not a cartridge dragon, Arc is not Vesper, Volt is not Arc, Trace is not Arc, Flux is not Trace, Spark is not Flux, Ion is not Spark, Gauss is not Ion, Relay is not Gauss, Fuse is not Relay, and Ground is not Fuse."
      />

      <GridDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <GridRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the grid</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Arc sits the night. Volt keeps the coil. Trace keeps the path. Flux keeps the field. Spark keeps the crackle. Ion keeps the haze. Gauss keeps the filings. Relay keeps the click. Fuse keeps the filament. Ground keeps the strap. Treat, hide, and talk still live on a demo
              and on the desk. The hide is weather. The plaque teaches.
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
      <FieldNotes
        notes={GRID_GUIDE}
        heading="The ten, told apart."
        intro="A short tell, one mix-up, and the night each already keeps. Open a demo if you want one to stay on your screen."
      />
    </main>
  );
}
