import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LogDen, LogRail } from "@/components/desk/log-den";
import { FieldNotes } from "@/components/desk/field-notes";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { LOG_GUIDE } from "@/lib/pets/log-guide";
import { LOG_KEYS } from "@/lib/pets/log";

export const Route = createFileRoute("/log")({
  component: LogPage,
  head: () => ({
    meta: [
      { title: "The log — ComputerPets" },
      {
        name: "description",
        content: "Ten under the log. A millipede is not a centipede. A pillbug is not an insect.",
      },
    ],
  }),
});

function LogPage() {
  const [selected, setSelected] = useState(LOG_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="log"
        headline="They walk. They stay."
        line="Ten under the log live on this blotter. Watch the hunt. Read the plaque. Leave knowing a millipede is not a centipede, a pillbug is not an insect, a velvet worm jets glue, and Tun is not Coal."
      />

      <LogDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <LogRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the log</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. They walk. A millipede is not a centipede. A
              pillbug is not an insect. The plaque teaches.
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
      <FieldNotes notes={LOG_GUIDE} heading="All ten, told apart." example="millipede" />
    </main>
  );
}
