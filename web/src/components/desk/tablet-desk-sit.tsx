import { CARE_VERBS } from "@/lib/pets/mac-desk";

/** The sit on the tablet. Care lives here. It is not a shop. */
export function TabletDeskSit({ name }: { name: string }) {
  return (
    <nav
      data-tablet-sit
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="tablet-sit-rail flex max-w-[min(100%,42rem)] items-center gap-2 rounded-full border border-border/40 bg-bg/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-subtle backdrop-blur-[2px]">
        <p className="shrink-0">{name} · the sit</p>
        <p className="hidden min-w-0 truncate sm:block">{CARE_VERBS.join(" · ")}</p>
      </div>
    </nav>
  );
}
