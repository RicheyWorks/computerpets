import { GRID_LIVE } from "@/lib/pets/keeper";

const TRAY_NAMES = ["Rui", ...GRID_LIVE.map((guest) => guest.name)];

/**
 * The tray on the Windows desk. Care lives here. It is not a shop.
 * One line in the bottom band, left of the tablet strip (tablet-desk-sit.tsx), under the care row: three lines at
 * bottom-10 sat over Feed, Play and "Rui is hidden" at 1024–1440 px wide. Its width ends 8 px before the tablet
 * strip, whose width is max(9rem, min(42rem, 100% - --demo-strip-room)); the tray names and "Clicks pass the glass"
 * truncate.
 */
export function WindowsDeskSit({ name }: { name: string }) {
  return (
    <div
      data-windows-sit
      className="pointer-events-none absolute bottom-[max(0.65rem,env(safe-area-inset-bottom))] left-3 z-30 flex max-w-[calc(50%-max(4.5rem,min(21rem,50%-var(--demo-strip-room,36rem)/2))-1.25rem)] items-center gap-2 rounded-sm border border-border/40 bg-bg/55 px-2 py-1.5 text-[10px] uppercase tracking-[0.16em] text-subtle backdrop-blur-[2px]"
    >
      <p className="shrink-0">{name} · on Windows</p>
      <p className="min-w-0 truncate">
        Tray: On the desk · {TRAY_NAMES.join(" · ")} · Clicks pass the glass
      </p>
    </div>
  );
}
