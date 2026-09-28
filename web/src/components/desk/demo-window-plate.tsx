import { useEffect, useRef, useState } from "react";
import { secondWindowSpot, type DemoWindowBox } from "@/lib/pets/demo-windows";
import type { DeskWindow } from "@/lib/pets/windows";
import { DEMO_WINDOW_B_ID, DEMO_WINDOW_ID } from "@/lib/pets/windows";

/** Drawn windows on /demo. Overlay uses real window rects instead. Relay hops A to B. Fuse holds one clip. Miso sits one ledge. Pip watches one window from the floor. Thimble thumps beside one window, then vanishes. */
export function DemoWindowPlate({ onBounds }: { onBounds?: (windows: DeskWindow[]) => void }) {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  // Where the second window goes once the room is measured: clear of the left panel (secondWindowSpot).
  const [bSpot, setBSpot] = useState<DemoWindowBox | null>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;
    const report = () => {
      const stage = a.closest("section") || a.parentElement;
      if (!stage) return;
      const s = stage.getBoundingClientRect();
      const aside = stage.querySelector("[data-desk-aside]")?.getBoundingClientRect();
      const spot = secondWindowSpot(s.width, s.height, aside && aside.width > 0 ? aside.right - s.left : 0);
      setBSpot((prev) => (prev && prev.left === spot.left && prev.top === spot.top && prev.width === spot.width && prev.height === spot.height ? prev : spot));
      const box = (el: HTMLElement, id: string): DeskWindow => {
        const r = el.getBoundingClientRect();
        return { id, x: r.left - s.left, y: r.top - s.top, width: r.width, height: r.height };
      };
      // The second window's bounds are its spot (its style follows on the next paint).
      onBounds?.([box(a, DEMO_WINDOW_ID), { id: DEMO_WINDOW_B_ID, x: spot.left, y: spot.top, width: spot.width, height: spot.height }]);
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(a);
    ro.observe(b);
    ro.observe(a.closest("section") || a);
    window.addEventListener("resize", report);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", report);
    };
  }, [onBounds]);

  return (
    <>
      <div
        ref={aRef}
        data-demo-window="a"
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
      <div
        ref={bRef}
        data-demo-window="b"
        aria-hidden
        style={bSpot ? { left: bSpot.left, top: bSpot.top, width: bSpot.width, height: bSpot.height } : undefined}
        className="pointer-events-none absolute left-[8%] top-[60%] z-[1] h-[24%] w-[min(24rem,30%)] rounded-sm border border-border/50 bg-surface/35 shadow-lg"
      >
        <div className="flex h-7 items-center gap-1.5 border-b border-border/40 bg-bg/45 px-2">
          <span className="size-2 rounded-full bg-border/80" />
          <span className="size-2 rounded-full bg-border/80" />
          <span className="size-2 rounded-full bg-border/80" />
          <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-subtle">A second window</span>
        </div>
      </div>
    </>
  );
}
