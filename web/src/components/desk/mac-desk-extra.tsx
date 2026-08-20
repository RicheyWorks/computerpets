import { CARE_VERBS } from "@/lib/pets/mac-desk";

/** The extra on the Mac desk. Care lives here. It is not a settings panel. */
export function MacDeskExtra({ name }: { name: string }) {
  return (
    <header
      data-mac-extra
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-7 items-center justify-between gap-4 border-b border-border/40 bg-bg/55 px-3 text-[10px] uppercase tracking-[0.16em] text-subtle backdrop-blur-[2px]"
    >
      <p>
        {name} · the extra
      </p>
      <p className="hidden min-w-0 truncate sm:block">{CARE_VERBS.join(" · ")}</p>
    </header>
  );
}
