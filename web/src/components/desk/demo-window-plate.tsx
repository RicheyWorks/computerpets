import { useEffect, useRef } from "react";
import type { DeskWindow } from "@/lib/pets/windows";
import { DEMO_WINDOW_ID } from "@/lib/pets/windows";

/** A drawn window on /demo. Overlay uses real window rects instead. */
export function DemoWindowPlate({ onBounds }: { onBounds?: (windows: DeskWindow[]) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = () => {
      const stage = el.closest("section") || el.parentElement;
      if (!stage) return;
      const a = el.getBoundingClientRect();
      const b = stage.getBoundingClientRect();
      onBounds?.([
        {
          id: DEMO_WINDOW_ID,
          x: a.left - b.left,
          y: a.top - b.top,
          width: a.width,
          height: a.height,
        },
      ]);
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    ro.observe(el.closest("section") || el);
    window.addEventListener("resize", report);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", report);
    };
  }, [onBounds]);

  return (
    <div
      ref={ref}
      data-demo-window
      aria-hidden
      className="pointer-events-none absolute right-[12%] top-[16%] z-[1] h-[42%] w-[min(36rem,46%)] rounded-sm border border-border/50 bg-surface/35 shadow-lg"
    >
      <div className="flex h-7 items-center gap-1.5 border-b border-border/40 bg-bg/45 px-2">
        <span className="size-2 rounded-full bg-border/80" />
        <span className="size-2 rounded-full bg-border/80" />
        <span className="size-2 rounded-full bg-border/80" />
        <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-subtle">A window</span>
      </div>
    </div>
  );
}
