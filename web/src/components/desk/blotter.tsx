import { useEffect } from "react";
import { dayPart } from "@/lib/pets/hours";

export type BlotterMark = { kind: "treat" | "lure"; x: number; hops?: number };

export function DayWash() {
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
    </>
  );
}

export function BlotterMarks({
  mark,
  hidden,
  onDropTreat,
  onCatchLure,
  onFlee,
}: {
  mark: BlotterMark | null;
  hidden?: boolean;
  onDropTreat: (x: number) => void;
  onCatchLure: () => void;
  onFlee?: (x: number) => void;
}) {
  useEffect(() => {
    if (!onFlee || hidden || mark?.kind !== "lure" || (mark.hops ?? 0) > 0) return;
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
          className="desk-treat pointer-events-none absolute z-10"
          style={{ left: `${mark.x}%`, bottom: "19.5%" }}
        />
      ) : null}
      {mark?.kind === "lure" && !hidden ? (
        <button
          type="button"
          aria-label="Catch the lure"
          className="desk-lure absolute z-10"
          style={{ left: `${mark.x}%`, bottom: "28%" }}
          onClick={(e) => {
            e.stopPropagation();
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
