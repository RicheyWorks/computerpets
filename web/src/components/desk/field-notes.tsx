import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { guestMatches, noteAnchor, noteFromHash, notesLine } from "@/lib/pets/meet-index";

/** One guest's field note (lib/pets/house-guide.ts HouseGuide, lib/pets/log-guide.ts LogGuide). */
export type FieldNote = {
  key: string;
  slug: string;
  name: string;
  species: string;
  latin: string;
  tell: string;
  mixup: string;
  habitat: string;
  temperament: string;
};

/** A second set of notes under its own heading (FieldNotes more). */
export type FieldNoteSet = { kicker: string; heading: string; intro?: ReactNode; notes: readonly FieldNote[] };

/**
 * A room's field notes, walkable on a phone. /study listed twenty tall notes one after another (8,697 px of the
 * page's 10,959 at 375×667) and /log ten (4,472 of 6,607). Now each note is a drawer with the guest's name and kind,
 * closed at first; "Open all" opens them, "Find a guest" filters them by name or kind, and /study#note-rui opens
 * Rui's. Every note stays in the page (a closed drawer still holds its words), so nothing is out of reach. The
 * eighteen room pages (/snakes, /sea, /garden, ...) use it too; /hive has two sets (the insects, then bees and comb)
 * under one search and one Open all (more).
 */
export function FieldNotes({
  notes,
  heading,
  example,
  kicker = "Field notes",
  intro,
  more,
}: {
  notes: readonly FieldNote[];
  heading: string;
  /** A kind to suggest when a search finds nothing ("millipede"); the last note's kind when not given. */
  example?: string;
  /** The small label over the heading ("Bees and comb" on /hive's second set). */
  kicker?: string;
  /** The words under the heading, when a room says it its own way. */
  intro?: ReactNode;
  /** A second set under its own heading, found by the same search and opened by the same Open all (/hive's bees). */
  more?: FieldNoteSet;
}) {
  const all = useMemo(() => [...notes, ...(more?.notes ?? [])], [notes, more]);
  // The #note- effect is keyed by the slugs, not the array: a new array with the same notes must not re-run it (it
  // clears the search).
  const slugKey = all.map((n) => n.slug).join(" ");
  const hint = example ?? (all[all.length - 1]?.species.toLowerCase() || "fox");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  const searchId = useId();
  const slugs = useMemo(() => slugKey.split(" "), [slugKey]);
  const searching = query.trim().length > 0;
  const shown = useMemo(
    () => all.filter((n) => guestMatches({ key: n.key, slug: n.slug, name: n.name, speciesLabel: n.species }, query)),
    [all, query],
  );
  const allOpen = open.size === all.length;

  const openNote = (slug: string, on = true) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (on) next.add(slug);
      else next.delete(slug);
      return next;
    });

  // /study#note-rui opens Rui's note (a shared link, or the back button).
  useEffect(() => {
    const fromHash = () => {
      const slug = noteFromHash(window.location.hash, slugs);
      if (slug) {
        setQuery("");
        openNote(slug);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [slugs]);


  const renderNote = (guide: FieldNote) => {
    const match = shown.includes(guide);
    const isOpen = searching ? match : open.has(guide.slug);
    return (
      <details
        key={guide.key}
        id={noteAnchor(guide.slug)}
        data-note={guide.key}
        hidden={!match}
        open={isOpen}
        onToggle={(e) => {
          const now = e.currentTarget.open;
          if (!searching && now !== open.has(guide.slug)) openNote(guide.slug, now);
        }}
        className="group scroll-mt-20 rounded-[var(--radius-lg)] border border-border bg-surface"
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3">
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-[0.16em] text-subtle">{guide.species}</span>
            <span className="mt-1 block font-display text-2xl leading-none">{guide.name}</span>
          </span>
          <span aria-hidden className="shrink-0 text-muted transition-transform duration-150 group-open:rotate-90">
            ›
          </span>
        </summary>
        <div className="px-5 pb-5">
          <p className="font-mono text-[11px] italic text-subtle">{guide.latin}</p>
          <p data-note-tell className="mt-3 text-sm leading-snug text-fg">
            {guide.tell}
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-subtle">A common mix-up</p>
          <p className="mt-1 text-sm leading-snug text-muted">{guide.mixup}</p>
          <p className="mt-3 text-xs text-subtle">
            {guide.habitat} · {guide.temperament}
          </p>
          <p className="mt-2">
            <Link
              to="/demo/$slug"
              params={{ slug: guide.slug }}
              className="inline-flex min-h-11 items-center text-sm text-fg no-underline hover:text-primary"
            >
              /demo/{guide.slug}
            </Link>
          </p>
        </div>
      </details>
    );
};
  return (
    <section className="border-t border-border" data-field-notes>
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">{kicker}</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">{heading}</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">
          {intro ??
            "A short tell, one mix-up, and the corner of the house they already keep. Open a demo if you want them to stay on your screen."}
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-3">
          <div className="w-full max-w-md">
            <label htmlFor={searchId} className="text-[11px] uppercase tracking-[0.16em] text-subtle">
              Find a guest
            </label>
            <input
              id={searchId}
              type="search"
              data-notes-search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`A name or a kind: ${notes[0]?.name ?? ""}, ${hint}`}
              autoComplete="off"
              className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-base text-fg outline-none placeholder:text-subtle focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="button"
            data-notes-all
            hidden={searching}
            aria-pressed={allOpen}
            onClick={() => setOpen(allOpen ? new Set() : new Set(slugs))}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm text-muted hover:border-border-strong hover:text-fg"
          >
            {allOpen ? "Close all" : `Open all ${all.length}`}
          </button>
        </div>
        <p className="mt-2 text-sm text-muted" aria-live="polite" data-notes-count>
          {notesLine(shown.length, all.length, query, hint)}
        </p>

        <div className="mt-6 grid items-start gap-3 md:grid-cols-2 md:gap-4">{notes.map(renderNote)}</div>
        {more ? (
          // /hive's bees and comb: their own heading under the same search and Open all (one search for both).
          <div data-notes-more hidden={searching && !more.notes.some((n) => shown.includes(n))} className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">{more.kicker}</p>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl">{more.heading}</h3>
            {more.intro ? <p className="mt-3 max-w-xl text-sm text-muted">{more.intro}</p> : null}
            <div className="mt-6 grid items-start gap-3 md:grid-cols-2 md:gap-4">{more.notes.map(renderNote)}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
