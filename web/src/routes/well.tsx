import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { WellDen, WellRail } from "@/components/desk/well-den";
import { RoomHero } from "@/components/desk/room-hero";
import { SpeciesPlaque } from "@/components/desk/species-plaque";
import { WELL_GUIDE } from "@/lib/pets/well-guide";
import { WELL_KEYS } from "@/lib/pets/well";

export const Route = createFileRoute("/well")({
  component: WellPage,
  head: () => ({
    meta: [
      { title: "The well — ComputerPets" },
      {
        name: "description",
        content: "Ten guests of the rest. A paramecium is not an animal.",
      },
    ],
  }),
});

export function WellPage() {
  const [selected, setSelected] = useState(WELL_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <RoomHero
        room="well"
        headline="A drop you look into."
        line="Ten guests of the rest live on this blotter. Watch the row. Read the plaque. Leave knowing a paramecium is not an animal, a euglena is not a plant, a kelp is not Felt, and an archaeon is not a bacterium."
      />

      <WellDen selectedKey={selected} onSelect={setSelected} />

      <section className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
        <WellRail selectedKey={selected} onSelect={setSelected} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpeciesPlaque speciesKey={selected} />
          <aside className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">How to use the well</p>
            <p className="mt-2 font-display text-2xl">Watch, then tap.</p>
            <p className="mt-2 text-sm text-muted">
              Five sit at a time. The rest cycle onto the wood. Treat, hide, and talk still live on
              each guest&apos;s demo and on the desk. A drop you look into. The plaque teaches.
            </p>
            <p className="mt-4">
              <Link to="/" search={{ pet: selected }} className="text-sm text-fg">
                Open the desk with this one
              </Link>
            </p>
          </aside>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Field notes</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">All ten, told apart.</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            A short tell, one mix-up, and the corner of the house they already keep. Open a demo if
            you want them to stay on your screen.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {WELL_GUIDE.map((guide) => (
              <article
                key={guide.key}
                className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{guide.species}</p>
                <h3 className="mt-2 font-display text-2xl leading-none">{guide.name}</h3>
                <p className="mt-1 font-mono text-[11px] italic text-subtle">{guide.latin}</p>
                <p className="mt-3 text-sm leading-snug text-fg">{guide.tell}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-subtle">A common mix-up</p>
                <p className="mt-1 text-sm leading-snug text-muted">{guide.mixup}</p>
                <p className="mt-3 text-xs text-subtle">
                  {guide.habitat} · {guide.temperament}
                </p>
                <p className="mt-4">
                  <Link
                    to="/demo/$slug"
                    params={{ slug: guide.slug }}
                    className="text-sm text-fg no-underline hover:text-primary"
                  >
                    /demo/{guide.slug}
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
