import { GRID_LIVE } from "@/lib/pets/keeper";

const TRAY_NAMES = ["Rui", ...GRID_LIVE.map((guest) => guest.name)];

/** The tray on the Windows desk. Care lives here. It is not a shop. */
export function WindowsDeskSit({ name }: { name: string }) {
  return (
    <aside
      data-windows-sit
      className="pointer-events-none absolute bottom-10 left-3 z-30 flex max-w-[min(100%-1.5rem,28rem)] flex-col gap-1 rounded-sm border border-border/40 bg-bg/55 px-2 py-1.5 text-[10px] uppercase tracking-[0.16em] text-subtle backdrop-blur-[2px]"
    >
      <p className="shrink-0">{name} · on Windows · tray: On the desk</p>
      <p className="hidden min-w-0 truncate sm:block">{TRAY_NAMES.join(" · ")}</p>
      <p className="hidden min-w-0 truncate sm:block">Clicks pass the glass</p>
    </aside>
  );
}
