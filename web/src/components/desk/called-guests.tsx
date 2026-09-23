import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { livingByKey } from "@/lib/pets/living";
import {
  beginCalled,
  dismissCalled,
  markSung,
  ROBIN_SONG,
  shouldSing,
  stepCalled,
  stillVisible,
  poseFrames,
  firstWindowBound,
  firstCapBound,
  firstTransomBound,
  shouldTell,
  tellLine,
  markTold,
  type CalledWalker,
} from "@/lib/pets/call-guests";
import { traitFor } from "@/lib/pets/traits";
import type { DeskWindow } from "@/lib/pets/windows";
import { firstGrassBound, loadPlants } from "@/lib/pets/desk-plants";
import { paintCalledFrame } from "@/lib/pets/desk-sprite-surface";

export function CalledGuests({
  keys,
  hostKey,
  hidden,
  hostSleeping,
  hostPoseRef,
  onSong,
  windows,
}: {
  keys: string[];
  hostKey?: string;
  hidden?: boolean;
  hostSleeping?: boolean;
  hostPoseRef?: RefObject<{ x: number; facing: 1 | -1 }>;
  onSong?: (line: string) => void;
  windows?: DeskWindow[];
}) {
  const list = useMemo(() => keys.filter((k, i, all) => k && k !== hostKey && k !== "hummingbird" && k !== "robin" && all.indexOf(k) === i), [hostKey, keys]);
  const [on, setOn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const walkers = useRef<CalledWalker[]>([]);
  const frames = useRef<Record<string, string[]>>({});
  const sitFrames = useRef<Record<string, string[]>>({});
  const acc = useRef<Record<string, number>>({});
  const frame = useRef<Record<string, number>>({});
  const hiddenRef = useRef(hidden);
  const sleepRef = useRef(hostSleeping);
  const songRef = useRef(onSong);
  const windowsRef = useRef(windows);
  hiddenRef.current = hidden;
  sleepRef.current = hostSleeping;
  songRef.current = onSong;
  windowsRef.current = windows;

  useEffect(() => {
    if (!list.length) {
      walkers.current = [];
      setOn(false);
      return;
    }
    const width = window.innerWidth;
    walkers.current = list.map((key, i) => {
      const guest = livingByKey(key);
      frames.current[key] = [...(guest.sprites.walk?.length ? guest.sprites.walk : guest.sprites.idle)];
      sitFrames.current[key] = [...(guest.sprites.sit?.length ? guest.sprites.sit : guest.sprites.idle)];
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
      const pose = hostPoseRef?.current;
      const flags = {
        hidden: !!hiddenRef.current,
        hostKey,
        hostSleeping: !!sleepRef.current,
        hostX: pose?.x,
        hostLift: 0,
        hostFacing: pose?.facing,
        peers: walkers.current.map((row) => ({ key: row.key, x: row.x, lift: row.lift || 0, phase: row.phase })),
        windowBound: firstWindowBound(windowsRef.current, { width: w, height: window.innerHeight, floorLift: 0 }),
        capBound: firstCapBound(windowsRef.current, { width: w, height: window.innerHeight, floorLift: 0 }),
        transomBound: firstTransomBound(windowsRef.current, { width: w, height: window.innerHeight, floorLift: 0 }),
        grassBound: firstGrassBound(loadPlants(w, window.innerHeight), { width: w, height: window.innerHeight, floorLift: 0 }),
      };
      walkers.current = walkers.current.map((g) => {
        const next = stepCalled(g, dt, w, flags);
        if (shouldSing(next)) {
          songRef.current?.(ROBIN_SONG);
          return markSung(next);
        }
        if (shouldTell(next)) {
          const line = tellLine(next);
          if (line) songRef.current?.(line);
          return markTold(next);
        }
        return next;
      }).filter((g) => stillVisible(g));
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
        el.style.transform = `translate3d(${g.x}px, ${-(g.lift || 0)}px, 0) scale(${g.facing * (trait.scale || 1) * 0.72}, 1)`;
        const imgs = poseFrames(g, { sit: sitFrames.current[key], walk: frames.current[key], idle: frames.current[key] });
        if (Math.abs(g.target - g.x) > 2 && g.phase !== "perch" && g.phase !== "meet" && g.phase !== "bound") {
          acc.current[key] = (acc.current[key] || 0) + dt;
          if (acc.current[key] > 1 / 6.4 && imgs.length) {
            acc.current[key] = 0;
            frame.current[key] = ((frame.current[key] || 0) + 1) % imgs.length;
          }
        }
        const art = el.querySelector("canvas");
        if (art instanceof HTMLCanvasElement && imgs.length) {
          const src = imgs[(frame.current[key] || 0) % imgs.length] || imgs[0];
          if (src) paintCalledFrame(art, src);
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
  }, [hostKey, hostPoseRef, list]);

  if (!on && !list.length) return null;

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
            className="called-guest pointer-events-auto absolute bottom-0 left-0 h-32 w-32 origin-bottom border-0 bg-transparent p-0 shadow-none outline-none"
            onClick={(e) => {
              e.stopPropagation();
              walkers.current = walkers.current.map((row) => (row.key === key ? dismissCalled(row)! : row));
            }}
          >
            <canvas
              role="img"
              aria-label={guest.name}
              data-surface="pending"
              ref={(node) => {
                if (!node || node.dataset.seed === "1" || !src) return;
                node.dataset.seed = "1";
                paintCalledFrame(node, src);
              }}
              className="pointer-events-none block h-full w-full border-0 bg-transparent shadow-none outline-none"
            />
          </button>
        );
      })}
    </div>
  );
}
