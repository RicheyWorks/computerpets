import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { classroomFor, plaqueFor } from "@/lib/pets/plaques";
import { cn } from "@/lib/utils";

export function SpeciesPlaque({
  speciesKey,
  compact = false,
  showDemoLink = true,
  className,
}: {
  speciesKey: string;
  compact?: boolean;
  showDemoLink?: boolean;
  className?: string;
}) {
  const guide = plaqueFor(speciesKey);
  const classroom = classroomFor(speciesKey);
  const [open, setOpen] = useState(!compact);
  useEffect(() => {
    setOpen(!compact);
  }, [speciesKey, compact]);
  if (!guide) return null;

  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-bg/80 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Species plaque</p>
      <h2 className="mt-2 font-display text-2xl leading-none">{guide.name}</h2>
      <p className="mt-1 text-sm text-muted">{guide.species}</p>
      <p className="mt-0.5 font-mono text-[11px] italic text-subtle">{guide.latin}</p>
      <p className="mt-3 text-sm leading-snug text-fg">{guide.tell}</p>
      {open ? (
        <>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-subtle">A common mix-up</p>
          <p className="mt-1 text-sm leading-snug text-muted">{guide.mixup}</p>
          <p className="mt-3 text-xs text-subtle">
            {guide.habitat} · {guide.temperament}
          </p>
        </>
      ) : (
        <button
          type="button"
          className="mt-3 text-left text-xs text-subtle underline-offset-2 hover:text-fg hover:underline"
          onClick={() => setOpen(true)}
        >
          The mix-up, and where they live
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
