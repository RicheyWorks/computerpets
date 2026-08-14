import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LIVING_KINDS } from "@/lib/pets/living";
import { portraitSrc } from "@/lib/pets/catalog";
import { traitFor } from "@/lib/pets/traits";

export const Route = createFileRoute("/meet")({
  component: MeetPage,
  head: () => ({
    meta: [
      { title: "Meet the house — ComputerPets" },
      {
        name: "description",
        content: "Twenty living companions for Windows, Mac, tablets, and phones.",
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
              <Link to="/live">Phone and tablet</Link>
            </Button>
            <Button asChild variant="secondary">
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
                <p className="text-xs text-subtle">{traitFor(kind.key).verb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Every screen</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Windows, Mac, tablets, phones.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Windows and Mac</p>
              <h3 className="mt-2 font-display text-2xl">On the desktop</h3>
              <p className="mt-2 text-sm text-muted">
                Transparent overlay. They walk the real screen, sit on the taskbar, live in the tray. All twenty.
              </p>
              <p className="mt-3 font-mono text-xs text-subtle">desktop/ — npm start</p>
            </article>
            <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Phone and tablet</p>
              <h3 className="mt-2 font-display text-2xl">On the home screen</h3>
              <p className="mt-2 text-sm text-muted">
                Open Live, then Add to Home Screen. Fullscreen companion, big targets, all twenty in the picker.
              </p>
              <p className="mt-3">
                <Link to="/live" className="text-sm text-fg">
                  Open Live
                </Link>
              </p>
            </article>
            <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Browser</p>
              <h3 className="mt-2 font-display text-2xl">Share a demo</h3>
              <p className="mt-2 text-sm text-muted">
                Every animal has a live page. Send the link. They will be on the blotter when it opens.
              </p>
              <p className="mt-3 font-mono text-xs text-subtle">/demo/ember</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
