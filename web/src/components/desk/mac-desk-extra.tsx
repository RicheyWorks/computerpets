import { CARE_VERBS } from "@/lib/pets/mac-desk";

/** The extra on the Mac desk. Care lives here. It is not a shop. */
export function MacDeskExtra({ name }: { name: string }) {
  return (
    <div
      data-mac-extra
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-7 items-center justify-between gap-4 border-b border-border/40 bg-bg/55 px-3 text-[10px] uppercase tracking-[0.16em] text-subtle backdrop-blur-[2px]"
    >
      {/* Plain words: which desk this strip stands for. It said "the extra / the mark / the sit", words only the code used. */}
      <p>
        {name} · on a Mac
      </p>
      <p className="hidden min-w-0 truncate sm:block">{CARE_VERBS.join(" · ")}</p>
    </div>
  );
}
