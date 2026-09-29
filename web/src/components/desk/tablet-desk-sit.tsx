import { CARE_VERBS } from "@/lib/pets/mac-desk";

/** The sit on the tablet. Care lives here. It is not a shop. Narrow enough to end before the phone's strip at the
 * bottom right (at 42rem they crossed on any screen under about 1,210 px); --demo-strip-room is in styles.css. */
export function TabletDeskSit({ name }: { name: string }) {
  return (
    <div
      data-tablet-sit
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="tablet-sit-rail flex max-w-[max(9rem,min(42rem,100%-var(--demo-strip-room,36rem)))] items-center gap-2 rounded-full border border-border/40 bg-bg/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-subtle backdrop-blur-[2px]">
        {/* Plain words: which desk this strip stands for. It said "the extra / the mark / the sit", words only the code used. */}
        <p className="shrink-0">{name} · on a tablet</p>
        <p className="hidden min-w-0 truncate sm:block">{CARE_VERBS.join(" · ")}</p>
      </div>
    </div>
  );
}
