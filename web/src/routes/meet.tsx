import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LIVING_KINDS } from "@/lib/pets/living";
import { portraitSrc } from "@/lib/pets/catalog";

export const Route = createFileRoute("/meet")({
  component: MeetPage,
  head: () => ({
    meta: [
      { title: "Meet the house — ComputerPets" },
      {
        name: "description",
        content: "Browser demos of the living desk. Rui, Miso, and Pip walk, talk, and wait.",
      },
    ],
  }),
});

export function MeetPage() {
  return (
    <main className="bg-bg text-fg">
      <section className="relative isolate min-h-[70dvh] overflow-hidden">
        <img
          src="/habitat.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/30" />
        <div className="relative mx-auto flex min-h-[70dvh] max-w-5xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">ComputerPets</p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl leading-[0.95] sm:text-7xl">
            They live on the desk.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
            Browser demos for every companion in the house. Walk them, feed them, let them talk.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/demo/$slug" params={{ slug: "rui" }}>
                Watch Rui
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/">Open the desk</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Awake</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Twenty living demos.</h2>
          </div>
          <Link to="/catalog" className="hidden text-sm text-muted no-underline hover:text-fg sm:inline">
            Full catalog
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LIVING_KINDS.map((kind) => (
            <Link
              key={kind.key}
              to="/demo/$slug"
              params={{ slug: kind.slug }}
              className="group overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface no-underline transition-colors duration-200 hover:border-border-strong"
            >
              <div className="aspect-[4/5] overflow-hidden bg-elevated">
                <img
                  src={portraitSrc(kind.key)}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="space-y-2 p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{kind.speciesLabel}</p>
                <p className="font-display text-2xl leading-none">{kind.name}</p>
                <p className="text-sm text-muted">{kind.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="max-w-md space-y-3">
            <h2 className="font-display text-3xl">Share a room, not a screenshot.</h2>
            <p className="text-sm text-muted">
              Each demo is a live page. Send any of them. They will be on the blotter when it opens.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/">Open the desk</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
