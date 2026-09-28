import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { classroomFor, plaqueFor } from "@/lib/pets/plaques";
import { cn } from "@/lib/utils";

export function SpeciesPlaque({
  speciesKey,
  compact = false,
  paper = false,
  showDemoLink = true,
  folded = false,
  line = false,
  className,
}: {
  speciesKey: string;
  compact?: boolean;
  paper?: boolean;
  showDemoLink?: boolean;
  /** Phone desk: name and kind only until opened, so the plaque does not run under the care buttons. */
  folded?: boolean;
  /** Short phone: even folded it would not fit above the care buttons, so it is one line until opened. */
  line?: boolean;
  className?: string;
}) {
  const guide = plaqueFor(speciesKey);
  const classroom = classroomFor(speciesKey);
  const [open, setOpen] = useState(!compact);
  useEffect(() => {
    setOpen(!compact);
  }, [speciesKey, compact]);
  if (!guide) return null;

  if (line && !open) {
    return (
      <article
        data-plaque="line"
        className={cn(
          "rounded-[var(--radius-md)] border border-border bg-bg/80 px-3 py-2 backdrop-blur-sm",
          paper && "paper-card backdrop-blur-none",
          className,
        )}
      >
        <button
          type="button"
          className="block w-full text-left text-sm text-fg underline-offset-2 hover:underline"
          onClick={() => setOpen(true)}
        >
          <span className="text-[11px] uppercase tracking-[0.16em] text-subtle">Species plaque</span> · About the {guide.species}
        </button>
      </article>
    );
  }

  return (
    <article
      data-plaque={folded && !open ? "folded" : open ? "open" : "closed"}
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-bg/80 p-4 backdrop-blur-sm",
        paper && "paper-card backdrop-blur-none",
        className,
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Species plaque</p>
      <h2 className="mt-2 font-display text-2xl leading-none">{guide.name}</h2>
      <p className="mt-1 text-sm text-muted">{guide.species}</p>
      <p className="mt-0.5 font-mono text-[11px] italic text-subtle">{guide.latin}</p>
      {folded && !open ? null : <p className="mt-3 text-sm leading-snug text-fg">{guide.tell}</p>}
      {open ? (
        <>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-subtle">A common mix-up</p>
          <p className="mt-1 text-sm leading-snug text-muted">{guide.mixup}</p>
          <p className="mt-3 text-xs text-subtle">
            {guide.habitat} · {guide.temperament}
          </p>
          {compact ? (
            <button
              type="button"
              className="mt-3 text-left text-xs text-subtle underline-offset-2 hover:text-fg hover:underline"
              onClick={() => setOpen(false)}
            >
              Fold the card
            </button>
          ) : null}
        </>
      ) : (
        <button
          type="button"
          className="mt-3 text-left text-xs text-subtle underline-offset-2 hover:text-fg hover:underline"
          onClick={() => setOpen(true)}
        >
          {folded ? `About the ${guide.species}` : "The mix-up, and where they live"}
        </button>
      )}
      {showDemoLink ? (
        <p className="mt-3">
          <Link
            to="/demo/$slug"
            params={{ slug: guide.slug }}
            className="text-sm text-fg no-underline hover:text-primary"
          >
            Watch {guide.name} {classroom.verb}
          </Link>
        </p>
      ) : (
        <p className="mt-3">
          <Link to={classroom.to} className="text-sm text-fg no-underline hover:text-primary">
            {classroom.label}
          </Link>
        </p>
      )}
    </article>
  );
}
