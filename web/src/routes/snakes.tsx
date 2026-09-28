import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FieldNotes } from "@/components/desk/field-notes";
import { RoomHero } from "@/components/desk/room-hero";
import { SnakeDen, SnakeRail } from "@/components/desk/snake-den";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { SNAKE_GUIDE } from "@/lib/pets/snake-guide";
import { SNAKE_KEYS } from "@/lib/pets/snakes";

export const Route = createFileRoute("/snakes")({
  component: SnakesPage,
  head: () => ({
    meta: [
      { title: "The snake den — ComputerPets" },
      {
        name: "description",
        content: "Ten living snakes on the blotter. Learn the species by watching them crawl.",
      },
    ],
  }),
});

function SnakesPage() {
  const [selected, setSelected] = useState(SNAKE_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="snakes"
        headline="They crawl. They stay. You learn the species."
        line="Ten snakes live on this blotter. Watch the gait. Read the plaque. Leave knowing a ball python from a boa, and a milk snake from the rhyme that is not her cousin."
      />

      <SnakeDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <SnakeRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the den</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five crawl at a time. The rest cycle onto the wood. Treat, hide, talk, and shed still
              live on each snake&apos;s demo and on the desk.
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
      <FieldNotes notes={SNAKE_GUIDE} heading="All ten, told apart." />
    </main>
  );
}
