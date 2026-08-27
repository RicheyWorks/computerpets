import { useEffect, useMemo, useRef, useState } from "react";
import { livingByKey } from "@/lib/pets/living";
import { beginCalled, dismissCalled, stepCalled, stillVisible, type CalledWalker } from "@/lib/pets/call-guests";
import { traitFor } from "@/lib/pets/traits";

export function CalledGuests({
  keys,
  hostKey,
  hidden,
}: {
  keys: string[];
  hostKey?: string;
  hidden?: boolean;
}) {
  const list = useMemo(() => keys.filter((k, i, all) => k && k !== hostKey && all.indexOf(k) === i), [hostKey, keys]);
  const [on, setOn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const walkers = useRef<CalledWalker[]>([]);
  const frames = useRef<Record<string, string[]>>({});
  const acc = useRef<Record<string, number>>({});
  const frame = useRef<Record<string, number>>({});

  useEffect(() => {
    if (hidden || !list.length) {
      walkers.current = [];
      setOn(false);
      return;
    }
    const width = window.innerWidth;
    walkers.current = list.map((key, i) => {
      const guest = livingByKey(key);
      frames.current[key] = [...(guest.sprites.walk?.length ? guest.sprites.walk : guest.sprites.idle)];
      acc.current[key] = 0;
      frame.current[key] = 0;
      guest.preload();
      return beginCalled(key, width, i, list.length);
    });
    setOn(true);
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      const w = window.innerWidth;
      walkers.current = walkers.current.map((g) => stepCalled(g, dt, w)).filter((g) => stillVisible(g));
      const nodes = rootRef.current?.querySelectorAll<HTMLElement>("[data-called]") ?? [];
      for (const el of nodes) {
        const key = el.getAttribute("data-called") || "";
        const g = walkers.current.find((row) => row.key === key);
        if (!g) {
          el.style.display = "none";
          continue;
        }
        el.style.display = "";
        const trait = traitFor(key);
        el.style.transform = `translate3d(${g.x}px, 0, 0) scale(${g.facing * (trait.scale || 1) * 0.72}, 1)`;
        const imgs = frames.current[key] || [];
        if (Math.abs(g.target - g.x) > 2) {
          acc.current[key] = (acc.current[key] || 0) + dt;
          if (acc.current[key] > 1 / 6.4 && imgs.length) {
            acc.current[key] = 0;
            frame.current[key] = ((frame.current[key] || 0) + 1) % imgs.length;
            const img = el.querySelector("img");
            if (img) img.src = imgs[frame.current[key]!]!;
          }
        }
      }
      if (!walkers.current.length) {
        setOn(false);
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [hidden, list]);

  if (hidden || !on && !list.length) return null;

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-[6]">
      {list.map((key) => {
        const guest = livingByKey(key);
        const src = frames.current[key]?.[0] || guest.sprites.idle[0];
        return (
          <button
            key={key}
            type="button"
            data-hit
            data-called={key}
            aria-label={`Dismiss ${guest.name}`}
            className="called-guest pointer-events-auto absolute bottom-0 left-0 h-32 w-32 origin-bottom bg-transparent p-0"
            onClick={(e) => {
              e.stopPropagation();
              walkers.current = walkers.current.map((row) => (row.key === key ? dismissCalled(row)! : row));
            }}
          >
            <img alt={guest.name} src={src} className="h-full w-full object-contain object-bottom" draggable={false} />
          </button>
        );
      })}
    </div>
  );
}
