import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DayWash } from "@/components/desk/blotter";
import { DenCabinet } from "@/components/desk/den-cabinet";
import { HouseFloor } from "@/components/desk/house-floor";
import { DeskGrain, RoomWash } from "@/components/desk/room-wash";
import { portraitSrc } from "@/lib/pets/catalog";
import { guestsIn, ROOMS } from "@/lib/pets/rooms";
import { traitFor } from "@/lib/pets/traits";

export const Route = createFileRoute("/meet")({
  component: MeetPage,
  head: () => ({
    meta: [
      { title: "Meet the house — ComputerPets" },
      {
        name: "description",
        content:
          "One hundred ninety living companions walk the blotter. The nest is a square; neglect can close a line.",
      },
    ],
  }),
});

export function MeetPage() {
  return (
    <main className="bg-bg text-fg">
      <section className="relative isolate min-h-[92dvh] overflow-hidden">
        <img
          src="/habitat.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_68%]"
        />
        <DayWash />
        <RoomWash room="house" />
        <DeskGrain />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-bg/20" />
        <HouseFloor framed={false} />
        <div className="relative z-10 mx-auto flex min-h-[92dvh] max-w-5xl flex-col justify-end px-5 pb-12 pt-28 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">ComputerPets</p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl leading-[0.95] sm:text-7xl">
            They live on the desk.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
            One hundred ninety guests walk the blotter. The nest is a square; neglect can close a line.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button asChild>
              <Link to="/demo/$slug" params={{ slug: "rui" }}>
                Watch Rui
              </Link>
            </Button>
            <Link to="/" className="text-sm text-muted no-underline hover:text-fg">
              Open the desk
            </Link>
          </div>
          <DenCabinet className="mt-8" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">The catalog</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">One hundred ninety, on their shelves.</h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          Open a room. Or pick a name. They will be walking when the page opens.
        </p>

        <div className="mt-12 space-y-14">
          {ROOMS.map((room) => (
            <div key={room.id}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{room.kicker}</p>
                  <h3 className="mt-1 font-display text-2xl sm:text-3xl">{room.label}</h3>
                  <p className="mt-1 max-w-md text-sm text-muted">{room.line}</p>
                </div>
                <Link to={room.path} className="text-sm text-muted no-underline hover:text-fg">
                  Open the room
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {guestsIn(room).map((kind) => (
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
                      <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                        {kind.speciesLabel}
                      </p>
                      <p className="font-display text-2xl leading-none">{kind.name}</p>
                      <p className="text-sm text-muted">{kind.tagline}</p>
                      <p className="text-xs text-subtle">{traitFor(kind.key).verb}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
                Transparent overlay. Treat, chase, hide. They walk the real screen. All one hundred ninety.
              </p>
              <p className="mt-3 font-mono text-xs text-subtle">desktop/ — npm start</p>
            </article>
            <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Phone and tablet</p>
              <h3 className="mt-2 font-display text-2xl">On the home screen</h3>
              <p className="mt-2 text-sm text-muted">
                On a tablet a tap talks. A drag is a carry. A long-press tends. On a phone they sit the
                tall blotter the same way. Open Live, then Add to Home Screen. All one hundred ninety.
              </p>
              <p className="mt-3">
                <Link to="/live" className="text-sm text-fg">
                  Open Live
                </Link>
              </p>
            </article>
            <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Browser</p>
              <h3 className="mt-2 font-display text-2xl">Share a room</h3>
              <p className="mt-2 text-sm text-muted">
                The demo is a room. The guest is already walking. Click the blotter. Send the link.
              </p>
              <p className="mt-3 font-mono text-xs text-subtle">/demo/rui</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
