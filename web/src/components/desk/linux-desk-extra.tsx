import { CARE_VERBS } from "@/lib/pets/mac-desk";

/** The mark on the Linux desk. Care lives here. It is not a shop. */
export function LinuxDeskExtra({ name }: { name: string }) {
  return (
    <aside
      data-linux-mark
      className="pointer-events-none absolute right-3 top-8 z-30 flex h-6 max-w-[min(100%-1.5rem,36rem)] items-center gap-2 rounded-sm border border-border/40 bg-bg/55 px-2 text-[10px] uppercase tracking-[0.16em] text-subtle backdrop-blur-[2px]"
    >
      <p className="shrink-0">{name} · the mark</p>
      <p className="hidden min-w-0 truncate sm:block">{CARE_VERBS.join(" · ")}</p>
    </aside>
  );
}
