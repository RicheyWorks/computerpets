import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { findSpecies, portraitSrc } from "@/lib/pets/catalog";
import {
  PORTRAIT_NOTE,
  PORTRAIT_NOTE_TITLE,
  dismissPortraitNote,
  markPortraitFailed,
  portraitNoteShown,
  subscribePortraits,
} from "@/lib/pets/portrait-state";
import { cn } from "@/lib/utils";

/**
 * A pet portrait. When the picture cannot be drawn (a Git LFS placeholder, or a missing file), the pet's
 * name and kind sit in a tidy tile instead of a broken-image icon, and the page note says why once.
 */
export function PetPortrait({
  speciesKey,
  alt,
  name,
  kind,
  className,
}: {
  speciesKey: string;
  alt: string;
  name?: string;
  kind?: string;
  className?: string;
}) {
  const [brokenKey, setBrokenKey] = useState<string | null>(null);
  const broken = brokenKey === speciesKey;
  const img = useRef<HTMLImageElement | null>(null);
  const fail = () => {
    setBrokenKey(speciesKey);
    markPortraitFailed(speciesKey);
  };
  // A server-rendered picture can fail before React is listening; ask the element once after mount.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) fail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speciesKey]);

  if (broken) {
    const species = findSpecies(speciesKey);
    const label = name || alt || species?.displayName || speciesKey;
    const kindLabel = kind ?? species?.displayName ?? "";
    return (
      <div
        data-portrait-fallback={speciesKey}
        role={alt ? "img" : undefined}
        aria-label={alt ? (kindLabel && kindLabel !== label ? `${label}, ${kindLabel}` : label) : undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-1 bg-elevated p-2 text-center",
          className,
        )}
      >
        <span className="font-display text-2xl leading-none text-fg">{label.slice(0, 1).toUpperCase()}</span>
        <span className="text-[11px] leading-tight text-muted">{label}</span>
        {kindLabel && kindLabel !== label ? (
          <span className="text-[10px] leading-tight text-subtle">{kindLabel}</span>
        ) : null}
      </div>
    );
  }

  return (
    <img
      ref={img}
      src={portraitSrc(speciesKey)}
      alt={alt}
      onError={fail}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

/** One note for the whole page when any portrait failed, with the Git LFS steps. Got it hides it. */
export function PortraitNote() {
  const show = useSyncExternalStore(subscribePortraits, portraitNoteShown, () => false);
  if (!show) return null;
  return (
    <div
      role="status"
      data-portrait-note=""
      className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[min(36rem,calc(100%-2rem))] rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-sm shadow-lg"
    >
      <p className="font-medium text-fg">{PORTRAIT_NOTE_TITLE}</p>
      <p className="mt-1 text-muted">{PORTRAIT_NOTE}</p>
      <button
        type="button"
        onClick={dismissPortraitNote}
        className="mt-3 rounded-[var(--radius-sm)] border border-border px-3 py-1.5 text-sm text-fg hover:border-border-strong"
      >
        Got it
      </button>
    </div>
  );
}
