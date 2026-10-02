import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { guardedLoop, makeGuestGuard } from "@/lib/pets/frame-guard";
import { livingByKey } from "@/lib/pets/living";
import { linePicker } from "@/lib/pets/line-picker";
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
import { CALLED_REST, calmHold, reducedMotion, type CalmHold } from "@/lib/pets/calm-motion";
import { giveWay } from "@/lib/pets/give-way";

/** The frame guard's key for the shared part of the walk-on frame (not one guest's own step or paint). */
const ALL_CALLED = "called guests";

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
  // One guard for every walk-on. Each guest's step and paint runs under its own key, so one broken guest
  // leaves and the rest keep walking; an error in the shared part of the frame sends them all off.
  const [guard] = useState(() => makeGuestGuard({ outcome: "That guest leaves the desk; the other pets keep moving." }));

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
    const hide = (key: string) => {
      const nodes = rootRef.current?.querySelectorAll<HTMLElement>("[data-called]") ?? [];
      for (const el of nodes) {
        if (key === ALL_CALLED || el.getAttribute("data-called") === key) el.style.display = "none";
      }
    };
    // Safe state for a guest that threw: that guest leaves (dropped, hidden). The shared part of the frame
    // throwing sends every guest off and ends the walk-on.
    guard.onReset((key) => {
      if (key === ALL_CALLED) {
        walkers.current = [];
        tick.stop();
        setOn(false);
      } else {
        walkers.current = walkers.current.filter((row) => row.key !== key);
      }
      hide(key);
    });
    // Reduced motion: where each guest is drawn still (calm-motion.ts); null until it first rests.
    const holds: Record<string, CalmHold> = {};
    const paintGuest = (el: HTMLElement, key: string, g: CalledWalker, dt: number) => {
      const trait = traitFor(key);
      const imgs = poseFrames(g, { sit: sitFrames.current[key], walk: frames.current[key], idle: frames.current[key] });
      if (reducedMotion()) {
        // Drawn still where it rests, on its first frame; its walk goes on unseen and its next rest is a cut.
        const hold = (holds[key] = calmHold(holds[key] ?? null, g, CALLED_REST));
        el.style.display = hold ? "" : "none";
        if (!hold) return;
        el.style.transform = `translate3d(${hold.x}px, ${-hold.lift}px, 0) scale(${hold.facing * (trait.scale || 1) * 0.72}, 1)`;
        const art = el.querySelector("canvas");
        if (art instanceof HTMLCanvasElement && imgs[0]) paintCalledFrame(art, imgs[0]);
        return;
      }
      el.style.display = "";
      el.style.transform = `translate3d(${g.x}px, ${-(g.lift || 0)}px, 0) scale(${g.facing * (trait.scale || 1) * 0.72}, 1)`;
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
    };
    const step = (now: number) => {
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
      const moved: CalledWalker[] = [];
      for (const g of walkers.current) {
        guard.step((row: CalledWalker) => {
          let next = stepCalled(row, dt, w, flags);
          if (shouldSing(next)) {
            const song = linePicker.offer(next.key, ROBIN_SONG);
            if (song) songRef.current?.(song);
            next = markSung(next);
          } else if (shouldTell(next)) {
            // A guest's tell is optional: said once, then quiet if the same words came in the last 60 s.
            const line = linePicker.offer(next.key, tellLine(next));
            if (line) songRef.current?.(line);
            next = markTold(next);
          }
          if (stillVisible(next)) moved.push(next);
        }, g, g.key);
      }
      walkers.current = moved;
      const nodes = rootRef.current?.querySelectorAll<HTMLElement>("[data-called]") ?? [];
      for (const el of nodes) {
        const key = el.getAttribute("data-called") || "";
        const g = walkers.current.find((row) => row.key === key);
        if (!g) {
          el.style.display = "none";
          continue;
        }
        guard.step(() => paintGuest(el, key, g, dt), 0, key);
      }
      if (!walkers.current.length) {
        setOn(false);
        return false;
      }
      return true;
    };
    const tick = guardedLoop(step, (next) => { raf = window.requestAnimationFrame(next); }, guard, () => ALL_CALLED, () => window.cancelAnimationFrame(raf));
    raf = window.requestAnimationFrame(tick);
    return () => {
      tick.stop();
      guard.onReset(null);
      window.cancelAnimationFrame(raf);
    };
  }, [guard, hostKey, hostPoseRef, list]);

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
            // Walking under the care row or a link, it gives way until clear (give-way.ts).
            ref={giveWay}
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
