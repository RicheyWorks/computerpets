import { useEffect, useId, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DayWash } from "@/components/desk/blotter";
import { DenCabinet } from "@/components/desk/den-cabinet";
import { HouseFloor } from "@/components/desk/house-floor";
import { DeskGrain, RoomWash } from "@/components/desk/room-wash";
import { PetPortrait } from "@/components/pet-portrait";
import { LIVING_KINDS, type LivingKind } from "@/lib/pets/living";
import { guestMatches, matchLine, meetRoomAnchor, roomFromHash } from "@/lib/pets/meet-index";
import { guestsIn, roomOf, ROOMS, type RoomId } from "@/lib/pets/rooms";
import { MeetKeeperCard } from "@/components/desk/keeper-card";
import { traitFor } from "@/lib/pets/traits";

export const Route = createFileRoute("/meet")({
  component: MeetPage,
  head: () => ({
    meta: [
      { title: "Meet the house — ComputerPets" },
      {
        name: "description",
        content:
          "Two hundred twenty-one living companions walk the blotter. The nest is a square; neglect can close a line.",
      },
    ],
  }),
});

function MeetPage() {
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
            Two hundred twenty-one guests walk the blotter. On Windows they walk on the real desktop. This page is the same house in a browser. The nest is a square; neglect can close a line.
          </p>
          <MeetKeeperCard className="mt-6" />
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button asChild>
              <Link to="/demo/$slug" params={{ slug: "rui" }}>
                Watch Rui
              </Link>
            </Button>
            <Link to="/" className="inline-flex min-h-11 items-center text-sm text-muted no-underline hover:text-fg">
              Open the desk
            </Link>
          </div>
          <DenCabinet className="mt-8" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">The catalog</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">Two hundred twenty-one, on their shelves.</h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          Open a room. Or pick a name. They will be walking when the page opens.
        </p>

        <MeetShelves />
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
                Transparent overlay. Treat, chase, hide. They walk the real screen. All two hundred twenty-one.
              </p>
              <p className="mt-3 font-mono text-xs text-subtle">desktop/ — npm start</p>
            </article>
            <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Phone and tablet</p>
              <h3 className="mt-2 font-display text-2xl">On the home screen</h3>
              <p className="mt-2 text-sm text-muted">
                On a tablet a tap is a choice. A drag is a carry. A long-press tends. On a phone they sit the
                tall blotter the same way. Open Live, then Add to Home Screen. All two hundred twenty-one.
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

/** One guest on the shelf: a portrait and a name, two to a row on a phone. */
function GuestCard({ kind, room }: { kind: LivingKind; room?: string }) {
  return (
    <Link
      to="/demo/$slug"
      params={{ slug: kind.slug }}
      data-meet-guest={kind.key}
      className="group overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface no-underline transition-colors duration-200 hover:border-border-strong"
    >
      <div className="aspect-square overflow-hidden bg-elevated sm:aspect-[4/5]">
        <PetPortrait
          speciesKey={kind.key}
          alt=""
          name={kind.name}
          kind={kind.speciesLabel}
          className="transition-transform duration-400 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-1 p-3 sm:space-y-2 sm:p-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-subtle sm:text-[11px]">
          {room ? `${kind.speciesLabel} · ${room}` : kind.speciesLabel}
        </p>
        <p className="font-display text-lg leading-none sm:text-2xl">{kind.name}</p>
        <p className="hidden text-sm text-muted sm:block">{kind.tagline}</p>
        <p className="hidden text-xs text-subtle sm:block">{traitFor(kind.key).verb}</p>
      </div>
    </Link>
  );
}

/**
 * The catalog on /meet: a room index, "Find a guest", and one drawer per room (closed at first). It used to be all
 * two hundred twenty-one cards in a row, about 135,000 px on a phone. A closed drawer still holds its cards, and
 * /meet#room-<id> (or a room link) opens that drawer, so every guest stays reachable.
 */
function MeetShelves() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<ReadonlySet<RoomId>>(() => new Set());
  const searchId = useId();
  const ids = useMemo(() => ROOMS.map((r) => r.id as string), []);
  const found = useMemo(() => LIVING_KINDS.filter((k) => guestMatches(k, query)), [query]);
  const searching = query.trim().length > 0;

  const openRoom = (id: RoomId, on = true) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  // /meet#room-snakes opens the snakes' drawer (a shared link, or the back button).
  useEffect(() => {
    const fromHash = () => {
      const id = roomFromHash(window.location.hash, ids);
      if (id) openRoom(id as RoomId);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [ids]);

  return (
    <div className="mt-8" data-meet-shelves>
      <nav aria-label="Jump to a room" data-meet-index className="flex flex-wrap gap-2">
        {ROOMS.map((room) => (
          <a
            key={room.id}
            href={`#${meetRoomAnchor(room.id)}`}
            onClick={() => {
              setQuery("");
              openRoom(room.id);
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-3 text-sm text-muted no-underline hover:border-border-strong hover:text-fg"
          >
            {room.label}
            <span className="ml-1.5 text-xs text-subtle">{guestsIn(room).length}</span>
          </a>
        ))}
      </nav>

      <div className="mt-6 max-w-md">
        <label htmlFor={searchId} className="text-[11px] uppercase tracking-[0.16em] text-subtle">
          Find a guest
        </label>
        <input
          id={searchId}
          type="search"
          data-meet-search
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="A name or a kind: Rui, fox, owl"
          autoComplete="off"
          className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-base text-fg outline-none placeholder:text-subtle focus:ring-2 focus:ring-primary/30"
        />
        <p className="mt-2 text-sm text-muted" aria-live="polite" data-meet-count>
          {matchLine(found.length, LIVING_KINDS.length, query, ROOMS.length)}
        </p>
      </div>

      {searching ? (
        <div data-meet-found className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {found.map((kind) => (
            <GuestCard key={kind.key} kind={kind} room={roomOf(kind.key).label} />
          ))}
        </div>
      ) : null}

      <div className={searching ? "hidden" : "mt-10 space-y-3"}>
        {ROOMS.map((room) => {
          const guests = guestsIn(room);
          return (
            <details
              key={room.id}
              id={meetRoomAnchor(room.id)}
              data-meet-room={room.id}
              open={open.has(room.id)}
              onToggle={(e) => {
                const now = e.currentTarget.open;
                if (now !== open.has(room.id)) openRoom(room.id, now);
              }}
              className="group scroll-mt-20 rounded-[var(--radius-lg)] border border-border bg-surface/40"
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 sm:px-5">
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.16em] text-subtle">{room.kicker}</span>
                  <span className="mt-0.5 block font-display text-2xl sm:text-3xl">{room.label}</span>
                  <span className="mt-0.5 block max-w-md text-sm text-muted">{room.line}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-sm text-muted">
                  {guests.length} {guests.length === 1 ? "guest" : "guests"}
                  <span aria-hidden className="inline-block transition-transform duration-150 group-open:rotate-90">
                    ›
                  </span>
                </span>
              </summary>
              <div className="px-4 pb-5 sm:px-5">
                <p>
                  <Link to={room.path} className="inline-flex min-h-11 items-center text-sm text-muted no-underline hover:text-fg">
                    Open the room
                  </Link>
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {guests.map((kind) => (
                    <GuestCard key={kind.key} kind={kind} />
                  ))}
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
