import { useEffect, useRef, useState, type RefObject } from "react";
import { guardedLoop, makeGuestGuard } from "@/lib/pets/frame-guard";
import { dayPart } from "@/lib/pets/hours";
import { weatherOf, type Weather } from "@/lib/pets/weather";
import { carryX } from "@/lib/pets/ribbon";

export type BlotterMark = { kind: "treat" | "lure"; x: number; hops?: number; stolen?: boolean; carried?: boolean };

export function DayWash({ sky }: { sky?: Weather }) {
  const part = dayPart();
  const night = part === "night";
  return (
    <>
      <div
        className={`absolute inset-0 bg-gradient-to-t from-bg via-bg/18 to-bg/35 ${
          night
            ? "brightness-[0.68]"
            : part === "dusk"
              ? "brightness-[0.82] saturate-[0.9]"
              : part === "dawn"
                ? "brightness-[0.9] saturate-50"
                : ""
        }`}
      />
      <div
        className={`desk-lamp pointer-events-none absolute inset-0 ${
          night ? "opacity-35" : part === "dusk" ? "opacity-70" : ""
        }`}
      />
      <WeatherLayer sky={sky} />
    </>
  );
}

export function WeatherLayer({ sky: live }: { sky?: Weather }) {
  const sky = live ?? weatherOf();
  if (sky === "clear") return null;
  return (
    <div className={`desk-weather desk-weather-${sky}`} aria-hidden>
      {sky === "rain"
        ? Array.from({ length: 18 }, (_, i) => <span key={i} className="desk-rain" style={{ left: `${4 + i * 5.4}%`, animationDelay: `${(i % 7) * 0.18}s` }} />)
        : sky === "wind"
          ? Array.from({ length: 8 }, (_, i) => <span key={i} className="desk-gust" style={{ top: `${18 + i * 8}%`, animationDelay: `${i * 0.4}s` }} />)
        : null}
    </div>
  );
}

export function BlotterMarks({
  mark,
  hidden,
  treatShape,
  onDropTreat,
  onCatchLure,
  onFlee,
  onDragLure,
  poseRef,
}: {
  mark: BlotterMark | null;
  hidden?: boolean;
  treatShape?: string;
  onDropTreat: (x: number) => void;
  onCatchLure: () => void;
  onFlee?: (x: number) => void;
  onDragLure?: (x: number) => void;
  poseRef?: RefObject<{ x: number; facing: 1 | -1 }>;
}) {
  const drag = useRef<{ x: number; from: number; moved: boolean } | null>(null);
  const lureRef = useRef<HTMLButtonElement>(null);
  const [guard] = useState(() => makeGuestGuard({ outcome: "The lure stays where it is and keeps following on the next frame." }));
  useEffect(() => {
    if (!mark?.carried || !poseRef) return;
    let raf = 0;
    // Safe state for a carry that threw: the lure stays where it was drawn last; the loop keeps running.
    guard.onReset(() => {});
    const step = () => {
      const el = lureRef.current;
      const pose = poseRef.current;
      if (el && pose) el.style.left = `${carryX(mark, pose.x, pose.facing)}px`;
    };
    const tick = guardedLoop(step, (next) => { raf = window.requestAnimationFrame(next); }, guard, () => "carried lure", () => window.cancelAnimationFrame(raf));
    raf = window.requestAnimationFrame(tick);
    return () => {
      tick.stop();
      guard.onReset(null);
      window.cancelAnimationFrame(raf);
    };
  }, [guard, mark, poseRef]);
  useEffect(() => {
    if (!onFlee || hidden || mark?.kind !== "lure" || (mark.hops ?? 0) > 0 || mark.stolen || mark.carried) return;
    const id = window.setTimeout(() => onFlee(randomLureX()), 2200);
    return () => window.clearTimeout(id);
  }, [hidden, mark, onFlee]);
  return (
    <>
      <button
        type="button"
        aria-label="Drop a treat on the blotter"
        className="absolute inset-0 z-[1] cursor-pointer bg-transparent"
        onClick={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          onDropTreat(((e.clientX - box.left) / box.width) * 100);
        }}
      />
      {mark?.kind === "treat" && !hidden ? (
        <span
          aria-hidden
          className={`desk-treat desk-treat-${treatShape ?? "crumb"} pointer-events-none absolute z-10`}
          style={{ left: `${mark.x}%`, bottom: "19.5%" }}
        />
      ) : null}
      {mark?.kind === "lure" && !hidden ? (
        <button
          type="button"
          aria-label="Catch the ribbon"
          ref={lureRef}
          className={`desk-lure absolute z-10 ${mark.carried ? "desk-lure-carried" : ""}`}
          style={{ left: mark.carried ? `${mark.x}px` : `${mark.x}%`, bottom: "28%" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            drag.current = { x: e.clientX, from: mark.x, moved: false };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current || !onDragLure) return;
            const box = e.currentTarget.parentElement?.getBoundingClientRect();
            const dx = e.clientX - drag.current.x;
            if (Math.abs(dx) > 6) drag.current.moved = true;
            if (!drag.current.moved || !box) return;
            const next = Math.max(8, Math.min(92, drag.current.from + (dx / box.width) * 100));
            onDragLure(next);
          }}
          onPointerUp={() => {
            const moved = !!drag.current?.moved;
            drag.current = null;
            if (moved) return;
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (drag.current?.moved) return;
            onCatchLure();
          }}
        />
      ) : null}
    </>
  );
}

export function randomTreatX() {
  return 18 + Math.random() * 62;
}

export function randomLureX() {
  return 16 + Math.random() * 68;
}
