import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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

export function SeaPage() {
  const [selected, setSelected] = useState(SEA_KEYS[0]!);

  return (
    <main className="bg-bg text-fg">
      <section className="relative isolate min-h-[58dvh] overflow-hidden">
        <img
          src="/habitat.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/30" />
        <div className="relative mx-auto flex min-h-[58dvh] max-w-5xl flex-col justify-end px-5 pb-12 pt-28 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">The tide</p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl leading-[0.95] sm:text-7xl">
            They swim. They stay. You learn the species.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted sm:text-lg">
            Ten marine animals live on this blotter. Watch the gait. Read the plaque. Leave knowing a
            moon jelly is not a fish, and a horseshoe crab is not a crab.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/demo/$slug" params={{ slug: "cup" }}>
                Watch Cup
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/study">The study</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/snakes">The snake den</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/garden">The garden</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/hive">The hive</Link>
            </Button>
          </div>
        </div>
      </section>

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

      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Field notes</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">All ten, told apart.</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            A short tell, one mix-up, and the corner of the house they already keep. Open a demo if
            you want them to stay on your screen.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {SEA_GUIDE.map((guide) => (
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
